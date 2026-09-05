"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  url: string;
  color?: string;
  height?: number;
  label?: string;
}

/**
 * Renders one STL or Draco-compressed GLB in its own WebGL context.
 *
 * The context is created only while the viewer is near the viewport and is
 * torn down again once it scrolls away. Browsers cap how many live WebGL
 * contexts a page may hold (Chrome ~16, mobile often 8) and silently kill the
 * oldest ones past that limit, which shows up as blank viewers. /progress has
 * more viewers than that cap, so mounting them all eagerly is not an option.
 */
export function StlViewer({ url, color = "#818cf8", height = 240, label }: Props) {
  const hostRef  = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [active, setActive]   = useState(false);
  const [loaded, setLoaded]   = useState(false);
  const [failed, setFailed]   = useState(false);

  // Activate while near the viewport; release the context once well past it.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => setActive(entries[0].isIntersecting),
      { rootMargin: "300px 0px" }
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !active) return;

    let disposed = false;
    let animId = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cleanup: (() => void) | null = null;

    const setup = async () => {
      const isGlb = /\.glb$/i.test(url);
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (disposed || !mountRef.current) return;

      const w = mount.clientWidth || 320;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, w / height, 0.001, 10000);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const sun = new THREE.DirectionalLight(0xffffff, 0.9);
      sun.position.set(2, 3, 4);
      scene.add(sun);
      const fill = new THREE.DirectionalLight(0xffffff, 0.3);
      fill.position.set(-2, -1, -2);
      scene.add(fill);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.5;
      controls.enableZoom = true;

      // Default framing so the first frames are not looking at nothing.
      camera.position.set(0, 0.5, 2.2);

      let root: import("three").Object3D | null = null;
      let draco: import("three/examples/jsm/loaders/DRACOLoader.js").DRACOLoader | null = null;
      let size = new THREE.Vector3(1, 1, 1);

      // Fit the part's actual extents to the canvas, not its bounding sphere.
      // A sphere around a tall or long object is much bigger than the object,
      // so sphere-fitting leaves it marooned in empty space. Width uses the
      // x/z diagonal, which is the widest the part gets as it auto-rotates.
      const frame = () => {
        const vFov = (camera.fov * Math.PI) / 180;
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
        const spin = Math.hypot(size.x, size.z);
        const distV = size.y / 2 / Math.tan(vFov / 2);
        const distH = spin / 2 / Math.tan(hFov / 2);
        const dist = Math.max(distV, distH, 1e-4) * 1.12;
        camera.position.set(0, dist * 0.22, dist);
        camera.near = dist / 100;
        camera.far = dist * 100;
        camera.updateProjectionMatrix();
        controls.target.set(0, 0, 0);
        controls.update();
      };

      const onError = () => {
        if (!disposed) setFailed(true);
      };

      // Fit whatever arrived (a bare STL geometry or a whole glTF scene) and
      // hand it to the shared framing/disposal path.
      const place = (obj: import("three").Object3D) => {
        const box = new THREE.Box3().setFromObject(obj);
        const center = new THREE.Vector3();
        box.getCenter(center);
        obj.position.sub(center);

        box.getSize(size);
        if (size.x <= 0 || size.y <= 0 || size.z <= 0) size.set(1, 1, 1);
        frame();

        root = obj;
        scene.add(obj);
        setLoaded(true);
      };

      if (isGlb) {
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
        if (disposed) return;

        // Draco-compressed geometry; the decoder is served from /public/draco.
        draco = new DRACOLoader();
        draco.setDecoderPath("/draco/");
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(draco);

        gltfLoader.load(
          url,
          (gltf) => {
            if (disposed) return;
            gltf.scene.traverse((o) => {
              const m = o as import("three").Mesh;
              if (m.isMesh) {
                m.material = new THREE.MeshPhongMaterial({
                  color,
                  specular: 0x2a2a2a,
                  shininess: 35,
                });
              }
            });
            place(gltf.scene);
          },
          undefined,
          onError
        );
      } else {
        const { STLLoader } = await import("three/examples/jsm/loaders/STLLoader.js");
        if (disposed) return;
        new STLLoader().load(
          url,
          (geometry) => {
            if (disposed) {
              geometry.dispose();
              return;
            }
            const material = new THREE.MeshPhongMaterial({
              color,
              specular: 0x333333,
              shininess: 50,
            });
            place(new THREE.Mesh(geometry, material));
          },
          undefined,
          onError
        );
      }

      // Keep the canvas matched to its column when the layout reflows.
      const ro = new ResizeObserver(() => {
        const nw = mount.clientWidth || w;
        renderer.setSize(nw, height);
        camera.aspect = nw / height;
        // Re-fit: a narrower column needs the camera further back.
        frame();
      });
      ro.observe(mount);

      const animate = () => {
        animId = requestAnimationFrame(animate);
        // No point spinning an offscreen tab's models.
        if (document.hidden) return;
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animId);
        ro.disconnect();
        controls.dispose();
        if (root) {
          scene.remove(root);
          root.traverse((o) => {
            const m = o as import("three").Mesh;
            if (!m.isMesh) return;
            m.geometry.dispose();
            const mat = m.material as import("three").Material | import("three").Material[];
            Array.isArray(mat) ? mat.forEach((x) => x.dispose()) : mat.dispose();
          });
        }
        draco?.dispose();
        renderer.dispose();
        // Hand the GPU context back immediately instead of waiting for GC,
        // so scrolling through the page never exhausts the context budget.
        renderer.forceContextLoss();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    };

    setup();

    return () => {
      disposed = true;
      cleanup?.();
      setLoaded(false);
    };
  }, [active, url, color, height]);

  return (
    <div
      ref={hostRef}
      className="rounded-xl overflow-hidden bg-indigo-950/30 border border-indigo-800/30 relative"
    >
      <div ref={mountRef} style={{ width: "100%", height: `${height}px` }} />

      {!loaded && !failed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] text-indigo-300/50 tracking-widest uppercase">
            Loading model
          </span>
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] text-indigo-300/60 tracking-widest uppercase">
            Model unavailable
          </span>
        </div>
      )}

      {label && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <span className="text-[10px] text-indigo-300/70 bg-indigo-950/60 px-2 py-0.5 rounded-full">
            {label}
          </span>
        </div>
      )}
      {loaded && (
        <div className="absolute top-2 right-2">
          <span className="text-[9px] text-indigo-400/50 bg-indigo-950/40 px-1.5 py-0.5 rounded">
            drag to rotate
          </span>
        </div>
      )}
    </div>
  );
}

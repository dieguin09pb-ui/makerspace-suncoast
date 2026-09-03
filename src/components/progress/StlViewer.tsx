"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  url: string;
  color?: string;
  height?: number;
  label?: string;
}

/**
 * Renders one STL in its own WebGL context.
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
      const THREE = await import("three");
      const { STLLoader } = await import("three/examples/jsm/loaders/STLLoader.js");
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

      let mesh: import("three").Mesh | null = null;
      let radius = 1;

      // Frame the part against whichever field of view is tighter, so a long
      // thin part (a 250 mm rail) fills the canvas instead of rendering as a
      // sliver the way a fixed maxDim multiplier does.
      const frame = () => {
        const vFov = (camera.fov * Math.PI) / 180;
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
        const dist = (radius / Math.sin(Math.min(vFov, hFov) / 2)) * 1.06;
        camera.position.set(0, radius * 0.32, dist);
        camera.near = dist / 100;
        camera.far = dist * 100;
        camera.updateProjectionMatrix();
        controls.target.set(0, 0, 0);
        controls.update();
      };

      const loader = new STLLoader();
      loader.load(
        url,
        (geometry) => {
          if (disposed) {
            geometry.dispose();
            return;
          }
          geometry.computeBoundingBox();
          const box = geometry.boundingBox!;
          const center = new THREE.Vector3();
          box.getCenter(center);
          geometry.translate(-center.x, -center.y, -center.z);

          geometry.computeBoundingSphere();
          radius = geometry.boundingSphere?.radius || 1;
          frame();

          const material = new THREE.MeshPhongMaterial({
            color,
            specular: 0x333333,
            shininess: 50,
          });
          mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
          setLoaded(true);
        },
        undefined,
        () => {
          if (!disposed) setFailed(true);
        }
      );

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
        if (mesh) {
          scene.remove(mesh);
          mesh.geometry.dispose();
          (mesh.material as import("three").Material).dispose();
        }
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

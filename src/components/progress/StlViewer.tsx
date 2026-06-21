"use client";

import { useEffect, useRef } from "react";

interface Props {
  url: string;
  color?: string;
  height?: number;
  label?: string;
}

export function StlViewer({ url, color = "#818cf8", height = 240, label }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animId: number;
    let renderer: import("three").WebGLRenderer | undefined;

    const setup = async () => {
      const THREE = await import("three");
      const { STLLoader } = await import("three/examples/jsm/loaders/STLLoader.js");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

      const w = mount.clientWidth || 320;
      const h = height;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.001, 10000);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
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

      const loader = new STLLoader();
      loader.load(url, (geometry) => {
        geometry.computeBoundingBox();
        const box = geometry.boundingBox!;
        const center = new THREE.Vector3();
        box.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);

        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        camera.position.set(0, maxDim * 0.5, maxDim * 2.2);
        camera.near = maxDim * 0.001;
        camera.far = maxDim * 100;
        camera.updateProjectionMatrix();
        controls.target.set(0, 0, 0);
        controls.update();

        const material = new THREE.MeshPhongMaterial({
          color,
          specular: 0x333333,
          shininess: 50,
        });
        scene.add(new THREE.Mesh(geometry, material));
      });

      const animate = () => {
        animId = requestAnimationFrame(animate);
        controls.update();
        renderer!.render(scene, camera);
      };
      animate();
    };

    setup();

    return () => {
      cancelAnimationFrame(animId);
      renderer?.dispose();
      if (mount.firstChild) mount.removeChild(mount.firstChild);
    };
  }, [url, color, height]);

  return (
    <div className="rounded-xl overflow-hidden bg-indigo-950/30 border border-indigo-800/30 relative">
      <div ref={mountRef} style={{ width: "100%", height: `${height}px` }} />
      {label && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <span className="text-[10px] text-indigo-300/70 bg-indigo-950/60 px-2 py-0.5 rounded-full">
            {label}
          </span>
        </div>
      )}
      <div className="absolute top-2 right-2">
        <span className="text-[9px] text-indigo-400/50 bg-indigo-950/40 px-1.5 py-0.5 rounded">drag to rotate</span>
      </div>
    </div>
  );
}

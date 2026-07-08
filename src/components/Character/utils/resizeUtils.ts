import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  let canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  const isMobile = window.innerWidth <= 1024;
  camera.position.set(0, isMobile ? 12.0 : 13.1, isMobile ? 33.0 : 24.7);
  camera.zoom = isMobile ? 0.9 : 1.1;
  camera.updateProjectionMatrix();

  const currentWidth = window.innerWidth;
  if (currentWidth === lastWidth) {
    // Skip heavy GSAP ScrollTrigger recreation on vertical-only resize (mobile address bar scroll)
    return;
  }
  lastWidth = currentWidth;

  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger != workTrigger) {
      trigger.kill();
    }
  });
  setCharTimeline(character, camera);
  setAllTimeline();
  ScrollTrigger.refresh();
}

import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

function createBrandTexture(name: string, brandColor: string, svgSlug?: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  const texture = new THREE.CanvasTexture(canvas);

  const drawContent = (img?: HTMLImageElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centers = [128, 384];
    centers.forEach((cx) => {
      // 1. Draw logo
      if (img && img.complete) {
        const imgSize = 80;
        ctx.save();
        ctx.beginPath();
        ctx.drawImage(img, cx - imgSize / 2, 70 - imgSize / 2, imgSize, imgSize);
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = brandColor;
        ctx.fillRect(cx - imgSize / 2, 70 - imgSize / 2, imgSize, imgSize);
        ctx.restore();
      } else if (name === "Judge.me") {
        ctx.save();
        ctx.translate(cx, 70);
        ctx.fillStyle = "#15c37b";
        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(-2, 10);
        ctx.lineTo(14, -8);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.save();
        ctx.fillStyle = brandColor;
        ctx.beginPath();
        ctx.arc(cx, 70, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw text
      ctx.save();
      ctx.fillStyle = brandColor;
      let fontSize = 32;
      if (name.length > 12) {
        fontSize = 24;
      }
      ctx.font = `bold ${fontSize}px 'Geist', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name, cx, 170);
      ctx.restore();
    });

    // 3. Draw white background behind everything
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    texture.needsUpdate = true;
  };

  if (svgSlug) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      drawContent(img);
    };
    img.onerror = () => {
      drawContent();
    };
    img.src = `https://cdn.jsdelivr.net/npm/simple-icons@13.0.0/icons/${svgSlug}.svg`;
  } else {
    drawContent();
  }

  return texture;
}

const tools = [
  { name: "Shopify", color: "#96bf48", slug: "shopify" },
  { name: "Meta Ads", color: "#0081fb", slug: "meta" },
  { name: "WhatsApp", color: "#25d366", slug: "whatsapp" },
  { name: "Instagram", color: "#e1306c", slug: "instagram" },
  { name: "Canva", color: "#00c4cc", slug: "canva" },
  { name: "Google Analytics", color: "#e37426", slug: "googleanalytics" },
  { name: "Razorpay", color: "#0b72e7", slug: "razorpay" },
  { name: "Judge.me", color: "#15c37b" }
];

const textures = tools.map((tool) => createBrandTexture(tool.name, tool.color, tool.slug));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(11)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    ScrollTrigger.refresh();
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  return (
    <div className="techstack">
      <h2> Our Toolstack</h2>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, window.innerWidth > 768 ? 20 : 32], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => {
            let material;
            if (i < 3) {
              material = materials[0]; // 3 Shopify balls
            } else if (i < 5) {
              material = materials[1]; // 2 Meta Ads balls
            } else {
              material = materials[i - 3]; // 1 each for WhatsApp, Instagram, Canva, GA, Razorpay, Judge.me
            }
            return (
              <SphereGeo
                key={i}
                {...props}
                material={material}
                isActive={isActive}
              />
            );
          })}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;

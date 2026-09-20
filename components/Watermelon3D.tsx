"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  PresentationControls,
  RoundedBox,
} from "@react-three/drei";

/* -------------------------------------------------------------------------- */
/*  Proportions                                                               */
/*                                                                            */
/*  The melon is a half sphere of radius 1 sitting cut-face-up. The flesh is   */
/*  a shallow cap taken off a much larger sphere (CAP_SPHERE_R), which gives   */
/*  a gentle bulge with correct normals instead of a squashed hemisphere.      */
/* -------------------------------------------------------------------------- */

const MELON_R = 1;
const FLESH_R = 0.93;
const CAP_SPHERE_R = 3.4;
const CAP_ANGLE = Math.asin(FLESH_R / CAP_SPHERE_R);
/** Offset that puts the cap's rim exactly on the y = 0 cut plane. */
const CAP_Y = -CAP_SPHERE_R * Math.cos(CAP_ANGLE);

/** Height of the flesh surface above the cut plane, at distance `r` from the axis. */
function fleshHeightAt(r: number) {
  return CAP_Y + Math.sqrt(CAP_SPHERE_R * CAP_SPHERE_R - r * r);
}

const COLORS = {
  rindDark: "#0B2B16",
  rindStripe: "#2E7A38",
  rindStripeLight: "#55A647",
  pith: "#EAF7D9",
  flesh: "#FF4D6D",
  seed: "#20100B",
  shadow: "#000000",
};

/** Deterministic hash-noise so seed scatter is identical on every render. */
function noise(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* -------------------------------------------------------------------------- */
/*  Rind texture                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Paints the classic wavy watermelon banding into a canvas pair: one albedo
 * map and one roughness map. Drawing both from the same paths keeps the
 * stripes slightly more matte than the dark rind, which is what sells the
 * waxy look under the environment light.
 */
function createRindTextures() {
  const W = 1024;
  const H = 512;
  const STRIPES = 8;
  const step = W / STRIPES;

  const albedoCanvas = document.createElement("canvas");
  albedoCanvas.width = W;
  albedoCanvas.height = H;
  const albedo = albedoCanvas.getContext("2d")!;

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = W;
  roughCanvas.height = H;
  const rough = roughCanvas.getContext("2d")!;

  albedo.fillStyle = COLORS.rindDark;
  albedo.fillRect(0, 0, W, H);
  rough.fillStyle = "#4A4A4A";
  rough.fillRect(0, 0, W, H);

  // A single wavy band, described once and reused by both maps.
  const bandPath = (ctx: CanvasRenderingContext2D, cx: number, phase: number, widthScale: number) => {
    const SAMPLES = 72;
    const halfBase = step * 0.23 * widthScale;

    const edge = (s: number, sign: 1 | -1) => {
      const t = s / SAMPLES;
      const y = t * H;
      const drift = step * 0.1 * Math.sin(t * Math.PI * 3 + phase);
      const halfWidth =
        halfBase *
        (0.82 +
          0.34 * Math.sin(t * Math.PI * 2.3 + phase * 1.3) +
          0.16 * Math.sin(t * Math.PI * 7.1 + phase * 2.1));
      return [cx + drift + sign * halfWidth, y] as const;
    };

    ctx.beginPath();
    for (let s = 0; s <= SAMPLES; s++) {
      const [x, y] = edge(s, -1);
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    for (let s = SAMPLES; s >= 0; s--) {
      const [x, y] = edge(s, 1);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  for (let i = 0; i < STRIPES; i++) {
    const cx = (i + 0.5) * step;
    const phase = i * 1.7;

    // Soft outer halo, then a crisper core on top.
    albedo.filter = "blur(4px)";
    albedo.fillStyle = COLORS.rindStripe;
    bandPath(albedo, cx, phase, 1.1);
    albedo.filter = "blur(1.5px)";
    albedo.fillStyle = COLORS.rindStripeLight;
    bandPath(albedo, cx, phase, 0.62);
    albedo.filter = "none";

    rough.filter = "blur(4px)";
    rough.fillStyle = "#9A9A9A";
    bandPath(rough, cx, phase, 1.1);
    rough.filter = "none";
  }

  // Fine mottling so the rind never reads as flat vector art.
  albedo.globalAlpha = 0.06;
  for (let i = 0; i < 900; i++) {
    const x = noise(i * 1.3) * W;
    const y = noise(i * 2.9 + 5) * H;
    const r = 1 + noise(i * 4.1 + 11) * 3.5;
    albedo.fillStyle = noise(i * 5.7 + 3) > 0.5 ? "#8FCB7A" : "#03150A";
    albedo.beginPath();
    albedo.arc(x, y, r, 0, Math.PI * 2);
    albedo.fill();
  }
  albedo.globalAlpha = 1;

  const map = new THREE.CanvasTexture(albedoCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;
  map.anisotropy = 8;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.ClampToEdgeWrapping;
  roughnessMap.anisotropy = 8;

  return { map, roughnessMap };
}

/* -------------------------------------------------------------------------- */
/*  Seeds                                                                     */
/* -------------------------------------------------------------------------- */

type Seed = {
  position: [number, number, number];
  yaw: number;
  tilt: number;
  scale: [number, number, number];
};

function buildSeeds(): Seed[] {
  const rings = [
    { count: 7, radius: 0.4, offset: 0 },
    { count: 12, radius: 0.71, offset: 0.26 },
  ];

  const seeds: Seed[] = [];
  let n = 0;

  for (const ring of rings) {
    for (let k = 0; k < ring.count; k++) {
      n++;
      const r = ring.radius + (noise(n * 2.1) - 0.5) * 0.08;
      const theta =
        (k / ring.count) * Math.PI * 2 + ring.offset + (noise(n * 3.7) - 0.5) * 0.3;
      const size = 0.88 + noise(n * 6.3) * 0.3;

      seeds.push({
        // Centres sit on the flesh surface, so each seed is half-embedded.
        position: [r * Math.cos(theta), fleshHeightAt(r), r * Math.sin(theta)],
        // -theta puts the seed's local +X axis along the radius.
        yaw: -theta + (noise(n * 8.9) - 0.5) * 0.5,
        // Match the slope of the cap so seeds lie flat against it.
        tilt: Math.asin(r / CAP_SPHERE_R),
        scale: [0.075 * size, 0.021 * size, 0.048 * size],
      });
    }
  }

  return seeds;
}

/* -------------------------------------------------------------------------- */
/*  Melon                                                                     */
/* -------------------------------------------------------------------------- */

function WatermelonHalf() {
  const textures = useMemo(() => createRindTextures(), []);
  const seeds = useMemo(() => buildSeeds(), []);

  const seedGeometry = useMemo(() => new THREE.SphereGeometry(1, 14, 10), []);
  const seedMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: COLORS.seed,
        roughness: 0.3,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      textures.map.dispose();
      textures.roughnessMap.dispose();
      seedGeometry.dispose();
      seedMaterial.dispose();
    };
  }, [textures, seedGeometry, seedMaterial]);

  return (
    <group>
      {/* Rind: lower half sphere, open at the cut plane. */}
      <mesh>
        <sphereGeometry
          args={[MELON_R, 80, 36, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
        />
        <meshPhysicalMaterial
          map={textures.map}
          roughnessMap={textures.roughnessMap}
          roughness={0.95}
          metalness={0}
          clearcoat={0.7}
          clearcoatRoughness={0.24}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Pale pith ring on the cut face. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[FLESH_R, MELON_R * 1.002, 96]} />
        <meshPhysicalMaterial
          color={COLORS.pith}
          roughness={0.62}
          metalness={0}
          clearcoat={0.35}
          clearcoatRoughness={0.5}
        />
      </mesh>

      {/* Thin dark skin line at the very outer edge. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0012, 0]}>
        <ringGeometry args={[MELON_R * 0.982, MELON_R * 1.002, 96]} />
        <meshPhysicalMaterial
          color={COLORS.rindDark}
          roughness={0.35}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </mesh>

      {/* Flesh: shallow spherical cap, gently domed. */}
      <mesh position={[0, CAP_Y, 0]}>
        <sphereGeometry args={[CAP_SPHERE_R, 96, 12, 0, Math.PI * 2, 0, CAP_ANGLE]} />
        <meshPhysicalMaterial
          color={COLORS.flesh}
          roughness={0.38}
          metalness={0}
          clearcoat={0.9}
          clearcoatRoughness={0.22}
          envMapIntensity={0.45}
        />
      </mesh>

      {seeds.map((seed, i) => (
        <group key={i} position={seed.position} rotation={[0, seed.yaw, 0]}>
          <mesh
            geometry={seedGeometry}
            material={seedMaterial}
            rotation={[0, 0, -seed.tilt]}
            scale={seed.scale}
          />
        </group>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Plinth                                                                    */
/* -------------------------------------------------------------------------- */

const SLAB_H = 0.22;
const SLAB_TOP = -MELON_R;
const FLOOR_Y = SLAB_TOP - SLAB_H;

/**
 * Stone slab the melon rests on, over a wet floor that reflects the scene.
 * The floor is a large plane; the canvas wrapper's CSS mask and the scene
 * fog fade it out long before its edges.
 */
function Plinth() {
  return (
    <group>
      <RoundedBox
        args={[2.4, SLAB_H, 1.8]}
        radius={0.04}
        smoothness={4}
        position={[0, SLAB_TOP - SLAB_H / 2, 0]}
      >
        <meshPhysicalMaterial
          color="#111F18"
          roughness={0.5}
          metalness={0.05}
          clearcoat={0.4}
          clearcoatRoughness={0.35}
        />
      </RoundedBox>

      <ContactShadows
        position={[0, SLAB_TOP + 0.01, 0]}
        scale={2.6}
        resolution={512}
        blur={2.4}
        far={1.6}
        opacity={0.7}
        color={COLORS.shadow}
        frames={1}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
        <planeGeometry args={[14, 14]} />
        <MeshReflectorMaterial
          resolution={512}
          blur={[400, 120]}
          mixBlur={1}
          mixStrength={22}
          mixContrast={1}
          roughness={1}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color="#08170F"
          metalness={0.5}
          mirror={0}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Motion                                                                    */
/* -------------------------------------------------------------------------- */

const SPIN_SPEED = 0.28; // radians / second

/**
 * Spins its children on Y. Eases the speed to zero while the user is dragging
 * and back up on release, so auto-rotation never fights the pointer.
 */
function AutoSpin({
  paused,
  children,
}: {
  paused: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const speed = useRef(SPIN_SPEED);

  useFrame((_, delta) => {
    // Guard against huge deltas after a background-tab pause.
    const dt = Math.min(delta, 0.1);
    const target = paused ? 0 : SPIN_SPEED;
    speed.current += (target - speed.current) * Math.min(1, dt * 4);
    if (group.current) group.current.rotation.y += speed.current * dt;
  });

  return <group ref={group}>{children}</group>;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    // Never rendered on the server (ssr: false), but the hook requires it.
    () => false,
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

export default function Watermelon3D({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [dragging, setDragging] = useState(false);

  // Pointer can be released outside the canvas, so listen on the window.
  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [dragging]);

  return (
    <Canvas
      className={className}
      dpr={[1, 1.8]}
      camera={{ position: [0, 1.7, 4.6], fov: 30, near: 0.1, far: 50 }}
      onCreated={({ camera }) => camera.lookAt(0, -0.35, 0)}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.NeutralToneMapping,
        toneMappingExposure: 0.95,
      }}
      onPointerDown={() => setDragging(true)}
      aria-hidden
    >
      {/* Starts beyond the melon, so only the far floor dissolves into the page. */}
      <fog attach="fog" args={["#0A2015", 6, 11]} />

      <ambientLight intensity={0.22} />
      <directionalLight position={[3.5, 6, 4]} intensity={1.7} color="#FFF6E8" />
      <directionalLight position={[-4, 2, -3]} intensity={0.45} color="#9FE8B5" />
      {/* Low pink rim from behind: the neon spill on the wet floor. */}
      <pointLight position={[2.2, -0.6, -2.4]} color="#FF4D6D" intensity={18} distance={8} decay={2} />
      <pointLight position={[-2.6, -0.2, -1.6]} color="#8BE0A0" intensity={6} distance={7} decay={2} />

      <PresentationControls
        enabled
        global={false}
        cursor
        snap
        speed={1.4}
        zoom={1}
        rotation={[0, 0, 0]}
        polar={[-0.15, 0.35]}
        azimuth={[-0.5, 0.5]}
        damping={0.22}
      >
        {/* Slight lean so the spin axis isn't dead vertical. */}
        <group rotation={[0.05, 0, -0.09]}>
          <AutoSpin paused={reducedMotion || dragging}>
            <WatermelonHalf />
          </AutoSpin>
        </group>
      </PresentationControls>

      <Plinth />

      {/* Studio softboxes built in-scene: PBR reflections with no HDRI fetch. */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#0A2015"]} />
        <Lightformer
          form="rect"
          intensity={6}
          position={[0, 4, 2]}
          rotation-x={-Math.PI / 2}
          scale={[8, 4, 1]}
          color="#FFFFFF"
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[-4, 1, 2]}
          rotation-y={Math.PI / 2}
          scale={[4, 4, 1]}
          color="#BFE6C8"
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          position={[4, 0.5, 1]}
          rotation-y={-Math.PI / 2}
          scale={[4, 4, 1]}
          color="#FFD9DF"
        />
        <Lightformer
          form="circle"
          intensity={3}
          position={[0, -2, -4]}
          scale={3}
          color="#7DE08A"
        />
      </Environment>
    </Canvas>
  );
}

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points as ThreePoints } from "three";
import { AdditiveBlending, MathUtils } from "three";

type StarsLayerProps = {
  count: number;
  depth: number;
  spreadX: number;
  spreadY: number;
  color: string;
  size: number;
  speed: number;
  opacity: number;
};

function StarsLayer({
  count,
  depth,
  spreadX,
  spreadY,
  color,
  size,
  speed,
  opacity,
}: StarsLayerProps) {
  const pointsRef = useRef<ThreePoints>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const stride = index * 3;
      values[stride] = MathUtils.randFloatSpread(spreadX);
      values[stride + 1] = MathUtils.randFloatSpread(spreadY);
      values[stride + 2] = MathUtils.randFloatSpread(depth);
    }

    return values;
  }, [count, depth, spreadX, spreadY]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z += delta * speed;
    pointsRef.current.rotation.x += delta * speed * 0.18;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

function CameraDrift() {
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(elapsed * 0.12) * 0.55;
    state.camera.position.y = Math.cos(elapsed * 0.08) * 0.35;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function SpaceScene() {
  return (
    <>
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 8, 26]} />
      <CameraDrift />
      <StarsLayer
        count={1800}
        depth={18}
        spreadX={26}
        spreadY={16}
        color="#ffffff"
        size={0.03}
        speed={0.012}
        opacity={0.9}
      />
      <StarsLayer
        count={900}
        depth={12}
        spreadX={22}
        spreadY={14}
        color="#7dd3fc"
        size={0.05}
        speed={-0.02}
        opacity={0.45}
      />
      <StarsLayer
        count={360}
        depth={10}
        spreadX={16}
        spreadY={10}
        color="#f9a8d4"
        size={0.08}
        speed={0.03}
        opacity={0.22}
      />
    </>
  );
}

export default function SpaceBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 52 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <SpaceScene />
      </Canvas>
    </div>
  );
}

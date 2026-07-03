import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import styles from "./GridHero.module.css";

const vertexShader = `
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uMax;
  attribute vec2 center;       // il centro della cella a cui appartiene il vertice
  varying float vBump;
  void main() {
    float d = distance(center, uMouse);
    float bump = exp(-(d * d) / (uRadius * uRadius));   // 0..1, massimo sotto il mouse
    vBump = bump;
    // ingrandisce il quadrato attorno al suo centro
    vec3 pos = position;
    float crescita = min(uStrength * bump, uMax);   // la crescita ha un tetto
    vec2 offset = (position.xy - center) * crescita;
    pos.xy += offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying float vBump;
  void main() {
    float a = 0.25 + vBump * 0.75;   // i quadrati sotto il mouse sono più pieni
    gl_FragColor = vec4(uColor, a);
  }
`;

function Griglia() {
  const { viewport } = useThree();
  const target = useRef(new THREE.Vector2(999, 999));

  const W = viewport.width * 1.25;
  const H = viewport.height * 1.25;
  const cellsX = Math.max(8, Math.round(W * 10));   // densità
  const cellsY = Math.max(6, Math.round(H * 10));

  // costruiamo tanti quadratini, ognuno con il proprio "center"
  const geom = useMemo(() => {
    const positions = [];
    const centers = [];
    const x0 = -W / 2;
    const y0 = -H / 2;
    const cw = W / cellsX;
    const ch = H / cellsY;
    const q = 0.22; // metà lato del quadrato (rispetto alla cella): più basso = quadrati più piccoli/staccati

    for (let r = 0; r < cellsY; r++) {
      for (let c = 0; c < cellsX; c++) {
        const cx = x0 + cw * (c + 0.5);
        const cy = y0 + ch * (r + 0.5);
        const s = Math.min(cw, ch) * q;
        // due triangoli = un quadrato
        const quad = [
          [cx - s, cy - s], [cx + s, cy - s], [cx + s, cy + s],
          [cx - s, cy - s], [cx + s, cy + s], [cx - s, cy + s],
        ];
        for (const [vx, vy] of quad) {
          positions.push(vx, vy, 0);
          centers.push(cx, cy);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("center", new THREE.Float32BufferAttribute(centers, 2));
    return g;
  }, [W, H, cellsX, cellsY]);

  const uniforms = useMemo(() => ({
    uMouse: { value: new THREE.Vector2(999, 999) },
    uRadius: { value: 0.9 },
    uStrength: { value: 1.6 },   // quanto si ingrandiscono i quadrati sotto il mouse
    uMax: { value: 0.5 },
    uColor: { value: new THREE.Color("#ff5c38") },
  }), []);

  useEffect(() => {
    const onMove = (e) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    const px = (target.current.x * viewport.width) / 2;
    const py = (target.current.y * viewport.height) / 2;
    uniforms.uMouse.value.lerp(new THREE.Vector2(px, py), 0.1);
  });

  return (
    <mesh geometry={geom}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function GridHero() {
  return (
    <div className={styles.griglia}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <Griglia />
      </Canvas>
    </div>
  );
}
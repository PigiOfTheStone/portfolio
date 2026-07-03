import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import styles from "./GridHero.module.css";

const vertexShader = `
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uMax;
  uniform vec2 uOnda;
  uniform float uOndaT;
  uniform float uTime;
  attribute vec2 center;
  varying float vBump;
  varying float vNoise;

  // noise semplice e veloce (pseudo-random fluido)
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    // effetto mouse (sfera)
    float d = distance(center, uMouse);
    float bump = pow(exp(-(d * d) / (uRadius * uRadius)), 1.8);

    // effetto onda (sasso nell'acqua)
    float bumpOnda = 0.0;
    if (uOndaT >= 0.0) {
      float raggioOnda = uOndaT * 2.6;
      float dOnda = distance(center, uOnda);
      float anello = exp(-pow((dOnda - raggioOnda) * 3.0, 2.0));
      float smorzamento = exp(-uOndaT * 1.2);
      bumpOnda = anello * smorzamento;
    }

    float b = max(bump, bumpOnda);
    vBump = b;

    // NOISE ORGANICO: ogni quadrato ha il suo "carattere" che evolve lentamente
    float n = noise(center * 1.5 + uTime * 0.15);
    vNoise = n;

    // 1) respiro di dimensione: i quadrati variano leggermente di grandezza tra loro
    float respiro = (n - 0.5) * 0.25;              // ← MANOPOLA respiro dimensione
    // 2) tremolio di posizione: uno spostamento dolce e lento
    vec2 tremolio = vec2(
      noise(center * 2.0 + uTime * 0.1) - 0.5,
      noise(center * 2.0 + 50.0 + uTime * 0.1) - 0.5
    ) * 0.035;                                      // ← MANOPOLA tremolio

    float crescita = min(uStrength * b, uMax) + respiro;
    vec3 pos = position;
    vec2 offset = (position.xy - center) * crescita;
    pos.xy += offset + tremolio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying float vBump;
  varying float vNoise;
  void main() {
    float base = 0.07 + vNoise * 0.06;   // opacità a riposo, variata dal noise
    float a = base + vBump * 0.55;
    gl_FragColor = vec4(uColor, a);
  }
`;

function Griglia() {
  const { viewport, gl } = useThree();
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
    uRadius: { value: 0.25 },
    uStrength: { value: 2.2 },   // quanto si ingrandiscono i quadrati sotto il mouse
    uMax: { value: 0.5 },
    uOnda: { value: new THREE.Vector2(0, 0) },
    uOndaT: { value: -1 },   // -1 = nessuna onda in corso
    uColor: { value: new THREE.Color("#ff5c38") },
    uTime: {value: 0},
  }), []);

  useEffect(() => {
    const onMove = (e) => {
      const rect = gl.domElement.getBoundingClientRect();  // posizione reale del canvas
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      target.current.set(nx, ny);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);

  useEffect(() => {
    const onTap = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      const nx = ((t.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((t.clientY - rect.top) / rect.height) * 2 - 1);
      uniforms.uOnda.value.set((nx * viewport.width) / 2, (ny * viewport.height) / 2);
      uniforms.uOndaT.value = 0;   // fa partire l'onda
    };
    window.addEventListener("pointerdown", onTap);
    return () => window.removeEventListener("pointerdown", onTap);
  }, [gl, viewport, uniforms]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    const px = (target.current.x * viewport.width) / 2;
    const py = (target.current.y * viewport.height) / 2;
    uniforms.uMouse.value.lerp(new THREE.Vector2(px, py), 0.1);
    if (uniforms.uOndaT.value >= 0) {
      uniforms.uOndaT.value += 1 / 60;              // avanza il tempo
      if (uniforms.uOndaT.value > 3) uniforms.uOndaT.value = -1;  // dopo 3s, onda finita
    }
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
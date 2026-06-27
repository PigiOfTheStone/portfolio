import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useTexture, Html } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import { useMascotte } from "../mascotte/MascotteContext";
import styles from "./Scene3D.module.css";

const Z_SCHERMO = 0.31;

const ESPRESSIONI = {
  neutro: "/mascotte/neutro.png",
  felice: "/mascotte/felice.png",
  sorpreso: "/mascotte/sorpreso.png",
  chiusi: "/mascotte/chiusi.png",
};

// La faccia pixel art (modalità "riposo")
function Faccia({ espressione }) {
  const texs = useTexture(ESPRESSIONI);
  Object.values(texs).forEach((t) => {
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
  });
  return (
    <mesh position={[0, 0.12, Z_SCHERMO + 0.05]}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshBasicMaterial map={texs[espressione]} transparent />
    </mesh>
  );
}

function SchermoTerminale({ testo }) {
  const [mostrato, setMostrato] = useState("");
  useEffect(() => {
    setMostrato("");
    if (!testo) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setMostrato(testo.slice(0, i));
      if (i >= testo.length) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [testo]);

  return (
    <Html
      transform
      position={[0, 0.1, Z_SCHERMO + 0.03]}   // centrato sullo schermo (in transform è obbligato)
      distanceFactor={3}
      style={{ pointerEvents: "none" }}
    >
      <div style={{
        width: "250px",                 // ← MANOPOLA: larghezza riquadro
        height: "175px",                // ← MANOPOLA: altezza riquadro
        outline: "1px solid red",       // ← TEMPORANEO: per vedere il riquadro
        display: "flex",
        justifyContent: "flex-start",   // testo in ALTO
        alignItems: "flex-start",       // testo a SINISTRA
        boxSizing: "border-box",
        padding: "4px",
        fontFamily: "ui-monospace, Menlo, Consolas, monospace",
        fontSize: "25px",               // ← MANOPOLA: dimensione testo
        lineHeight: 1.35,
        color: "#bfe9c8",
        textShadow: "0 0 4px rgba(120,255,170,0.5)",
        textAlign: "left",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        <span>
          <span style={{ color: "#5fae7e" }}>&gt; </span>{mostrato}<span className="crt-cur">▋</span>
        </span>
      </div>
    </Html>
  );
}

function Monitor({ puntatore, mood, message }) {
  const gruppo = useRef();
  const [blink, setBlink] = useState(false);
  const [terminale, setTerminale] = useState(false);

  // battito di ciglia, solo in modalità faccia
  useEffect(() => {
    if (terminale) return;
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 130);
    }, 3500);
    return () => clearInterval(id);
  }, [terminale]);

  // transizione: arriva un messaggio → chiudi gli occhi, poi passa al terminale
  useEffect(() => {
    if (message) {
      setBlink(true);
      const t = setTimeout(() => { setBlink(false); setTerminale(true); }, 200);
      return () => clearTimeout(t);
    } else {
      setTerminale(false);
    }
  }, [message]);

  useFrame(() => {
    const g = gruppo.current;
    if (!g) return;
    const ry = puntatore.current.x * 0.4;
    const rx = -puntatore.current.y * 0.25;
    g.rotation.y += (ry - g.rotation.y) * 0.05;
    g.rotation.x += (rx - g.rotation.x) * 0.05;
  });

  const espressione = blink ? "chiusi" : mood;

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={gruppo}>
        <mesh>
          <boxGeometry args={[2.4, 1.9, 0.6]} />
          <meshStandardMaterial color="#d6cba0" roughness={0.7} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.1, Z_SCHERMO - 0.02]}>
          <boxGeometry args={[1.9, 1.3, 0.05]} />
          <meshStandardMaterial color="#0a1410" emissive="#0e3a24" emissiveIntensity={0.4} roughness={0.4} />
        </mesh>

        {/* faccia OPPURE terminale, a seconda della modalità */}
        {terminale ? <SchermoTerminale testo={message} /> : <Faccia espressione={espressione} />}

        <mesh position={[0.85, -0.72, Z_SCHERMO]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#ff5c38" />
        </mesh>
        <mesh position={[0, -1.15, 0]}>
          <boxGeometry args={[1.1, 0.35, 0.5]} />
          <meshStandardMaterial color="#c2b793" />
        </mesh>
      </group>
    </Float>
  );
}

export default function Scene3D() {
  const { mood, message } = useMascotte();   // legge umore E messaggio, fuori dal Canvas
  const puntatore = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      puntatore.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      puntatore.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className={styles.sfondo}>
      <Canvas camera={{ position: [0, 0, 6.8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 5]} intensity={1.3} />
        <directionalLight position={[-4, -2, 2]} intensity={0.3} color="#8a8794" />
        <Suspense fallback={null}>
          <Monitor puntatore={puntatore} mood={mood} message={message} />
        </Suspense>
      </Canvas>
    </div>
  );
}
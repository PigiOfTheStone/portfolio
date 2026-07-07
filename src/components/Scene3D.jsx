import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useTexture, Html } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import { useMascotte } from "../mascotte/MascotteContext";
import styles from "./Scene3D.module.css";
import * as Suoni from "../mascotte/suoni";

const Z_SCHERMO = 0.31;

const ESPRESSIONI = {
  neutro: "/mascotte/neutro.png",
  felice: "/mascotte/felice.png",
  sorpreso: "/mascotte/sorpreso.png",
  chiusi: "/mascotte/chiusi.png",
  ridere: "/mascotte/ridere.png",   // ← nuova
};

function Faccia({ espressione, puntatore, blink }) {
  const texs = useTexture(ESPRESSIONI);
  Object.values(texs).forEach((t) => {
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
  });

  const mesh = useRef();
  const pop = useRef(1);
  const precedente = useRef(espressione);

  // "pop" di scala quando cambia espressione (ma non sul battito)
  useEffect(() => {
    if (espressione !== precedente.current && espressione !== "chiusi") pop.current = 1.25;
    precedente.current = espressione;
  }, [espressione]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;

    // SGUARDO: la faccia scivola di pochi pixel verso il cursore
    const tx = (puntatore?.current?.x || 0) * 0.06;
    const ty = -(puntatore?.current?.y || 0) * 0.05;
    m.position.x += (tx - m.position.x) * 0.08;
    m.position.y += ((0.12 + ty) - m.position.y) * 0.08;

    // il pop torna dolcemente a 1
    pop.current += (1 - pop.current) * 0.18;

    // SCHIACCIAMENTO elastico durante il battito (si stringe in verticale)
    const sx = (blink ? 1.08 : 1) * pop.current;
    const sy = (blink ? 0.78 : 1) * pop.current;
    m.scale.x += (sx - m.scale.x) * 0.35;
    m.scale.y += (sy - m.scale.y) * 0.35;
  });

  return (
    <mesh ref={mesh} position={[0, 0.12, Z_SCHERMO + 0.05]}>
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
      const ch = testo[i - 1];
      if (ch && ch !== " " && i % 2 === 0) Suoni.blipParlato();
      if (i >= testo.length) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [testo]);

  return (
    <Html transform position={[0, 0.1, Z_SCHERMO + 0.03]} distanceFactor={3} style={{ pointerEvents: "none" }}>
      <div style={{
        width: "250px", height: "175px",
        display: "flex", justifyContent: "flex-start", alignItems: "flex-start",
        boxSizing: "border-box", padding: "4px",
        fontFamily: "ui-monospace, Menlo, Consolas, monospace",
        fontSize: "25px", lineHeight: 1.35,
        color: "#bfe9c8", textShadow: "0 0 4px rgba(120,255,170,0.5)",
        textAlign: "left", whiteSpace: "pre-wrap", wordBreak: "break-word",
      }}>
        <span><span style={{ color: "#5fae7e" }}>&gt; </span>{mostrato}<span className="crt-cur">▋</span></span>
      </div>
    </Html>
  );
}

// Decide forma e dimensione degli occhi in base all'espressione (e al battito).
function stileOcchio(espressione, blink) {
  const base = {
    width: "34px",
    background: "#5ef2c0",
    boxShadow: "0 0 16px rgba(94,242,192,0.75)",
    transition: "all 0.16s ease",   // ← la morbidezza alla EMO: ogni cambio è fluido
  };
  if (blink) return { ...base, height: "6px", borderRadius: "6px" };  // occhi quasi chiusi
  switch (espressione) {
    case "felice":
    case "ridere":
      return { ...base, height: "20px", borderRadius: "100% 100% 0 0" }; // ∩ occhi sorridenti
    case "sorpreso":
      return { ...base, width: "42px", height: "54px", borderRadius: "22px" }; // occhioni
    case "arrabbiato":
      return { ...base, height: "16px", borderRadius: "0 0 40% 40%", transform: "scaleY(1)"};  
    default: // neutro
      return { ...base, height: "48px", borderRadius: "17px" };
  }
}

// La faccia "liscia": due occhi CSS dentro lo schermo 3D, che seguono il mouse.
function FacciaLiscia({ puntatore, blink, espressione }) {
  const wrapSx = useRef();
  const wrapDx = useRef();
  const occhioSx = useRef();
  const occhioDx = useRef();
  const intensita = useRef(0); // 0-1: quanto è carica l'emozione attuale?
  const inizio = useRef(performance.now());

  // ogni volta che cambia espressione, riparte la carica da zero
  useEffect(() => { intensita.current = 0; inizio.current = performance.now(); }, [espressione]);

  useFrame((state) => {
    // sguardo: gli occhi scivolano di pochi px verso il cursore
    const x = (puntatore?.current?.x || 0) * 9;
    const y = (puntatore?.current?.y || 0) * 7;
    const t = `translate(${x}px, ${y}px)`;
    if (wrapSx.current) wrapSx.current.style.transform = t;
    if (wrapDx.current) wrapDx.current.style.transform = t;

    // l'intensità sale dolcemente verso 1 (l'emozione cresce)
    intensita.current += (1 - intensita.current) * 0.03;
    const k = intensita.current;
    const tempo = state.clock.elapsedTime;

    // applichiamo traformazioni vive in base all'espressione
    let trasf = "";
    if (espressione === "arrabbiato"){
      // aggrotta sempre di più: gli occhi si inclinano a V e tremano
      const angolo = 8 + k * 22; // da 8° a 30°
      const tremore = Math.sin(tempo * 40) * k * 1.5; // Vibrazione nervosa
      if (occhioSx.current) occhioSx.current.style.transform = `rotate(${angolo}deg) translateY(${tremore}px)`;
      if (occhioDx.current) occhioDx.current.style.transform = `rotate(${-angolo}deg) translateY(${tremore}px)`;
    } else if (espressione === "ridere" || espressione === "felice") {
      // rimbalzo allegro: gli occhi pulsano su e giù
      const su = Math.sin(tempo * 12) * 2 * k;
      if (occhioSx.current) occhioSx.current.style.transform = `translateY(${su}px)`;
      if (occhioDx.current) occhioDx.current.style.transform = `translateY(${su}px)`;
    } else {
      if (occhioSx.current) occhioSx.current.style.transform = "";
      if (occhioDx.current) occhioDx.current.style.transform = "";
    }
  });

  const stile = stileOcchio(espressione, blink);

  return (
    <Html transform position={[0, 0.5, Z_SCHERMO + 0.04]} distanceFactor={3} style={{ pointerEvents: "none" }}>
      <div style={{ width: "250px", height: "175px", display: "flex", justifyContent: "center", alignItems: "center", gap: "34px" }}>
        <div ref={wrapSx}><div ref={occhioSx} style={stile} /></div>
        <div ref={wrapDx}><div ref={occhioDx} style={stile} /></div>
      </div>
    </Html>
  );
}

// Screensaver Pong: pallina + racchette che giocano da sole. Al risveglio,
// la pallina vola a fare l'occhio destro e le racchette l'occhio sinistro.
function Pong({ sveglia, onSvegliato, onGol }) {
  const palla = useRef();
  const padSx = useRef();
  const padDx = useRef();
  const stato = useRef({ x: 0, y: 0, vx: 1.7, vy: 1.2, ySx: 0, yDx: 0 });
  const [punti, setPunti] = useState({ sx: 0, dx: 0 });   // punteggio a schermo
  const svegliaRef = useRef(false);
  useEffect(() => { svegliaRef.current = sveglia; }, [sveglia]);

  const W = 250, H = 175;

  // rimette la pallina al centro dopo un punto, con direzione casuale
  const reset = (versoDx) => {
    const s = stato.current;
    s.x = 0; s.y = 0;
    s.vx = versoDx ? 1.7 : -1.7;
    s.vy = (Math.random() - 0.5) * 2.4;
  };

  useFrame(() => {
    if (svegliaRef.current) return;
    const s = stato.current;
    s.x += s.vx; s.y += s.vy;

    // pareti alto/basso
    if (s.y < -H / 2 + 14 || s.y > H / 2 - 14) {
      s.vy *= -1; s.vx += (Math.random() - 0.5) * 0.8; Suoni.pongHit(660);
    }

    const margine = 34;
    // lato sinistro: se la racchetta è vicina rimbalza, altrimenti è GOL per destra
    if (s.x < -W / 2 + margine) {
      if (Math.abs(s.ySx - s.y) < 30) {
        s.vx = Math.abs(s.vx); s.vy += (Math.random() - 0.5) * 1.4; Suoni.pongHit(330);
      } else {
        setPunti((p) => ({ ...p, dx: p.dx + 1 })); Suoni.pongPunto(); reset(true); onGol && onGol("dx");
      }
    }
    // lato destro: speculare
    if (s.x > W / 2 - margine) {
      if (Math.abs(s.yDx - s.y) < 30) {
        s.vx = -Math.abs(s.vx); s.vy += (Math.random() - 0.5) * 1.4; Suoni.pongHit(330);
      } else {
        setPunti((p) => ({ ...p, sx: p.sx + 1 })); Suoni.pongPunto(); reset(false); onGol && onGol("sx");
      }
    }

    s.vx = Math.max(-3, Math.min(3, s.vx));
    s.vy = Math.max(-3, Math.min(3, s.vy));
    if (Math.abs(s.vx) < 1) s.vx = s.vx < 0 ? -1 : 1;

    // racchette imperfette (a volte mancano davvero → gol)
    s.ySx += (s.y - s.ySx) * 0.06;
    s.yDx += (s.y - s.yDx) * 0.06;

    if (palla.current) palla.current.style.transform = `translate(${s.x}px, ${s.y}px)`;
    if (padSx.current) padSx.current.style.transform = `translateY(${s.ySx}px)`;
    if (padDx.current) padDx.current.style.transform = `translateY(${s.yDx}px)`;
  });

  // risveglio: azzera il punteggio e manda gli elementi a fare gli occhi
  useEffect(() => {
    if (!sveglia) return;
    setPunti({ sx: 0, dx: 0 });                 // ← azzeramento richiesto
    const muovi = (el, x, y, scala) => {
      if (!el) return;
      el.style.transition = "transform 0.4s cubic-bezier(0.3,0.9,0.3,1.2)";
      el.style.transform = `translate(${x}px, ${y}px) scale(${scala})`;
    };
    muovi(palla.current, 34, 0, 2.4);
    muovi(padSx.current, 63, 0, 1.1);
    muovi(padDx.current, -131, 0, 1.1);
    const t = setTimeout(() => onSvegliato && onSvegliato(), 430);
    return () => clearTimeout(t);
  }, [sveglia, onSvegliato]);

  const col = "#5ef2c0";
  const glow = "0 0 16px rgba(94,242,192,0.75)";

  return (
    <Html transform position={[0, 0.1, Z_SCHERMO + 0.04]} distanceFactor={3} style={{ pointerEvents: "none" }}>
      <div style={{ width: "250px", height: "175px", position: "relative", overflow: "hidden" }}>
        {/* punteggio in alto al centro */}
        <div style={{
          position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)",
          fontFamily: "ui-monospace, monospace", fontWeight: 700, fontSize: "22px",
          color: col, textShadow: glow, letterSpacing: "4px",
        }}>
          {punti.sx} - {punti.dx}
        </div>
        <div ref={padSx} style={{ position: "absolute", left: "24px", top: "50%", marginTop: "-22px", width: "8px", height: "44px", borderRadius: "4px", background: col, boxShadow: glow }} />
        <div ref={padDx} style={{ position: "absolute", right: "24px", top: "50%", marginTop: "-22px", width: "8px", height: "44px", borderRadius: "4px", background: col, boxShadow: glow }} />
        <div ref={palla} style={{ position: "absolute", left: "50%", top: "50%", marginLeft: "-7px", marginTop: "-7px", width: "14px", height: "14px", borderRadius: "50%", background: col, boxShadow: glow }} />
      </div>
    </Html>
  );
}

// Screensaver "dorme": occhi assonnati + ZZZ che salgono e svaniscono.
function Dorme({ sveglia, onSvegliato }) {
  const occhioSx = useRef();
  const occhioDx = useRef();
  const stato = useRef("resiste");  // "resiste" → "dorme"
  const inizio = useRef(performance.now());

  useFrame(() => {
    const ora = performance.now();
    const trascorso = (ora - inizio.current) / 1000;

    if (!sveglia) {
      if (stato.current === "resiste") {
        // RESISTENZA: gli occhi calano lentamente, poi risalgono di scatto (3 volte)
        const fase = trascorso % 1.1;
        let h;
        if (fase < 0.85) h = 1 - (fase / 0.85) * 0.92;   // calano piano (testa che ciondola)
        else h = 1;                                       // scatto: "su, sveglia!"
        const altezza = 8 + h * 38;
        if (occhioSx.current) occhioSx.current.style.height = altezza + "px";
        if (occhioDx.current) occhioDx.current.style.height = altezza + "px";
        if (trascorso > 3.3) {
            stato.current = "dorme";
            Suoni.dorme();
            // chiusura morbida, sincronizzata col suono dello sbadiglio
            [occhioSx.current, occhioDx.current].forEach((el) => {
              if (!el) return;
              el.style.transition = "height 0.9s ease-in-out";
              el.style.height = "8px";
            });
        }
      }
    }
  });

  // RISVEGLIO: stiracchiamento (occhi che si spalancano) + suono
  useEffect(() => {
    if (!sveglia) return;
    Suoni.stiracchia();
    const allunga = (el) => {
      if (!el) return;
      el.style.transition = "all 0.5s cubic-bezier(0.3,1.6,0.4,1)";  // molla elastica
      el.style.height = "64px";   // si spalancano di scatto
      el.style.transform = "scaleX(1.15)";
    };
    allunga(occhioSx.current); allunga(occhioDx.current);
    const t = setTimeout(() => onSvegliato && onSvegliato(), 650);
    return () => clearTimeout(t);
  }, [sveglia, onSvegliato]);

  const col = "#5ef2c0";
  const glow = "0 0 16px rgba(94,242,192,0.75)";
  const occhio = { width: "34px", height: "44px", borderRadius: "16px", background: col, boxShadow: glow };
  const z = (left, top, size, delay) => ({
    position: "absolute", left, top, color: col, textShadow: glow,
    fontFamily: "ui-monospace, monospace", fontSize: size, fontWeight: 700,
    animation: `zfloat 2.6s ease-in-out infinite ${delay}`,
  });

  return (
    <Html transform position={[0, 0.1, Z_SCHERMO + 0.04]} distanceFactor={3} style={{ pointerEvents: "none" }}>
      <div style={{ width: "250px", height: "175px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", gap: "34px" }}>
        <div ref={occhioSx} style={occhio} />
        <div ref={occhioDx} style={occhio} />
        <span style={z("150px", "70px", "26px", "0s")}>z</span>
        <span style={z("172px", "52px", "34px", "0.6s")}>Z</span>
        <span style={z("196px", "32px", "44px", "1.2s")}>Z</span>
      </div>
    </Html>
  );
}

function Monitor({ puntatore, sensore, mood, message, ridendo, arrabbiato, idle, onClickModello }) {
  const gruppo = useRef();
  const [blink, setBlink] = useState(false);
  const [terminale, setTerminale] = useState(false);
  const [screensaver, setScreensaver] = useState(null); // "pong" oppure "dorme"
  const [sveglia, setSveglia] = useState(false);
  const ultimoGol = useRef(null); // "dx felice sx arrabbiato
  const [reazione, setReazione] = useState(null);
  const finRisveglio = () => {
    setScreensaver(null);
    setSveglia(false);
    Suoni.sveglia();
    if (ultimoGol.current === "dx") {
      setReazione("felice"); Suoni.risata();
      setTimeout(() => setReazione(null), 1500);
    } else if (ultimoGol.current === "sx") {
      setReazione("arrabbiato"); Suoni.arrabbiato();
      setTimeout(() => setReazione(null), 1500);
    }
    ultimoGol.current = null;
  };
  
  useEffect(() => {
    if (idle) { 
      setSveglia(false); 
      const scelto = Math.random() < 0.5 ? "pong" : "dorme";
      setScreensaver(scelto);
    } 
    else { setSveglia(true); }                          // risveglio dello screensaver attivo
  }, [idle]);

  // battiti di ciglia IRREGOLARI, ogni tanto doppi (come EMO)
  useEffect(() => {
    if (terminale) return;
    let timer;
    const batti = (doppio) => {
      setBlink(true);
      setTimeout(() => {
        setBlink(false);
        if (doppio) setTimeout(() => {
          setBlink(true);
          setTimeout(() => setBlink(false), 110);
        }, 130);
      }, 110);
    };
    const programma = () => {
      const attesa = 1800 + Math.random() * 3500;       // intervallo casuale
      timer = setTimeout(() => { batti(Math.random() < 0.25); programma(); }, attesa);
    };
    programma();
    return () => clearTimeout(timer);
  }, [terminale]);

  useEffect(() => {
    if (message) {
      setBlink(true);
      const t = setTimeout(() => { setBlink(false); setTerminale(true); }, 200);
      return () => clearTimeout(t);
    } else {
      setTerminale(false);
    }
  }, [message]);

  useFrame((state) => {
    const g = gruppo.current;
    if (!g) return;
    const ry = (puntatore.current.x + (sensore?.current?.x || 0)) * 0.4;
    const rx = (-puntatore.current.y + (sensore?.current?.y || 0))* 0.25;
    g.rotation.y += (ry - g.rotation.y) * 0.05;
    g.rotation.x += (rx - g.rotation.x) * 0.05;
    if (ridendo) g.rotation.z = Math.sin(state.clock.elapsedTime * 30) * 0.06;
    else g.rotation.z += (0 - g.rotation.z) * 0.1;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
      <group
       ref={gruppo}
       onClick={(e) => { e.stopPropagation(); onClickModello && onClickModello();}}
       onPointerOver={() => (document.body.style.cursor = "pointer")}
       onPointerOut={() => (document.body.style.cursor = "auto")}
       >
        <mesh>
          <boxGeometry args={[2.4, 2.2, 0.6]} />
          <meshStandardMaterial color="#d6cba0" roughness={0.7} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.1, Z_SCHERMO - 0.02]}>
          <boxGeometry args={[2.05, 1.55, 0.05]} />
          <meshStandardMaterial color="#0a1410" emissive="#0e3a24" emissiveIntensity={0.4} roughness={0.4} />
        </mesh>

        {reazione
          ? <FacciaLiscia espressione={reazione} puntatore={puntatore} blink={false} />
          : arrabbiato
          ? <FacciaLiscia espressione="arrabbiato" puntatore={puntatore} blink={false} />
          : ridendo
          ? <FacciaLiscia espressione="ridere" puntatore={puntatore} blink={false} />
          : terminale
          ? <SchermoTerminale testo={message} />
          : screensaver === "pong"
          ? <Pong sveglia={sveglia} onSvegliato={finRisveglio} onGol={(lato) => (ultimoGol.current = lato)} />
          : screensaver === "dorme"
          ? <Dorme sveglia={sveglia} onSvegliato={finRisveglio} />
          : <FacciaLiscia espressione={mood} puntatore={puntatore} blink={blink} />}
          
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

export default function Scene3D({ inCornice = false }) {
  const { mood, message } = useMascotte();
  const puntatore = useRef({ x: 0, y: 0 });
  const sensore = useRef({ x: 0, y: 0});
  const [serveTilt, setServeTilt] = useState(false);

  // su mobile mostriamo il pulsante per attivare i sensori
  useEffect(() => {
    const tocco = "ontouchstart" in window;
    if (tocco) setServeTilt(true);
  }, []);

  const attivaTilt = () => {
    const DOE = window.DeviceOrientationEvent;
    const parte = () => {
      window.addEventListener("deviceorientation", (e) => {
        // gamma = inclinazione sinistra/destra, beta = avanti/indietro
        sensore.current.x = Math.max(-1, Math.min(1, (e.gamma || 0) / 35));
        sensore.current.y = Math.max(-1, Math.min(1, ((e.beta || 0) - 45) / 35));
      });
      setServeTilt(false);
    };
    // iOS: serve chiedere il permesso
    if (DOE && typeof DOE.requestPermission === "function") {
      DOE.requestPermission().then((res) => { if (res === "granted") parte(); }).catch(() => {}); 
    } else {
      parte();
    }
  };

  const [ridendo, setRidendo] = useState(false);
  const [arrabbiato, setArrabbiato] = useState(false);
  const tap = useRef(0);
  const arrabbiatoRef = useRef(false);
  useEffect(() => { arrabbiatoRef.current = arrabbiato; }, [arrabbiato]);
  const [idle, setIdle] = useState(false);
  const ultimaAttivita = useRef(Date.now());

  const solletico = useRef(0);       // quanto "solletico" accumulato
  const ultimaPos = useRef(null);
  const ridendoRef = useRef(false);  // copia aggiornata, per leggerla dentro l'handler
  useEffect(() => { ridendoRef.current = ridendo; }, [ridendo]);

  useEffect(() => {
    const onMove = (e) => {
      // inclinazione verso il mouse (come prima)
      puntatore.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      puntatore.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      ultimaAttivita.current = Date.now();
      setIdle(false);

      // SOLLETICO: sei nell'angolo in basso a destra, dove vive la mascotte?
      const inAngolo = e.clientX > window.innerWidth - 340 && e.clientY > window.innerHeight - 340;
      if (inAngolo && ultimaPos.current) {
        const dx = e.clientX - ultimaPos.current.x;
        const dy = e.clientY - ultimaPos.current.y;
        solletico.current += Math.sqrt(dx * dx + dy * dy);
        if (solletico.current > 500 && !ridendoRef.current) {
          setRidendo(true);
          Suoni.risata();
          setTimeout(() => setRidendo(false), 1800);
          solletico.current = 0;
        }
      }
      ultimaPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove);
    // il solletico svanisce se smetti di muovere il mouse
    const decay = setInterval(() => { solletico.current = Math.max(0, solletico.current - 60); }, 100);
    const decayTap = setInterval(() => { tap.current = Math.max(0, tap.current - 1); }, 600);
    return () => { window.removeEventListener("pointermove", onMove); clearInterval(decay); clearInterval(decayTap); };
  }, []);

  useEffect(() => {
    const sveglia = () => { ultimaAttivita.current = Date.now(); setIdle(false); Suoni.sbloccaAudio(); };
    window.addEventListener("pointerdown", sveglia);
    window.addEventListener("keydown", sveglia);
    window.addEventListener("wheel", sveglia);
    window.addEventListener("touchstart", sveglia);
    const check = setInterval(() => {
      if (Date.now() - ultimaAttivita.current > 6000) setIdle(true);   // 6s di stop → screensaver
    }, 500);
    return () => {
      window.removeEventListener("pointerdown", sveglia);
      window.removeEventListener("keydown", sveglia);
      window.removeEventListener("wheel", sveglia);
      window.removeEventListener("touchstart", sveglia);
      clearInterval(check);
    };
  }, []);

  // "pungola": ogni click sul modello accumola fastidio; troppi -> si arrabbia
  const pungola = () => {
    Suoni.sbloccaAudio();
    Suoni.blipParlato();
    tap.current += 1;
    if (tap.current >= 5 && !arrabbiatoRef.current) {
      setArrabbiato(true);
      Suoni.arrabbiato();
      setTimeout(() => setArrabbiato(false), 2000);
      tap.current = 0;
    }
  };

  // sblocca l'audio al PRIMO gesto qualunque dell'utente, poi si disattiva da solo
  useEffect(() => {
    const sblocca = () => Suoni.sbloccaAudio();
    window.addEventListener("pointerdown", sblocca, { once: true });
    window.addEventListener("keydown", sblocca, { once: true });
    window.addEventListener("touchstart", sblocca, { once: true });
    return () => {
      window.removeEventListener("pointerdown", sblocca);
      window.removeEventListener("keydown", sblocca);
      window.removeEventListener("touchstart", sblocca);
    };
  }, []);

  return (
    <div className={inCornice ? styles.inCornice : styles.sfondo}>
      <Canvas camera={{ position: [0, 0, 7.4], fov: 45 }} dpr={[1, 2]} style={{ pointerEvents: "auto", touchAction: "pan-y" }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 5]} intensity={1.3} />
        <directionalLight position={[-4, -2, 2]} intensity={0.3} color="#8a8794" />
        <Suspense fallback={null}>
          <Monitor puntatore={puntatore} sensore={sensore} mood={mood} message={message} ridendo={ridendo} arrabbiato={arrabbiato} idle={idle} onClickModello={pungola} />
       </Suspense>
      </Canvas>
      

      {serveTilt && (
        <button
          onClick={attivaTilt}
          style={{
            position: "absolute", top: "-34px", left: "50%", transform: "translateX(-50%)",
            whiteSpace: "nowrap", padding: "6px 12px", fontSize: "12px",
            borderRadius: "999px", border: "1px solid var(--bordo)",
            background: "rgba(20,19,26,0.85)", color: "var(--testo)",
            cursor: "pointer", pointerEvents: "auto",
          }}
        >
          📱 attiva movimento
        </button>
      )}
    </div>
  );
}


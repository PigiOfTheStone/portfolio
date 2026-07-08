import { useState, useEffect } from "react";
import styles from "./Ticker.module.css";
import Camminatore from "./icons/Camminatore.jsx";

export default function Ticker() {
  const [bpm, setBpm] = useState(73);
  const [passi, setPassi] = useState(4212);
  const [caffe, setCaffe] = useState(3);
  const [batteria, setBatteria] = useState(34);
  const [ora, setOra] = useState("");

  // BATTITO: oscilla dolcemente tra 72 e 76, aggiornandosi spesso
  useEffect(() => {
    const id = setInterval(() => {
      setBpm((b) => {
        const nuovo = b + (Math.random() < 0.5 ? -1 : 1);
        return Math.max(72, Math.min(76, nuovo));   // resta tra 72 e 76
      });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  // PASSI: crescono lentamente, come se camminassi davvero
  useEffect(() => {
    const id = setInterval(() => {
      setPassi((p) => p + Math.floor(Math.random() * 4)); // +0..3 ogni tanto
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // BATTERIA SOCIALE: cala pian piano (e ogni tanto si "ricarica")
  useEffect(() => {
    const id = setInterval(() => {
      setBatteria((v) => (v <= 10 ? 100 : v - 1));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  // ORA: reale, ogni secondo
  useEffect(() => {
    const id = setInterval(() => {
      setOra(new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const voci = [
    { icona: "♥", testo: `${bpm} BPM`, live: true },
    { icona: "♫", testo: "Ultimo brano: Bonobo — Kerala" },
    { icona: <Camminatore />, testo: `${passi.toLocaleString("it-IT")} passi oggi` },    { icona: "☕", testo: `Caffè n° ${caffe}` },
    { icona: "📍", testo: "Domegge di Cadore, IT" },
    { icona: "🕐", testo: ora },
    { icona: "🎨", testo: "In studio, probabilmente su Illustrator" },
    { icona: "🔋", testo: `Batteria sociale: ${batteria}%` },
  ];

  const loop = [...voci, ...voci];

  return (
    <div className={styles.ticker}>
      <div className={styles.track}>
        {loop.map((v, i) => (
          <span key={i} className={styles.voce}>
            <span className={`${styles.icona} ${v.live ? styles.pulse : ""}`}>
              {typeof v.icona === "string" ? v.icona : v.icona}
            </span>
            {v.testo}
            <span className={styles.sep}>/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
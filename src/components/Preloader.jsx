import { useRef, useMemo, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Preloader.module.css";

// le 13 celle del logo su griglia 5x5 (croce + diagonali)
const LOGO = new Set(["2,0","2,1","2,2","2,3","2,4","0,2","1,2","3,2","4,2","1,1","3,1","1,3","3,3"]);

const CELLA = 34;      // dimensione cella in px (i pixel della griglia di sfondo)
const ONDE = 3;        // quante onde implodono
const DURATA_ONDA = 1.0;

export default function Preloader({ onDone }) {
  const root = useRef(null);
  const logo = useRef(null);
  const [griglia, setGriglia] = useState({ cols: 0, rows: 0 });

  // misura lo schermo e calcola quante celle servono per riempirlo
  useLayoutEffect(() => {
    const cols = Math.ceil(window.innerWidth / CELLA) | 1;   // forza numero dispari
    const rows = Math.ceil(window.innerHeight / CELLA) | 1;  // così c'è un centro esatto
    setGriglia({ cols, rows });
  }, []);

  // per ogni cella: la sua distanza dal centro (normalizzata 0..1) e se è parte del logo
  const celle = useMemo(() => {
    const { cols, rows } = griglia;
    if (!cols) return [];
    const cx = (cols - 1) / 2;
    const cy = (rows - 1) / 2;
    const dMax = Math.hypot(cx, cy);
    const out = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // coordinate della cella rispetto alla griglia 5x5 del logo, centrata
        const lc = c - (cx - 2);
        const lr = r - (cy - 2);
        const isLogo = LOGO.has(`${lc},${lr}`);
        out.push({ d: Math.hypot(c - cx, r - cy) / dMax, isLogo });
      }
    }
    return out;
  }, [griglia]);

  useGSAP(() => {
    if (!celle.length) return;
    const px = gsap.utils.toArray(`.${styles.cella}`);
    const tl = gsap.timeline();

    // 1) ONDE CONCENTRICHE VERSO IL CENTRO (2-3 volte)
    //    ogni pixel pulsa con un ritardo proporzionale a quanto è ESTERNO:
    //    i più lontani partono prima → l'onda viaggia verso il centro
    // stato iniziale: tutti i pixel spenti a metà
    gsap.set(px, { opacity: 0.12, scale: 0.55 });

    // 1) ONDE CONCENTRICHE VERSO IL CENTRO
    for (let o = 0; o < ONDE; o++) {
      const inizio = 0.2 + o * (DURATA_ONDA * 1.2);   // le onde si accavallano un po'
      px.forEach((el) => {
        const d = parseFloat(el.dataset.d);            // 0 = centro, 1 = bordo
        tl.to(el, {
          keyframes: [
            { opacity: 1, duration: 0.15 },
            { opacity: 0.12, duration: 0.35 },
          ],
        }, inizio + (1 - d) * DURATA_ONDA);            // i pixel ESTERNI pulsano prima
      });
    }

    // 2) i pixel NON-logo svaniscono, restano solo i 13 del logo
    tl.to(px.filter((el) => el.dataset.logo !== "1"), {
      opacity: 0, scale: 0, duration: 0.6, ease: "power2.in",
      stagger: { each: 0.001, from: "random" },
    }, "+=0.15")
    .to(px.filter((el) => el.dataset.logo === "1"), {
      opacity: 1, scale: 1, duration: 0.4,
    }, "<")

    // 3) respiro
    .to({}, { duration: 0.35 })

    // 4) zoom + rotazione verso la camera (come prima)
    .to(logo.current, {
      scale: 14, rotation: 135, duration: 0.8, ease: "power3.in",
      transformOrigin: "center center",
    })

    // 5) impatto: si apre il sito
    .to(root.current, {
      autoAlpha: 0, duration: 0.25,
      onStart: () => onDone && onDone(),
    }, "-=0.15");

    // il ritardo "a onda" vero: impostiamo il delay di ogni pixel dalla distanza
    px.forEach((el, i) => {
      gsap.set(el, { opacity: 0.12, scale: 1 });
    });
  }, { dependencies: [celle], scope: root });

  const { cols, rows } = griglia;

  return (
    <div ref={root} className={styles.preloader}>
      <div
        ref={logo}
        className={styles.griglia}
        style={{ "--cella": CELLA + "px", "--cols": cols, "--rows": rows }}
      >
        {celle.map((cel, i) => (
          <span
            key={i}
            className={styles.cella}
            data-logo={cel.isLogo ? "1" : "0"}
            data-d={cel.d.toFixed(3)}
          />
        ))}
      </div>
    </div>
  );
}
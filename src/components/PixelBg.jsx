import { useRef, useMemo, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./PixelBg.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function PixelBg({ children }) {
  const root = useRef(null);
  const griglia = useRef(null);

  const [n, setN] = useState(0);
  const CELLA = 56;   // deve combaciare con i px nel CSS

  useLayoutEffect(() => {
    const misura = () => {
      const el = root.current;
      if (!el) return;
      const cols = Math.ceil(el.offsetWidth / CELLA);
      const rows = Math.ceil((el.offsetHeight * 1.24) / CELLA) + 2; // +24% per la parallasse
      setN(cols * rows);
    };
    misura();
    // rimisura se la finestra cambia o se la sezione cresce (nuovi contenuti)
    const ro = new ResizeObserver(misura);
    if (root.current) ro.observe(root.current);
    window.addEventListener("resize", misura);
    return () => { ro.disconnect(); window.removeEventListener("resize", misura); };
  }, []);

  const celle = useMemo(() => Array.from({ length: n }, (_, i) => i), [n]);
  useGSAP(() => {
    if (!n || !griglia.current || griglia.current.children.length === 0) return;
    // i pixel si assemblano man mano che la sezione entra, legati allo scroll
    gsap.from(griglia.current.children, {
      opacity: 0,
      scale: 0.3,
      ease: "power2.out",
      stagger: { each: 0.012, from: "random" },   // ← a caso, come le scale di Hogwarts
      scrollTrigger: {
        trigger: root.current,
        start: "top 90%",
        end: "top 25%",
        scrub: true,                               // legato allo scroll: sali = si smontano
      },
    });
    // parallasse: lo sfondo di pixel scorre più lento del contenuto
    gsap.to(griglia.current, {
      y: () => window.innerHeight * 0.18,
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: root, dependencies: [n] });

  return (
    <div ref={root} className={styles.wrap}>
      <div ref={griglia} className={styles.griglia}>
        {celle.map((i) => <div key={i} className={styles.pixel} />)}
      </div>
      <div className={styles.contenuto}>{children}</div>
    </div>
  );
}
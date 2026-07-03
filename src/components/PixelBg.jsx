import { useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./PixelBg.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function PixelBg({ children }) {
  const root = useRef(null);
  const griglia = useRef(null);

  const N = 700;   // celle generate: abbastanza da coprire schermi grandi
  const celle = useMemo(() => Array.from({ length: N }, (_, i) => i), []);

  useGSAP(() => {
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
  }, { scope: root });

  return (
    <div ref={root} className={styles.wrap}>
      <div ref={griglia} className={styles.griglia}>
        {celle.map((i) => <div key={i} className={styles.pixel} />)}
      </div>
      <div className={styles.contenuto}>{children}</div>
    </div>
  );
}
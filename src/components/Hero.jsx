import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Hero.module.css";
import GridHero from "./GridHero";

function Hero({ start }) {
  const root = useRef(null);
  const titolo = useRef(null);
  const sottotitolo = useRef(null);
  const reveal = useRef(null);
  const [rullato, setRullato] = useState(false);
  const griglia = useRef(null);

  useGSAP(() => {
    if (!start) return;

    // "creative designer" parte nascosto
    gsap.set(reveal.current, { opacity: 0, scale: 0.6, display: "inline-block" });

    const tl = gsap.timeline();
    // 1. entra la prima riga ("Ciao, sono un 🥁")
    tl.from(titolo.current, { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" })
      // 2. suspense: il tamburo rulla da solo per un attimo
      .to({}, { duration: 1.1 })
      // 3. PAF: appare "creative designer" con uno scatto elastico
      .to(reveal.current, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)", onStart: () => setRullato(true) }, "-=0.1")
      // 4. infine il sottotitolo
      .from(sottotitolo.current, { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" }, "-=0.1");
  }, { dependencies: [start], scope: root });

  useGSAP(() => {
    // parallasse: mentre scrolli via dalla hero, la griglia "resta indietro"
    gsap.to(griglia.current, {
      y: () => window.innerHeight * 0.45,   // ← quanto resta indietro (45% dello scroll)
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,        // legata allo scroll, non al tempo
      },
    });
    // bonus: il testo della hero sfuma leggermente mentre esce
    gsap.to(`.${styles.contenuto}`, {
      opacity: 0,
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "70% top",
        scrub: true,
      },
    });
  }, { scope: root });

  return (
    <section ref={root} className={styles.hero}>
      <div ref={griglia} className={styles.grigliaWrap}>
        <GridHero />
       </div> 
      <h1 ref={titolo} className={styles.titolo}>
        Ciao, sono un <span className={`${styles.tamburo} ${rullato ? styles.fermo : ""}`} aria-hidden="true">🥁</span><br />
        <span ref={reveal} className={styles.accento}>creative designer</span>
      </h1>
      <p ref={sottotitolo} className={styles.sottotitolo}>
        So che ne conosci già dodici. Ma dammi un secondo - e magari qualche scroll.
      </p>
    </section>
  );
}

export default Hero;
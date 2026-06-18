import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Hero.module.css";

function Hero({ start }) {
  const root = useRef(null);
  const titolo = useRef(null);
  const sottotitolo = useRef(null);

  useGSAP(() => {
    if (!start) return; // l'animazione parte quando il preloader ha finito
    // gsap.from: parte DA opacity 0 / 30px più in basso e arriva allo stato naturale (visibile)
    gsap.from([titolo.current, sottotitolo.current], {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
      stagger: 0.15, // titolo e sottotitolo entrano sfalsati
    });
  }, { dependencies: [start], scope: root });

  return (
    <section ref={root} className={styles.hero}>
      <h1 ref={titolo} className={styles.titolo}>
        Consulente informatico,<br />
        <span className={styles.accento}>art director</span> e docente.
      </h1>
      <p ref={sottotitolo} className={styles.sottotitolo}>
        Costruisco esperienze digitali su misura. Esplora i miei lavori —
        e tieni gli occhi aperti per le sorprese nascoste.
      </p>
    </section>
  );
}

export default Hero;
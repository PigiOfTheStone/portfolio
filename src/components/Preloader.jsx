import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Preloader.module.css";

function Preloader({ onDone }) {
  const root = useRef(null);
  const num = useRef(null);

  useGSAP(() => {
    const contatore = { v: 0 };
    gsap.timeline()
      // anima un numero da 0 a 100 e lo scrive a schermo a ogni frame
      .to(contatore, {
        v: 100,
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate: () => {
          if (num.current) num.current.textContent = Math.round(contatore.v) + "%";
        },
      })
      // poi alza la tendina; nel momento in cui parte, avvisa App (onDone)
      .to(root.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power3.inOut",
        onStart: () => { onDone(); },
      }, "+=0.2");
  }, { scope: root });

  return (
    <div ref={root} className={styles.preloader}>
      <span ref={num} className={styles.numero}>0%</span>
    </div>
  );
}

export default Preloader;
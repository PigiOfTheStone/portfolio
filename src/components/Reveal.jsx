import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function Reveal({ children, delay = 0 }) {
  // useRef è una "maniglia" verso l'elemento reale, così GSAP può animarlo.
  const box = useRef(null);

  // useGSAP esegue l'animazione e la ripulisce da solo quando serve.
  useGSAP(() => {
    gsap.from(box.current, {
      opacity: 0,
      y: 40,                 // parte 40px più in basso
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: box.current,
        start: "top 85%",    // scatta quando l'elemento arriva all'85% dello schermo
      },
    });
  }, { scope: box });

  return <div ref={box}>{children}</div>;
}

export default Reveal;
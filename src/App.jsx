import { useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Works from "./components/Works";
import About from "./components/About";

gsap.registerPlugin(ScrollTrigger);

function App() {
  // "loaded" parte da false; diventa true quando il preloader ha finito.
  const [loaded, setLoaded] = useState(false);
  useLenis(() => ScrollTrigger.update());

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, syncTouch: true }}>
      <Preloader onDone={() => setLoaded(true)} />
      <Header />
      <Hero start={loaded} />
      <Works />
      <About />
    </ReactLenis>
  );
}

export default App;
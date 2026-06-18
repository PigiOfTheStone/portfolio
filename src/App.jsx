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
import TicTacToe from "./components/TicTacToe";
import ChessGame from "./components/ChessGame";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loaded, setLoaded] = useState(false);
  const [giocoAperto, setGiocoAperto] = useState(false);
  const [scacchiAperti, setScacchiAperti] = useState(false);
  useLenis(() => ScrollTrigger.update());

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, syncTouch: true }}>
      <Preloader onDone={() => setLoaded(true)} />
      <Header onSegreto={() => setGiocoAperto(true)} />
      <Hero start={loaded} />
      <Works onOpenScacchi={() => setScacchiAperti(true)} />
      <About />
      {giocoAperto && <TicTacToe onClose={() => setGiocoAperto(false)} />}
      {scacchiAperti && <ChessGame onClose={() => setScacchiAperti(false)} />}
    </ReactLenis>
  );
}

export default App;
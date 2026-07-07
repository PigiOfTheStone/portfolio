import { useState, useEffect } from "react";
import AudioToggle from "./components/AudioToggle";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MascotteProvider, useMascotte } from "./mascotte/MascotteContext";
import Preloader from "./components/Preloader";
import Scene3D from "./components/Scene3D";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Works from "./components/Works";
import About from "./components/About";
import TicTacToe from "./components/TicTacToe";
import ChessGame from "./components/ChessGame";
import PixelBg from "./components/PixelBg";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

function Sito() {
  const { say, idle } = useMascotte();
  const [loaded, setLoaded] = useState(false);
  const [giocoAperto, setGiocoAperto] = useState(false);
  const [scacchiAperti, setScacchiAperti] = useState(false);
  useLenis(() => ScrollTrigger.update());

  const apriTris = () => { setGiocoAperto(true); say("sorpreso", "› avvio tris.exe…"); };
  const chiudiTris = () => { setGiocoAperto(false); idle(); };
  const apriScacchi = () => { setScacchiAperti(true); say("sorpreso", "› carico scacchi.exe…"); };
  const chiudiScacchi = () => { setScacchiAperti(false); idle(); };

  // easter egg: premi "t" per aprire il tris segreto
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "t" || e.key === "T") setGiocoAperto(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, syncTouch: true }}>
      <Preloader onDone={() => setLoaded(true)} />
      <div className="sito">
        <Header onSegreto={apriTris} />
        <Hero start={loaded} />
        <PixelBg>
          <Works onOpenScacchi={apriScacchi} />
        </PixelBg>
        <About />
        <Contact />
        <Footer />
      </div>

      <AudioToggle />
      {giocoAperto && <TicTacToe onClose={chiudiTris} />}
      {scacchiAperti && <ChessGame onClose={chiudiScacchi} />}
    </ReactLenis>
  );
}

export default function App() {
  return (
    <MascotteProvider>
      <Sito />
    </MascotteProvider>
  );
}
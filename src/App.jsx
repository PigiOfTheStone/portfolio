import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Works from "./components/Works";
import About from "./components/About";

function App() {
  return (
    // root = Lenis controlla lo scroll dell'intera pagina.
    // lerp più basso = scroll più "morbido".
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, syncTouch: true }}>
      <Header />
      <Hero />
      <Works />
      <About />
    </ReactLenis>
  );
}

export default App;
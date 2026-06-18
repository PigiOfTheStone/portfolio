import Hero from "./components/Hero";

function App() {
  return (
    <>
      <Hero />
      <section className="container" style={{ padding: "12vh 24px" }}>
        <h2>Lavori</h2>
        <p style={{ color: "var(--tenue)" }}>Qui andranno i tuoi progetti.</p>
      </section>
      <section className="container" style={{ padding: "12vh 24px" }}>
        <h2>Chi sono</h2>
        <p style={{ color: "var(--tenue)" }}>Due righe su di te.</p>
      </section>
    </>
  );
}

export default App;
import styles from "./Hero.module.css";

function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.titolo}>
        Consulente informatico,<br />
        <span className={styles.accento}>art director</span> e docente.
      </h1>
      <p className={styles.sottotitolo}>
        Costruisco esperienze digitali su misura. Esplora i miei lavori —
        e tieni gli occhi aperti per le sorprese nascoste.
      </p>
    </section>
  );
}

export default Hero;
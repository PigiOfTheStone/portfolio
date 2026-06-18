import styles from "./About.module.css";
import Reveal from "./Reveal";

function About() {
  return (
    <section id="chi-sono" className={styles.sezione}>
      <Reveal>
        <p className={styles.etichetta}>Chi sono</p>
        <p className={styles.testo}>
          Due o tre frasi su di te: cosa fai, come lavori, cosa ti rende diverso.
          Sei consulente, art director e insegni informatica — raccontalo con la tua voce.
        </p>
      </Reveal>
    </section>
  );
}

export default About;
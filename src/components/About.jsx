import styles from "./About.module.css";
import Reveal from "./Reveal";

function About() {
  return (
    <section id="chi-sono" className={styles.sezione}>
      <Reveal>
        <p className={styles.etichetta}>Chi sono</p>
        <p className={styles.testo}>
          Sono un Graphic, Motion e Illustrator designer, non più giovanissimo, ma è esperienza, non ruggine. Mi occupo di creatività a tutto tondo, dal graphic al motion design fino all'illustrazione, arrivando alla direzione creativa e allo sviluppo di campagne pubblicitarie
        </p>
        <p className={styles.testo} style={{marginTop: "1em"}}>
          Designer multidisciplinare per vocazione (e per noia della monotonia): ho lavorato nel web, nel design, nella grafica tradizionale, e persiono nella scrittura e nella produzione di videoclip.

        </p>
      </Reveal>
    </section>
  );
}

export default About;
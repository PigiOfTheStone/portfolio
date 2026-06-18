import styles from "./Works.module.css";
import Reveal from "./Reveal";

const progetti = [
  { titolo: "Progetto Uno", descrizione: "Cosa hai fatto e per chi." },
  { titolo: "Progetto Due", descrizione: "Sostituisci con un lavoro vero." },
  { titolo: "Progetto Tre", descrizione: "Consulenza, direzione artistica…" },
  { titolo: "Progetto Quattro", descrizione: "Aggiungine quanti vuoi." },
];

function Works() {
  return (
    <section id="lavori" className={styles.sezione}>
      <Reveal>
        <p className={styles.etichetta}>Lavori selezionati</p>
      </Reveal>
      <div className={styles.griglia}>
        {progetti.map((p, i) => (
          // delay crescente = le card appaiono una dopo l'altra (effetto "a cascata")
          <Reveal key={i} delay={i * 0.08}>
            <article className={styles.card}>
              <h3>{p.titolo}</h3>
              <p>{p.descrizione}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Works;
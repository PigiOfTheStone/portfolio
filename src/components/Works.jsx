import styles from "./Works.module.css";
import Reveal from "./Reveal";

const progetti = [
  { titolo: "Scacchi interattivi", descrizione: "Gioca una partita nel browser: regole complete, mosse legali, scacco matto.", giocabile: true },
  { titolo: "Progetto Due", descrizione: "Sostituisci con un lavoro vero." },
  { titolo: "Progetto Tre", descrizione: "Consulenza, direzione artistica…" },
  { titolo: "Progetto Quattro", descrizione: "Aggiungine quanti vuoi." },
];

function Works({ onOpenScacchi }) {
  return (
    <section id="lavori" className={styles.sezione}>
      <Reveal>
        <p className={styles.etichetta}>Projects</p>
      </Reveal>
      <div className={styles.griglia}>
        {progetti.map((p, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <article
              className={styles.card}
              onClick={p.giocabile ? onOpenScacchi : undefined}
              style={p.giocabile ? { cursor: "pointer" } : undefined}
            >
              <h3>{p.titolo}</h3>
              <p>{p.descrizione}</p>
              {p.giocabile && <span className={styles.gioca}>▶ gioca ora</span>}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Works;
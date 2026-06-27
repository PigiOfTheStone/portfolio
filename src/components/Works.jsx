import styles from "./Works.module.css";
import Reveal from "./Reveal";
import { useMascotte } from "../mascotte/MascotteContext";

const progetti = [
  { titolo: "Scacchi interattivi", descrizione: "Gioca una partita nel browser: regole complete, mosse legali, scacco matto.", giocabile: true, commento: "› carico scacchi.exe — pronto a perdere?" },
  { titolo: "Progetto Due", descrizione: "Sostituisci con un lavoro vero.", commento: "› apro progetto_02…" },
  { titolo: "Progetto Tre", descrizione: "Consulenza, direzione artistica…", commento: "› consulenza & art direction" },
  { titolo: "Progetto Quattro", descrizione: "Aggiungine quanti vuoi.", commento: "› file progetto_04" },
];

function Works({ onOpenScacchi }) {
  const { say, idle } = useMascotte();
  return (
    <section id="lavori" className={styles.sezione}>
      <Reveal>
        <p className={styles.etichetta}>Lavori selezionati</p>
      </Reveal>
      <div className={styles.griglia}>
        {progetti.map((p, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <article
              className={styles.card}
              onClick={p.giocabile ? onOpenScacchi : undefined}
              onMouseEnter={() => say("felice", p.commento)}
              onMouseLeave={idle}
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
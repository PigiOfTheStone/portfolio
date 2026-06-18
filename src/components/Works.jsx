import styles from "./Works.module.css";

// I progetti vivono in un elenco: aggiungerne uno = aggiungere una riga qui.
const progetti = [
  { titolo: "Progetto Uno", descrizione: "Cosa hai fatto e per chi." },
  { titolo: "Progetto Due", descrizione: "Sostituisci con un lavoro vero." },
  { titolo: "Progetto Tre", descrizione: "Consulenza, direzione artistica…" },
  { titolo: "Progetto Quattro", descrizione: "Aggiungine quanti vuoi." },
];

function Works() {
  return (
    <section id="lavori" className={styles.sezione}>
      <p className={styles.etichetta}>Lavori selezionati</p>
      <div className={styles.griglia}>
        {/* .map() crea una card per ogni progetto dell'elenco.
            "key" serve a React per distinguere gli elementi della lista. */}
        {progetti.map((p, i) => (
          <article key={i} className={styles.card}>
            <h3>{p.titolo}</h3>
            <p>{p.descrizione}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Works;
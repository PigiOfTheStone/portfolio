import { useState } from "react";
import styles from "./Contact.module.css";
import Reveal from "./Reveal";
import { useMascotte } from "../mascotte/MascotteContext";

const EMAIL = "hello@pigiofthestone.com";   // ← la tua email vera

const social = [
  { nome: "Instagram", url: "https://instagram.com/pigi.of.the.stone" }
];

function Contact() {
  const { say, idle } = useMascotte();
  const [copiato, setCopiato] = useState(false);

  const copia = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopiato(true);
      say("felice", "› email copiata negli appunti ✓");
      setTimeout(() => { setCopiato(false); idle(); }, 2000);
    } catch {
      // se la copia non è permessa, apriamo direttamente il client di posta
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contatti" className={styles.sezione}>
      <Reveal>
        <p className={styles.etichetta}>Contatti</p>
        <h2 className={styles.titolo}>
          Hai un progetto in mente?<br />
          <span className={styles.accento}>Parliamone.</span>
        </h2>
        <p className={styles.sotto}>
          O anche solo per dirmi che la mascotte ti ha fatto ridere. Accetto entrambi.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.riga}>
          
            <a href={`mailto:${EMAIL}`}
            className={styles.email}
            onMouseEnter={() => say("felice", "› componi nuova email…")}
            onMouseLeave={idle}
          >
            {EMAIL}
          </a>
          <button className={styles.copia} onClick={copia}>
            {copiato ? "copiata ✓" : "copia"}
          </button>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className={styles.social}>
          {social.map((s) => (
            
            <a key={s.nome}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => say("felice", `› apro ${s.nome.toLowerCase()}…`)}
              onMouseLeave={idle}
            >
              {s.nome} ↗
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export default Contact;
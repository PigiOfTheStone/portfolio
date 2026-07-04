import { useState } from "react";
import styles from "./Works.module.css";
import Reveal from "./Reveal";
import ProjectDetail from "./ProjectDetail";
import { useMascotte } from "../mascotte/MascotteContext";

const progetti = [
  {
    slug: "sinergia",
    copertina: "https://img.youtube.com/vi/uljk3OjuKmE/maxresdefault.jpg",
    titolo: "Sinergia",
    tipo: "Videoclip",
    anno: "2023",                                    // ← l'anno del progetto
    descrizione: "Videoclip realizzato per il corso di Montaggio per l'Università degli Studi di Udine.",
    ruoli: ["Montaggio", "Sceneggiatura", "Organizzazione riprese", "Color correction", "Color grading"],
    youtube: "uljk3OjuKmE",                             // ← l'ID del video (vedi sotto)
    racconto: "Realizzato insieme a un amico per l'esame di montaggio. Dalla stesura della sceneggiatura all'organizzazione delle giornate di ripresa, fino al montaggio e alla color.",
    commento: "› riproduco sinergia.mp4 — alza il volume",
  },
  {
    slug: "francobolli-domegge",
    copertina: "/progetti/francobolli/cover.jpg",
    titolo: "Francobolli delle Contrade",
    tipo: "Illustrazione / Grafica",
    anno: "2026",
    descrizione: "Una serie di francobolli illustrati per il torneo delle contrade di Domegge di Cadore.",
    immagini: [
      "/progetti/francobolli/01.jpg",
      "/progetti/francobolli/02.jpg",
      "/progetti/francobolli/03.jpg",
      "/progetti/francobolli/04.jpg",
      "/progetti/francobolli/05.jpg",
      "/progetti/francobolli/06.jpg",
      "/progetti/francobolli/07.jpg"
    ],
    racconto: "Per il torneo delle contrade di Domegge di Cadore ho disegnato una serie di francobolli: un'illustrazione per ogni zona tipica del paese, ciascuna con il suo carattere.",
    commento: "› apro collezione_contrade — non leccarli",

  },
  {
    slug: "aquilotti-volley",
    copertina: "/progetti/aquilotti/cover.jpg",
    titolo: "Aquilotti Volley",
    tipo: "Branding / Logo",
    anno: "2025",                              // ← l'anno
    descrizione: "Il logo della sezione pallavolo della US Aquilotti Pelos ASD.",
    immagini: [
      "/progetti/aquilotti/01.jpg"
    ],
    racconto: "Identità visiva per Aquilotti Volley, la branca pallavolistica della US Aquilotti Pelos ASD: un segno che doveva parlare alla squadra e al paese, funzionando dalla maglia da gioco allo striscione.",
    commento: "› carico aquilotti_logo.ai — schiacciata!",
  },
  {
    slug: "unione-cadore",
    copertina: "/progetti/unione-cadore/cover.PNG",
    titolo: "Unione Cadore Domegge",
    tipo: "Art Direction / Comunicazione",
    anno: "in corso",                          // ← la natura continuativa si dichiara qui
    descrizione: "Direzione artistica e comunicazione per la squadra di calcio locale.",
    immagini: [
      "/progetti/unione-cadore/01.PNG",
      "/progetti/unione-cadore/02.PNG",
      "/progetti/unione-cadore/03.PNG",
      "/progetti/unione-cadore/04.PNG",
      "/progetti/unione-cadore/05.PNG",
      "/progetti/unione-cadore/06.PNG",
      "/progetti/unione-cadore/07.PNG",
    ],
    racconto: "Curo la direzione artistica e la comunicazione dell'Unione Cadore Domegge: un linguaggio visivo coerente per tutto ciò che la squadra racconta, dalle grafiche delle partite ai social.",
    ruoli: ["Art direction", "Comunicazione", "Grafica", "Social"],
    commento: "› apro unione_cadore/ — forza ragazzi",
  },
  {
    slug: "scacchi",
    titolo: "Scacchi interattivi",
    tipo: "Web / Gioco",
    descrizione: "Una partita giocabile nel browser: regole complete, mosse legali, scacco matto.",
    giocabile: true,
    commento: "› carico scacchi.exe — pronto a perdere?",
  },
];

function Works({ onOpenScacchi }) {
  const { say, idle } = useMascotte();
  const [aperto, setAperto] = useState(null);   // il progetto aperto nel dettaglio

  const apri = (p) => {
    if (p.giocabile) onOpenScacchi();
    else setAperto(p);
  };

  return (
    <section id="lavori" className={styles.sezione}>
      <Reveal>
        <p className={styles.etichetta}>Lavori selezionati</p>
      </Reveal>
      <div className={styles.griglia}>
        {progetti.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <article
              className={styles.card}
              onClick={() => apri(p)}
              onMouseEnter={() => say("felice", p.commento)}
              onMouseLeave={idle}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.cover}>
                {p.copertina ? (
                  <img src={p.copertina} alt={p.titolo} loading="lazy" />
                ) : (
                  <div className={styles.coverFinta}>♟</div>
                )}
              </div>
              <div className={styles.corpo}>
                <p className={styles.tipoCard}>{p.tipo}</p>
                <h3>{p.titolo}</h3>
                <p>{p.descrizione}</p>
                {p.giocabile && <span className={styles.gioca}>▶ gioca ora</span>}
                {p.youtube && <span className={styles.gioca}>▶ guarda il video</span>}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      {aperto && <ProjectDetail progetto={aperto} onClose={() => setAperto(null)} />}
    </section>
  );
}

export default Works;
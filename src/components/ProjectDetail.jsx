import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ProjectDetail.module.css";

export default function ProjectDetail({ progetto, onClose }) {
  const [indice, setIndice] = useState(0);
  const imgs = progetto.immagini || [];
  const prev = () => setIndice((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setIndice((i) => (i + 1) % imgs.length);

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.pannello} onClick={(e) => e.stopPropagation()}>
        <button className={styles.chiudi} onClick={onClose}>chiudi ✕</button>

        <p className={styles.tipo}>{progetto.tipo}{progetto.anno ? ` — ${progetto.anno}` : ""}</p>
        <h2 className={styles.titolo}>{progetto.titolo}</h2>

        {progetto.youtube && (
          <div className={styles.video}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${progetto.youtube}`}
              title={progetto.titolo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {imgs.length > 0 && (
          <div className={styles.galleria}>
            <img
              key={indice}
              src={imgs[indice]}
              alt={`${progetto.titolo} — ${indice + 1} di ${imgs.length}`}
              className={styles.immagine}
            />
            {imgs.length > 1 && (
              <>
                <button className={`${styles.freccia} ${styles.sx}`} onClick={prev} aria-label="Precedente">‹</button>
                <button className={`${styles.freccia} ${styles.dx}`} onClick={next} aria-label="Successiva">›</button>
                <p className={styles.contatore}>{indice + 1} / {imgs.length}</p>
              </>
            )}
          </div>
        )}

        {progetto.racconto && <p className={styles.racconto}>{progetto.racconto}</p>}

        {progetto.ruoli && (
          <div className={styles.ruoli}>
            {progetto.ruoli.map((r) => (
              <span key={r} className={styles.ruolo}>{r}</span>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
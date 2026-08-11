import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./ProjectDetail.module.css";
import Scene3D from "./Scene3D";

export default function ProjectDetail({ progetto, onClose }) {
  const rulloRef = useRef(null);

  const [indice, setIndice] = useState(0);

  const imgs = progetto.immagini || [];
  const prev = () => setIndice((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setIndice((i) => (i + 1) % imgs.length);

  const dragStart = useRef(null);
  const dragStartY = useRef(null);
  const dragOffset = useRef(0);
  const larghezza = useRef(1);
  const orizzontale = useRef(false);

  const onTouchStart = (e) => {
    dragStart.current = e.touches[0].clientX;
    dragStartY.current = e.touches[0].clientY;
    larghezza.current = e.currentTarget.offsetWidth;
    orizzontale.current = false;
    if (rulloRef.current) rulloRef.current.style.transition = "none";
  };
  const onTouchMove = (e) => {
    if (dragStart.current === null) return;
    const dx = e.touches[0].clientX - dragStart.current;
    const dy = e.touches[0].clientY - dragStartY.current;

    // decide la direzione al primo movimento significativo
    if (!orizzontale.current && Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (!orizzontale.current) orizzontale.current = Math.abs(dx) > Math.abs(dy);

    if (!orizzontale.current) return;   // movimento verticale → lascia scorrere la scheda

    dragOffset.current = dx;
    if (rulloRef.current) {
      rulloRef.current.style.transform =
        `translateX(calc(-${indice * 100}% + ${dragOffset.current}px))`;
    }
  };
  const onTouchEnd = () => {
    if (orizzontale.current) {
      const soglia = larghezza.current * 0.2;
      let nuovo = indice;
      if (dragOffset.current < -soglia && indice < imgs.length - 1) nuovo = indice + 1;
      else if (dragOffset.current > soglia && indice > 0) nuovo = indice - 1;
      if (rulloRef.current) {
        rulloRef.current.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
        rulloRef.current.style.transform = `translateX(-${nuovo * 100}%)`;
      }
      setIndice(nuovo);
    }
    dragStart.current = null;
    dragStartY.current = null;
    dragOffset.current = 0;
    orizzontale.current = false;
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.pannello} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <button className={styles.chiudi} onClick={onClose} aria-label="Chiudi">✕</button>

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
        {progetto.interattivo === "mascotte" && (
          <div className={styles.mascotteBox}>
            <Scene3D inCornice />
          </div>
        )}

        {imgs.length > 0 && (
          <div className={styles.galleria}
               onTouchStart={onTouchStart}
               onTouchMove={onTouchMove}
               onTouchEnd={onTouchEnd}>
            <div ref={rulloRef} className={styles.rullo}
                 style={{ transform: `translateX(-${indice * 100}%)` }}>
              {imgs.map((src, i) => (
                <div className={styles.slide} key={i}>
                  <img src={src} alt={`${progetto.titolo} — ${i + 1}`} />
                </div>
              ))}
            </div>

            {imgs.length > 1 && (
              <div className={styles.puntini}>
                {imgs.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.puntino} ${i === indice ? styles.attivo : ""}`}
                    onClick={() => setIndice(i)}
                    aria-label={`Vai alla foto ${i + 1}`}
                  />
                ))}
              </div>
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
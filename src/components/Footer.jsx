import styles from "./Footer.module.css";


const EMAIL = "hello@pigiofthestone.com";   
export default function Footer() {

  const anno = new Date().getFullYear();   // si aggiorna da solo ogni anno

    return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.riga}>
          <button
            className={styles.top}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            ↑ torna su
          </button>
          <a href={`mailto:${EMAIL}`} className={styles.mail}>{EMAIL}</a>
        </div>

        <div className={styles.riga}>
          <span className={styles.copy}>© {anno} Pigi.of.the.Stone</span>
          <span className={styles.fatto}>Costruito a mano, un pixel alla volta.</span>
        </div>
      </div>
    </footer>
  );
}
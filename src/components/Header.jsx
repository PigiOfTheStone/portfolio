import { useLenis } from "lenis/react";
import { useMascotte } from "../mascotte/MascotteContext";
import styles from "./Header.module.css";

function Header({ onSegreto }) {
  const lenis = useLenis();
  const { say, idle } = useMascotte();
  const vaiA = (target) => lenis?.scrollTo(target, { offset: -80 });

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <button
          className={styles.logoBtn}
          onClick={() => lenis?.scrollTo(0)}
          aria-label="Torna all'inizio"
        >
          <img src="/logo.png" alt="Pigi.of.the.Stone" className={styles.logoEsteso} />
          <img src="/favicon-white.svg" alt="Pigi.of.the.Stone" className={styles.logoSimbolo} />

        </button>
      </div>
      <nav className={styles.nav}>
        <button onMouseEnter={() => say("felice", "› apro la sezione lavori…")} onMouseLeave={idle} onClick={() => vaiA("#lavori")}>lavori</button>
        <button onMouseEnter={() => say("felice", "› chi è Nome Cognome?")} onMouseLeave={idle} onClick={() => vaiA("#chi-sono")}>chi sono</button>
        <button onMouseEnter={() => say("felice", "› vado ai contatti…")} onMouseLeave={idle} onClick={() => vaiA("#contatti")}>contatti</button>      
      </nav>
    </header>
  );
}

export default Header;
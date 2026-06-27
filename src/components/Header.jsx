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
        Nome Cognome{" "}
        <button
          className={styles.segreto}
          onClick={onSegreto}
          onMouseEnter={() => say("sorpreso", "› simbolo sconosciuto… cliccami?")}
          onMouseLeave={idle}
          title="?"
        >✲</button>
      </div>
      <nav className={styles.nav}>
        <button onMouseEnter={() => say("felice", "› apro la sezione lavori…")} onMouseLeave={idle} onClick={() => vaiA("#lavori")}>lavori</button>
        <button onMouseEnter={() => say("felice", "› chi è Nome Cognome?")} onMouseLeave={idle} onClick={() => vaiA("#chi-sono")}>chi sono</button>
        <a onMouseEnter={() => say("felice", "› componi una nuova email…")} onMouseLeave={idle} href="mailto:tua@email.it">contatti</a>
      </nav>
    </header>
  );
}

export default Header;
import { useLenis } from "lenis/react";
import styles from "./Header.module.css";

function Header() {
  // useLenis è un "hook": dà al componente accesso all'istanza di Lenis.
  const lenis = useLenis();
  // scrollTo porta lo scroll fluido fino alla sezione con quell'id.
  const vaiA = (target) => lenis?.scrollTo(target, { offset: -80 });

  return (
    <header className={styles.header}>
      <div className={styles.logo}>PigiOfTheStone</div>
      <nav className={styles.nav}>
        <button onClick={() => vaiA("#lavori")}>lavori</button>
        <button onClick={() => vaiA("#chi-sono")}>chi sono</button>
        <a href="mailto:tua@email.it">contatti</a>
      </nav>
    </header>
  );
}

export default Header;
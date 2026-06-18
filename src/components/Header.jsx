import { useLenis } from "lenis/react";
import styles from "./Header.module.css";

function Header({ onSegreto }) {
  const lenis = useLenis();
  const vaiA = (target) => lenis?.scrollTo(target, { offset: -80 });

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        PigiOfTheStone{" "}
        {/* easter egg: cliccando il ✲ si apre il tris */}
        <button className={styles.segreto} onClick={onSegreto} title="?">✲</button>
      </div>
      <nav className={styles.nav}>
        <button onClick={() => vaiA("#lavori")}>lavori</button>
        <button onClick={() => vaiA("#chi-sono")}>chi sono</button>
        <a href="mailto:pigi7dp@gmail.com">contatti</a>
      </nav>
    </header>
  );
}

export default Header;
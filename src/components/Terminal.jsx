import { useEffect, useState } from "react";
import { useMascotte } from "../mascotte/MascotteContext";
import styles from "./Terminal.module.css";

export default function Terminal() {
  const { message } = useMascotte();
  const [mostrato, setMostrato] = useState("");

  // effetto macchina da scrivere: ad ogni messaggio, scrive lettera per lettera
  useEffect(() => {
    setMostrato("");
    if (!message) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setMostrato(message.slice(0, i));
      if (i >= message.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [message]);

  return (
    <div className={`${styles.terminale} ${message ? styles.visibile : ""}`} aria-hidden="true">
      <span className={styles.prompt}>assistant@pigi:~$</span>{" "}
      <span className={styles.testo}>{mostrato}</span>
      <span className={styles.cursore}>▋</span>
    </div>
  );
}
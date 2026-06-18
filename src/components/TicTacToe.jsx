import { useState } from "react";
import styles from "./TicTacToe.module.css";

// Le 8 combinazioni vincenti (righe, colonne, diagonali)
const LINEE = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function vincitore(b) {
  for (const [a,c,d] of LINEE) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return null;
}

// Minimax: l'IA prova TUTTE le mosse possibili in modo ricorsivo
// e sceglie quella ottimale. Per questo non perde mai.
function minimax(b, turnoAI) {
  const v = vincitore(b);
  if (v === "O") return { punteggio: 1 };   // vince l'IA
  if (v === "X") return { punteggio: -1 };  // vince il giocatore
  if (b.every(Boolean)) return { punteggio: 0 }; // pareggio

  const mosse = [];
  b.forEach((cella, i) => {
    if (!cella) {
      const prova = b.slice();
      prova[i] = turnoAI ? "O" : "X";
      mosse.push({ indice: i, punteggio: minimax(prova, !turnoAI).punteggio });
    }
  });

  // l'IA massimizza il punteggio, il giocatore lo minimizza
  return mosse.reduce((best, m) =>
    turnoAI ? (m.punteggio > best.punteggio ? m : best)
            : (m.punteggio < best.punteggio ? m : best)
  );
}

function TicTacToe({ onClose }) {
  // la scacchiera è un array di 9 caselle, vive nello stato
  const [board, setBoard] = useState(Array(9).fill(null));
  const vinc = vincitore(board);
  const pieno = board.every(Boolean);
  const finita = vinc || pieno;

  function gioca(i) {
    if (board[i] || finita) return;        // casella occupata o partita finita
    const nuovo = board.slice();           // copia (mai modificare lo stato direttamente!)
    nuovo[i] = "X";                        // mossa tua

    // se non hai chiuso la partita, risponde l'IA
    if (!vincitore(nuovo) && !nuovo.every(Boolean)) {
      nuovo[minimax(nuovo, true).indice] = "O";
    }
    setBoard(nuovo);
  }

  const messaggio =
    vinc === "X" ? "Hai vinto! (impossibile 😏)" :
    vinc === "O" ? "Ho vinto io." :
    pieno ? "Pareggio." :
    "Tocca a te (X)";

  return (
    <div className={styles.overlay}>
      <div className={styles.modale}>
        <button className={styles.chiudi} onClick={onClose}>chiudi ✕</button>
        <p className={styles.titolo}>✲ Tris segreto</p>
        <p className={styles.stato}>{messaggio}</p>
        <div className={styles.griglia}>
          {board.map((cella, i) => (
            <button key={i} className={styles.cella} onClick={() => gioca(i)}>
              {cella}
            </button>
          ))}
        </div>
        <button className={styles.ricomincia} onClick={() => setBoard(Array(9).fill(null))}>
          ricomincia
        </button>
      </div>
    </div>
  );
}

export default TicTacToe;
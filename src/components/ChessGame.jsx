import { useRef, useState } from "react";
import { Chess } from "chess.js";
import styles from "./ChessGame.module.css";

// Simboli Unicode "pieni" per tutti i pezzi; il colore lo diamo via CSS.
const PEZZI = { p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚" };

// Da riga/colonna della matrice al nome della casella (es. "e4")
const nomeCasella = (r, c) => "abcdefgh"[c] + (8 - r);

function ChessGame({ onClose }) {
  // La partita vive in un ref: un oggetto mutabile che sopravvive ai render.
  const game = useRef(null);
  if (game.current === null) game.current = new Chess();

  // "fen" è solo un interruttore per forzare il re-render dopo ogni mossa.
  const [, setFen] = useState(game.current.fen());
  const [selezionata, setSelezionata] = useState(null);
  const [destinazioni, setDestinazioni] = useState([]);

  const board = game.current.board(); // matrice 8x8 (riga 0 = traversa 8)
  const aggiorna = () => setFen(game.current.fen());

  function seleziona(square) {
    const dest = game.current.moves({ square, verbose: true }).map((m) => m.to);
    setSelezionata(square);
    setDestinazioni(dest);
  }

  function rispostaNera() {
    if (game.current.isGameOver()) return;
    const mosse = game.current.moves();
    if (mosse.length === 0) return;
    game.current.move(mosse[Math.floor(Math.random() * mosse.length)]); // mossa a caso
    aggiorna();
  }

  function click(r, c) {
    if (game.current.isGameOver()) return;
    if (game.current.turn() !== "w") return; // solo il tuo turno (Bianco)

    const square = nomeCasella(r, c);
    const pezzo = board[r][c];

    if (selezionata) {
      if (destinazioni.includes(square)) {
        try {
          game.current.move({ from: selezionata, to: square, promotion: "q" });
        } catch {
          /* mossa non valida: ignora */
        }
        setSelezionata(null);
        setDestinazioni([]);
        aggiorna();
        if (!game.current.isGameOver()) setTimeout(rispostaNera, 350);
        return;
      }
      if (pezzo && pezzo.color === "w") return seleziona(square); // cambia pezzo
      setSelezionata(null);
      setDestinazioni([]);
    } else if (pezzo && pezzo.color === "w") {
      seleziona(square);
    }
  }

  const stato = game.current.isCheckmate()
    ? game.current.turn() === "w" ? "Scacco matto — hai perso." : "Scacco matto — hai vinto!"
    : game.current.isDraw() ? "Patta."
    : game.current.isCheck() ? "Scacco!"
    : game.current.turn() === "w" ? "Tocca a te (Bianco)" : "L'avversario pensa…";

  function reset() {
    game.current = new Chess();
    setSelezionata(null);
    setDestinazioni([]);
    aggiorna();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modale}>
        <button className={styles.chiudi} onClick={onClose}>chiudi ✕</button>
        <p className={styles.titolo}>Scacchi</p>
        <p className={styles.stato}>{stato}</p>

        <div className={styles.scacchiera}>
          {board.map((riga, r) =>
            riga.map((cella, c) => {
              const square = nomeCasella(r, c);
              const chiara = (r + c) % 2 === 0;
              const classi = [
                styles.casella,
                chiara ? styles.chiara : styles.scura,
                selezionata === square ? styles.sel : "",
                destinazioni.includes(square) ? styles.dest : "",
              ].join(" ");
              return (
                <button key={square} className={classi} onClick={() => click(r, c)}>
                  {cella && (
                    <span className={cella.color === "w" ? styles.bianco : styles.nero}>
                      {PEZZI[cella.type]}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        <button className={styles.ricomincia} onClick={reset}>ricomincia</button>
      </div>
    </div>
  );
}

export default ChessGame;
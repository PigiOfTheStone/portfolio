import { createContext, useContext, useState } from "react";

const MascotteContext = createContext(null);

export function MascotteProvider({ children }) {
  const [mood, setMood] = useState("neutro");
  const [message, setMessage] = useState("");

  // say: cambia umore E scrive un commento nel terminale
  const say = (nuovoMood, testo = "") => { setMood(nuovoMood); setMessage(testo); };
  // idle: torna neutro e svuota il terminale
  const idle = () => { setMood("neutro"); setMessage(""); };

  return (
    <MascotteContext.Provider value={{ mood, message, setMood, setMessage, say, idle }}>
      {children}
    </MascotteContext.Provider>
  );
}

export function useMascotte() {
  return useContext(MascotteContext);
}
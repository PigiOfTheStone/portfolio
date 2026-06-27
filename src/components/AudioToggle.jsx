import { useState } from "react";
import * as Suoni from "../mascotte/suoni";

export default function AudioToggle() {
    const [muto, setMutoState] = useState(Suoni.isMuto());
    const toggle = () => {
        Suoni.sbloccaAudio();
        const nuovo = !muto;
        Suoni.setMuto(nuovo);
        setMutoState(nuovo);
    };
    return (
        <button
            onClick={toggle}
            aria-label={muto ? "Attiva audio" : "Disattiva audio"}
            style={{
                position: "fixed", left: "16px", bottom: "16px", zIndex: 60,
                width: "44px", height: "44px", borderRadius: "50%",
                border: "1px solid var(--bordo)", background: "rgba(20,19,26,0.7)",
                backdropFilter: "blur(4px)", color: "var(--testo)",
                fontSize: "18px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}
        >
            {muto ? "🔇" : "🔊"}
        </button>
    );
}
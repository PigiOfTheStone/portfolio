export default function Camminatore() {
  return (
    <svg viewBox="0 0 24 26" width="20" height="22" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* testa e busto — ferma */}
      <circle cx="12" cy="5.6" r="3" fill="currentColor" stroke="none" />
      <line x1="12" y1="8.6" x2="12" y2="17" />

      {/* GAMBE: ruotano dall'anca (12,17) */}
      <line className="camm-gamba-a" x1="12" y1="17" x2="12" y2="25" />
      <line className="camm-gamba-b" x1="12" y1="17" x2="12" y2="25" />

      {/* BRACCIA: ruotano dalla spalla (12,9) */}
      <line className="camm-braccio-a" x1="12" y1="9" x2="12" y2="15" />
      <line className="camm-braccio-b" x1="12" y1="9" x2="12" y2="15" />
    </svg>
  );
}
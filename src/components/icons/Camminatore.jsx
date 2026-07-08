export default function Camminatore() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* testa */}
      <circle cx="12" cy="4" r="2" />
      {/* corpo */}
      <line x1="12" y1="6" x2="12" y2="14" />
      {/* gambe che si alternano (animate via CSS) */}
      <g className="gamba-sx" style={{ transformOrigin: "12px 14px" }}>
        <line x1="12" y1="14" x2="9" y2="20" />
      </g>
      <g className="gamba-dx" style={{ transformOrigin: "12px 14px" }}>
        <line x1="12" y1="14" x2="15" y2="20" />
      </g>
      {/* braccia che si alternano */}
      <g className="braccio-sx" style={{ transformOrigin: "12px 8px" }}>
        <line x1="12" y1="8" x2="9" y2="12" />
      </g>
      <g className="braccio-dx" style={{ transformOrigin: "12px 8px" }}>
        <line x1="12" y1="8" x2="15" y2="12" />
      </g>
    </svg>
  );
}
// Suoni "animalese": brevi blip generati con la Web Audio API (niente file, niente copyright).
let ctx = null;
let master = null;
let attivo = false;
let muto = false;
try { muto = localStorage.getItem("audioMuto") === "1"; } catch {}
export function setMuto(v) { muto = v; try { localStorage.setItem("audioMuto", v ? "1" : "0"); } catch {} }
export function isMuto() { return muto; }

function init() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.12;   // volume generale (tienilo basso)
  master.connect(ctx.destination);
}

// I browser bloccano l'audio finché l'utente non interagisce: questo lo sblocca.
export function sbloccaAudio() {
  init();
  if (ctx.state === "suspended") ctx.resume();
  attivo = true;
}

// un singolo blip
function blip(freq = 440, durata = 0.08, tipo = "square") {
    if (!attivo || !ctx || muto) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = tipo;
    osc.frequency.value = freq;
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + 0.005);         // attacco rapido
    g.gain.exponentialRampToValueAtTime(0.001, t + durata); // decadimento dolce
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + durata);
    }

// blip "parlato": tono casuale, come il chiacchiericcio di Animal Crossing
export function blipParlato() {
  blip(280 + Math.random() * 320, 0.07, "square");
}

// risata: blip che salgono
export function risata() {
  [0, 90, 180, 270].forEach((ms, i) => setTimeout(() => blip(420 + i * 80, 0.09, "triangle"), ms));
}

// sbadiglio sonnolento: tono che scende lentamente (sta cedendo al sonno)
export function dorme() {
  if (!attivo || !ctx || muto) return;
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = "sine";
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(330, t);
  osc.frequency.exponentialRampToValueAtTime(160, t + 0.9);   // scende: sbadiglio
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.9, t + 0.15);
  g.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
  osc.connect(g); g.connect(master);
  osc.start(t); osc.stop(t + 1.0);
}

// stiracchiamento al risveglio: sbadiglio che sale e poi si rilassa
export function stiracchia() {
  if (!attivo || !ctx || muto) return;
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = "sine";
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.exponentialRampToValueAtTime(520, t + 0.5);   // sale (lo stiracchio)
  osc.frequency.exponentialRampToValueAtTime(300, t + 1.1);   // e si rilassa
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.9, t + 0.1);
  g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
  osc.connect(g); g.connect(master);
  osc.start(t); osc.stop(t + 1.2);
}

// risveglio: tono che sale
export function sveglia() {
  blip(300, 0.12, "triangle");
  setTimeout(() => blip(500, 0.14, "triangle"), 90);
}

// arrabbiato: blip bassi e ruvidi che scendono
export function arrabbiato() {
    blip(160, 0.18, "sawtooth");
    setTimeout(() => blip(120, 0.22, "sawtooth"), 110);
    setTimeout(() => blip(90, 0.28, "sawtooth"), 240);
}

export function pongHit(freq = 440) {
    blip(freq, 0.05, "square");
}

// punto segnato: due blip che salgono, da "gol" arcade
export function pongPunto() {
  blip(520, 0.1, "square");
  setTimeout(() => blip(780, 0.12, "square"), 90);
}
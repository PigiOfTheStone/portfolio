// Suoni "animalese": brevi blip generati con la Web Audio API (niente file, niente copyright).
let ctx = null;
let master = null;
let attivo = false;

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
  if (!attivo || !ctx) return;
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

// sbadiglio/sonno: tono basso che scende
export function dorme() {
  blip(300, 0.5, "sine");
  setTimeout(() => blip(200, 0.6, "sine"), 120);
}

// risveglio: tono che sale
export function sveglia() {
  blip(300, 0.12, "triangle");
  setTimeout(() => blip(500, 0.14, "triangle"), 90);
}
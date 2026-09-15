export async function onRequest(context) {
  const { request, env, next } = context;
  const utenteAtteso = env.DIRETTIVO_UTENTE;
  const passwordAttesa = env.DIRETTIVO_PASSWORD;

  if (!utenteAtteso || !passwordAttesa) {
    return new Response(
      "Accesso non configurato: mancano le variabili d'ambiente DIRETTIVO_UTENTE / DIRETTIVO_PASSWORD nel progetto Cloudflare.",
      { status: 500 }
    );
  }

  const intestazione = request.headers.get("Authorization") || "";
  const atteso = "Basic " + btoa(`${utenteAtteso}:${passwordAttesa}`);

  if (intestazione !== atteso) {
    return new Response("Accesso riservato.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Area riservata - direttivo Aquilotti Volley"' },
    });
  }

  return next();
}

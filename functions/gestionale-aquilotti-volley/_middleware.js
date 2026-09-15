export async function onRequest(context) {
  const { request, env, next } = context;
  const utenteAtteso = env.DIRETTIVO_UTENTE;
  const passwordAttesa = env.DIRETTIVO_PASSWORD;

  if (!utenteAtteso || !passwordAttesa) {
    return new Response(
      "Accesso non configurato: mancano le variabili d'ambiente DIRETTIVO_UTENTE / DIRETTIVO_PASSWORD nel progetto Cloudflare.",
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  const intestazione = request.headers.get("Authorization") || "";
  const atteso = "Basic " + btoa(`${utenteAtteso}:${passwordAttesa}`);

  // "Cache-Control: no-store" su OGNI risposta (anche quella con la pagina vera,
  // dopo un accesso riuscito): senza questa intestazione Cloudflare puo' salvare
  // in cache la prima risposta 401 e continuare a mostrarla a tutti, credenziali
  // corrette o no — e viceversa potrebbe mostrare la pagina vera anche a chi non
  // si e' autenticato, se qualcuno l'ha gia' vista prima. Meglio non rischiare.
  if (intestazione !== atteso) {
    return new Response("Accesso riservato.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Area riservata - direttivo Aquilotti Volley"',
        "Cache-Control": "no-store",
      },
    });
  }

  const risposta = await next();
  const risposta_non_cacheabile = new Response(risposta.body, risposta);
  risposta_non_cacheabile.headers.set("Cache-Control", "no-store");
  return risposta_non_cacheabile;
}

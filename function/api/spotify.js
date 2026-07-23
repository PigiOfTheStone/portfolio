export async function onRequest(context) {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = context.env;
  const json = (dati) =>
    new Response(JSON.stringify(dati), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
    });

  try {
    // 1) dal refresh token otteniamo un access token temporaneo
    const basic = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return json({ errore: "token", dettaglio: tokenData.error });

    // 2) chiediamo l'ultimo brano ascoltato
    const res = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const dati = await res.json();
    const track = dati.items?.[0]?.track;
    if (!track) return json({ errore: "nessun brano" });

    return json({
      brano: track.name,
      artista: track.artists.map((a) => a.name).join(", "),
    });
  } catch (e) {
    return json({ errore: "richiesta fallita" });
  }
}
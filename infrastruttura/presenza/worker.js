// Archivio Documentale Calatabiano — stima delle sessioni attive (Cloudflare Durable Object).
// La tabella contiene soltanto identificativi casuali di schede e scade dopo 120 secondi.
// Non archivia IP, user-agent, cookie, nomi, cronologia o totali storici.
const SITE = 'https://michelebottino-autor.github.io';
const WINDOW_MS = 120000;
const CORS = {
  'Access-Control-Allow-Origin': SITE,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
  'Vary': 'Origin'
};
const reply = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' }
});
export default {
  async fetch(request, env) {
    if (request.headers.get('Origin') !== SITE) return reply({ error: 'Origin not allowed' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/presence')
      return reply({ error: 'Not found' }, 404);
    if (!env.PRESENCE) return reply({ error: 'Service unavailable' }, 503);
    let body;
    try {
      const text = await request.text();
      if (text.length > 256) return reply({ error: 'Payload too large' }, 413);
      body = JSON.parse(text);
    } catch (_) { return reply({ error: 'Invalid JSON' }, 400); }
    if (!body || typeof body.id !== 'string' ||
        !/^[a-f0-9-]{32,36}$/i.test(body.id) ||
        typeof body.page !== 'string' ||
        !/^\/adc\/(?:[a-z0-9/_-]{0,160})$/i.test(body.page))
      return reply({ error: 'Invalid session' }, 400);
    try {
      // Un solo oggetto coordina tutte le pagine dell'ADC, evitando doppioni
      // quando una scheda passa dalla homepage a un dossier.
      const stub = env.PRESENCE.get(env.PRESENCE.idFromName('adc-global-v1'));
      const response = await stub.fetch('https://presence.internal/beat', {
        method: 'POST', body: JSON.stringify({ id: body.id, page: body.page })
      });
      if (!response.ok) return reply({ error: 'Service unavailable' }, 503);
      const result = await response.json();
      return reply(result);
    } catch (_) { return reply({ error: 'Service unavailable' }, 503); }
  }
};

export class Presence {
  constructor(ctx) {
    this.ctx = ctx;
    ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS active (id TEXT PRIMARY KEY, page TEXT NOT NULL, seen_at INTEGER NOT NULL)');
  }
  async fetch(request) {
    if (request.method !== 'POST') return new Response('Not allowed', { status: 405 });
    const { id, page } = await request.json();
    const sql = this.ctx.storage.sql;
    const now = Date.now();
    sql.exec('DELETE FROM active WHERE seen_at < ?', now - WINDOW_MS);
    sql.exec('INSERT INTO active (id,page,seen_at) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET page=excluded.page, seen_at=excluded.seen_at', id, page, now);
    // Un allarme elimina i token scaduti anche quando non arrivano altri lettori.
    await this.ctx.storage.setAlarm(now + WINDOW_MS + 5000);
    const total = sql.exec('SELECT COUNT(*) AS n FROM active').one().n;
    const here = sql.exec('SELECT COUNT(*) AS n FROM active WHERE page=?', page).one().n;
    return Response.json({ total: Number(total), page: Number(here), windowSeconds: WINDOW_MS / 1000 }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  }
  async alarm() {
    const sql = this.ctx.storage.sql;
    sql.exec('DELETE FROM active WHERE seen_at < ?', Date.now() - WINDOW_MS);
    const remaining = sql.exec('SELECT COUNT(*) AS n FROM active').one().n;
    if (Number(remaining) > 0) await this.ctx.storage.setAlarm(Date.now() + WINDOW_MS + 5000);
  }
}

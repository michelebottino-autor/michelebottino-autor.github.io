# Contatore lettori presenti — documentazione interna

Stato: **non attivo**. Nessun conteggio viene mostrato finché non esiste un servizio distribuito e un URL HTTPS configurato.

Componenti:
- `worker.js` — servizio Cloudflare Worker con Durable Object e conteggio temporaneo per pagina;
- `wrangler.toml` — configurazione del servizio;
- `/assets/js/lettori-presenti.js` — client condiviso;
- `/assets/css/lettori-presenti.css` — indicatore grafico.

Attivazione (richiede accesso a un account Cloudflare e approvazione del titolare):
1. Verificare disponibilità, costi e limiti del servizio Durable Objects.
2. Installare Wrangler nell'ambiente di distribuzione e pubblicare dalla cartella `infrastruttura/presenza` con `npx wrangler deploy`.
3. Verificare HTTPS, CORS, conteggio per pagina, scadenza sessioni, assenza di archiviazione persistente e resilienza ad abusi.
4. Valutare privacy, ruolo del fornitore, eventuali trasferimenti, tempi di conservazione dei log infrastrutturali e aggiornare l'informativa prima dell'attivazione.
5. Impostare `window.MB_PRESENCE_ENDPOINT` all'URL verificato **prima** di caricare `/assets/js/lettori-presenti.js`; includere anche il CSS condiviso.
6. Provare su due dispositivi e più schede, con consenso accettato e rifiutato. Non usare dati di prova in produzione.

Il conteggio è una stima di schede attive, non di persone uniche. La presenza di un proxy o di log del provider implica che l'IP possa essere trattato a livello di trasporto anche se l'applicazione non lo registra.

Il codice non deve essere inserito nelle pagine pubbliche prima del collaudo. Non pubblicare credenziali.

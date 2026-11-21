# ADC — Backend privato per le memorie

## Stato
**Stato verificato il 21 novembre 2026:** database D1 `adc-memorie-private` creato nella regione WEUR e schema importato (tabelle `testimonianze` e `richieste_giornaliere`); Worker `adc-memorie-api` distribuito con binding `DB` su `https://adc-memorie-api.darkaronteanonymous-72c.workers.dev`. Il servizio risponde con HTTP 503 / `Servizio non ancora configurato` perché non risultano ancora completati i segreti. Widget Turnstile ADC creato; chiave pubblica nel file `../config.json`, segreto mai nel repository. **Il modulo pubblico resta disattivato**, `enabled:false`. Non interpretare la distribuzione del Worker come avvio del trattamento di testimonianze.

## Manutenzione automatica e collaudo D1 (21 novembre 2026)
- Cron Trigger distribuito sul Worker: `25 3 * * *` (03:25 UTC) per la manutenzione quotidiana.
- I contatori antispam scaduti da oltre 7 giorni vengono eliminati dal database; la cancellazione automatica delle testimonianze è **disabilitata** finché non viene attivata separatamente `RETENTION_PURGE_ENABLED=true`.
- Criteri e durate predisposti: [CONSERVAZIONE.md](./CONSERVAZIONE.md). È necessaria la loro validazione prima di trattare testimonianze reali.
- Test di regressione JavaScript: **15/15 superati** sul PC Michele.
- Collaudo D1 remoto con una testimonianza sintetica: inserimento, lettura, cancellazione e conferma di **0 record residui**.
- Il Worker resta in `HTTP 503` per i segreti non configurati. `config.json.enabled=false`: nessun invio diretto dal sito ADC.

## Componenti
- `schema.sql`: schema per Cloudflare D1 (database privato).
- `worker.js`: API per invio, consultazione interna, approvazione, pubblicazione, ritiro e cancellazione.
- `../config.json`: file pubblico per l'attivazione del sito; non contiene chiavi segrete.
- `../registro.json`: registro pubblico storico, oggi vuoto; non caricare qui i racconti privati.

## Allestimento operativo
1. Creare dall'account ADC un Worker Cloudflare con dominio HTTPS e un database D1 riservato.
2. Eseguire `schema.sql` sul database D1, collegarlo al Worker con binding `DB`.
3. Configurare **solo nei segreti Worker**:
   - `ADMIN_TOKEN`: stringa casuale segreta lunga almeno 32 caratteri;
   - `RATE_SALT`: stringa segreta non pubblicata, per limitare invii giornalieri;
   - `TURNSTILE_SECRET`: secret Cloudflare Turnstile associato al sito ADC.
4. Registrare un widget Turnstile per `michelebottino-autor.github.io`. Conservare la site key pubblica, non il secret.
5. Mettere l'API dietro adeguate misure Cloudflare WAF/rate limiting, monitorare anomalie e svolgere controlli di protezione dati e sicurezza.
6. Testare `GET /v1/health`, invio con consenso, verifica antispam, invio senza consenso, richieste ripetute e divieto di pubblicazione senza doppia approvazione.
7. Testare gli endpoint riservati con un client amministrativo sicuro: `GET /v1/redazione/elenco`, `GET /v1/redazione/:id`, `PATCH /v1/redazione/:id`, `DELETE /v1/redazione/:id` (header `Authorization: Bearer <token>`). Non inserire il token nella pagina pubblica, negli URL o nel repository.
8. Definire e pubblicare un'informativa privacy specifica: titolare, scopo della raccolta, base giuridica, durata di conservazione, destinatari/fornitori, diritti e contatti. Eseguire backup e prove di ripristino, con accessi limitati. Le testimonianze possono coinvolgere terzi e richiedono valutazione editoriale.
9. Solo a collaudo completato, aggiornare `../config.json` con `enabled:true`, l'origine HTTPS dell'API (campo `endpoint`) e la site key pubblica Turnstile.

## Modello editoriale
- `ricevuta`: conservazione privata; nessun pubblico accesso.
- `in_revisione`: istruttoria, eventuale richiesta di chiarimenti.
- `approvata`: solo con autorizzazione nominale o anonima, revisione fatta.
- `pubblicata`: richiede stato precedente `approvata` e testo pubblico redatto e controllato.
- `ritirata`: non più visibile pubblicamente.
- `respinta`: non visibile pubblicamente; decidere tempi e criteri di eliminazione.

**Importante:** l'API non verifica da sola l'identità del narratore o la titolarità dei diritti; l'approvazione del redattore resta indispensabile. L'anonimato pubblico non significa anonimato tecnico rispetto ai recapiti volontariamente conferiti.

## Pubblicazione / protezione dati
Non caricare nel repository pubblico testimonianze grezze, nomi di persone non autorizzate, contatti, indirizzi, email, consensi, esportazioni del database o credenziali. Per modifiche o ritiro l'utente deve poter contattare il titolare, che dovrà identificare la pratica e intervenire nell'archivio privato.

## Limiti attuali
Questa release è un **prototipo distribuito ma non ancora attivo per l'acquisizione**. Manca la configurazione riservata dei tre segreti, la validazione dell'HTTPS da rete esterna, una prova integrale Turnstile/invio/lettura amministrativa e l'informativa privacy per la raccolta. L'ultimo controllo HTTPS da Node.js ha ricevuto HTTP 503, in linea con i segreti mancanti. Non contiene dashboard amministrativa autenticata pronta all'uso e non fornisce trascrizione di audio, archiviazione di fotografie o riconoscimento automatico di fonti.

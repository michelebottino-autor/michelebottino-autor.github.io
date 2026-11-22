# ADC — Backend privato per le memorie

## Stato
**Verifica aggiornata al 22 novembre 2026:** Worker Cloudflare adc-memorie-api raggiungibile in HTTPS, collegato al database privato D1 adc-memorie-private. I segreti ADMIN_TOKEN, RATE_SALT e TURNSTILE_SECRET sono registrati nell'ambiente Worker, senza valori nel repository. La verifica /v1/health restituisce HTTP 200 (ready). I controlli remoti hanno dato HTTP 401 senza credenziale amministrativa, HTTP 200 con credenziale autorizzata, HTTP 403 per origine estranea e HTTP 400 per invio senza consenso. La pagina pubblica resta disattivata (enabled:false) finché non sono completati il collaudo Turnstile end-to-end, la valutazione privacy, la conservazione, i backup e le misure antiabuso.

## Manutenzione automatica e collaudo D1 (21 novembre 2026)
- Cron Trigger distribuito sul Worker: `25 3 * * *` (03:25 UTC) per la manutenzione quotidiana.
- I contatori antispam scaduti da oltre 7 giorni vengono eliminati dal database; la cancellazione automatica delle testimonianze è **disabilitata** finché non viene attivata separatamente `RETENTION_PURGE_ENABLED=true`.
- Criteri e durate predisposti: [CONSERVAZIONE.md](./CONSERVAZIONE.md). È necessaria la loro validazione prima di trattare testimonianze reali.
- Test di regressione JavaScript: **15/15 superati** sul PC Michele.
- Collaudo D1 remoto con una testimonianza sintetica: inserimento, lettura, cancellazione e conferma di **0 record residui**.
- Il Worker risponde ora con HTTP 200 al controllo di salute. config.json.enabled=false: nessun invio diretto dal sito ADC.

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

## Console redazionale locale
Il file `redazione-cli.mjs` è stato predisposto e verificato per la gestione riservata delle pratiche mediante terminale locale sul PC autorizzato. Non è un pannello pubblico, non contiene token, non crea utenze e non deve essere eseguito su macchine condivise.

Esempi nella cartella di distribuzione, dopo l'attivazione protetta del Worker:
- `node redazione-cli.mjs elenco`: elenco sintetico delle pratiche;
- `node redazione-cli.mjs leggi ADC-MEM-<uuid>`: lettura locale di una pratica;
- `node redazione-cli.mjs stato ADC-MEM-<uuid> in_revisione`: passaggio di revisione;
- `node redazione-cli.mjs stato ADC-MEM-<uuid> approvata`: approvazione di una testimonianza autorizzata;
- `node redazione-cli.mjs stato ADC-MEM-<uuid> pubblicata`: pubblicazione con testo redatto;
- `node redazione-cli.mjs stato ADC-MEM-<uuid> ritirata`: ritiro;
- `node redazione-cli.mjs elimina ADC-MEM-<uuid>`: eliminazione irreversibile con conferma esplicita.

Il programma chiede il token con digitazione nascosta e lo mantiene in memoria per la singola operazione. Non inserire il token in file pubblici, variabili di configurazione GitHub o argomenti della linea di comando. Proteggere comunque la sessione Windows e non stampare i risultati contenenti dati privati.

**Stato dei segreti:** i tre nomi sono stati verificati nell'ambiente Cloudflare il 22 novembre 2026. ADMIN_TOKEN e RATE_SALT sono generati distinti; la copia amministrativa è protetta localmente con DPAPI nell'account Windows autorizzato. TURNSTILE_SECRET proviene dal widget ADC esistente. Nessuna credenziale è pubblicata nel codice o nei log di questa documentazione. L'API è pronta, l'acquisizione pubblica resta disabilitata per le verifiche indicate sopra.

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

## Limiti ancora da chiudere

Il backend è operativo per controlli di salute e autenticazione amministrativa; sono superati 15 test locali. Non risultano ancora conclusi il collaudo reale di un token Turnstile seguito da inserimento e cancellazione di una testimonianza sintetica tramite API, la revisione delle condizioni privacy e dei termini di conservazione, la verifica di backup/ripristino e del WAF/rate limiting su Cloudflare. Finché questi controlli non sono conclusi non impostare enabled:true nella configurazione pubblica. L'assenza di invio diretto non impedisce il salvataggio locale della bozza né l'invio volontario via email.

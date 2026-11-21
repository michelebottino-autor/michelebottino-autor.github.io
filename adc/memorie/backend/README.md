# ADC — Backend privato per le memorie

## Stato
Implementazione predisposta nel repository pubblico; **nessun database, Worker, account o segreto viene creato automaticamente**. Non impostare `config.json.enabled=true` prima del collaudo su un servizio effettivamente operativo.

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
Questa release è un **prototipo distribuibile**, non un servizio attivato o collaudato in ambiente di produzione. Non contiene dashboard amministrativa autenticata pronta all'uso e non fornisce trascrizione di audio, archiviazione di fotografie o riconoscimento automatico di fonti.

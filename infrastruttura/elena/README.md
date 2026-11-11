# Elena ADC — backend IA sperimentale, non attivo

Questo componente non modifica il sito pubblico e non utilizza il computer dell'autore. Si tratta di una **proposta in collaudo**, non di un servizio distribuito. Le risposte attuali del sito continuano a funzionare localmente nel browser.

## Perimetro

- Cloudflare Worker separato dal servizio di presenza già esistente.
- Endpoint `POST /ask`, solo richieste JSON con `question` (3–240 caratteri) e facoltativo `context_topic` (identificativo breve); `GET /health` indica solo se la configurazione API esiste.
- Carica il JSON pubblico delle risposte da un indirizzo fisso dell'ADC. La ricerca si limita agli argomenti selezionati: niente scansione del PC, niente PDF privati, nessuna fonte acquisita automaticamente.
- Il modello propone una sintesi non revisionata, con collegamenti ricavati **dal JSON ADC**, mai inventati dal modello. La distinzione fra notizia e prova resta obbligatoria.
- `store:false` nelle richieste a OpenAI. Non si scrivono log applicativi di domande e non sono previste conversazioni persistenti. Ciò **non equivale** a garantire assenza di log del provider, conservazione zero o anonimato: verificare condizioni contrattuali e informative applicabili.
- Origine browser limitata al sito ufficiale, corpi richiesta limitati a 1024 byte, rate limit per client e limite globale. Il controllo `Origin` non autentica software non-browser. Gli indirizzi IP usati per il rate limit possono essere condivisi: possibile blocco collettivo.
- Richieste senza corrispondenza documentaria: HTTP 422. Problemi del servizio, del provider o limiti di frequenza: risposte codificate per il fallback documentario.

## Test isolati

`node --test test-worker.mjs`

Le prove usano dati fittizi coerenti con la struttura delle schede e un falso provider; non richiedono token né fanno chiamate a pagamento.

## Prerequisiti per un eventuale rilascio

1. Approvazione esplicita dei costi e della scelta dei fornitori, account Cloudflare con controllo del dominio/worker e account API valido.
2. Verifica sicurezza (abusi, rate limit, quota di spesa giornaliera, disponibilità, captcha se necessario), qualità delle risposte e accessibilità, usando dati di prova e senza archivi privati.
3. Valutazione privacy/GDPR, informative, localizzazione dei dati e tempi di conservazione effettivi prima di trasferire domande dei visitatori a terzi. La modalità generativa dovrà essere **attivata consapevolmente** e indicata come sperimentale nell'interfaccia.
4. Depositare `OPENAI_API_KEY` soltanto tra i secret Cloudflare, mai in `wrangler.toml`, HTML, JavaScript pubblico, log, commit o messaggi. `.dev.vars*` deve essere escluso da Git.
5. Collaudo reale sul Worker e test di fallback con il modello indisponibile. Aggiornare il client separatamente, solo dopo la verifica dell'endpoint HTTPS.

Per documentazione ufficiale: https://developers.cloudflare.com/workers/configuration/secrets/ e https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ ; https://developers.openai.com/api/reference/resources/responses/methods/create .

**Non eseguire `wrangler deploy` automaticamente.** L'integrazione con la pagina Elena non è ancora attiva.

# Contatore visite ADC (senza Google)
Contatore di **sessioni di visita** condiviso fra tutte le pagine ADC. Base editoriale richiesta: **2.000**. Non rappresenta 2.000 eventi effettivamente misurati.

Il sito GitHub Pages è statico e non può aggiornare da solo un conteggio condiviso. Il backend è un Cloudflare Worker con un database D1 indipendente da Google Analytics, senza cookie e senza registrazione di indirizzi IP o altri identificatori nel codice applicativo.

## Attivazione del servizio
Serve un account Cloudflare autorizzato. Da `adc-contatore`:
1. `npx wrangler login`
2. `npx wrangler d1 create adc-contatore-visite`
3. Inserire nel file `wrangler.json` l'ID del database restituito, nel binding `DB`.
4. `npx wrangler d1 execute adc-contatore-visite --remote --file=./schema.sql`
5. `npx wrangler deploy`
6. Verificare che `https://<worker>.workers.dev/visite` restituisca `{"total":2000}`.
7. Aggiornare il campo `endpoint` in `/adc/contatore-config.json` con l'indirizzo HTTPS effettivo (incluso `/visite`). Solo allora il contatore registra sessioni nuove.

## Semantica e limiti
- Alla prima visita alla sezione ADC di ciascuna sessione di scheda browser viene inviata una richiesta POST. Le altre pagine e ricariche della stessa scheda eseguono solo GET.
- Il conteggio è atomico mediante D1 e compare nel footer. JavaScript disabilitato, blocchi della rete e bot possono sottostimare o gonfiare il valore; **non è un contatore di persone uniche**.
- Non sono usati servizi Google, Google Analytics né pixel di tracciamento.
- Le protezioni anti-abuso e la valutazione privacy del provider devono essere verificate prima della messa in produzione.
- Il valore 2.000 è una base scelta dall'editore, non una statistica storicamente misurata.

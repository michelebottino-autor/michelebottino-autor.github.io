# Presenza in tempo reale nell’ADC

L’indicatore conta le connessioni aperte delle schede visibili con statistiche abilitate. Il conteggio è unico per l’intero ADC. Una persona con due schede attive in finestre visibili può essere contata due volte. È una misura delle sessioni attive, non delle persone uniche.

- Il browser apre una connessione WebSocket quando la pagina ADC è visibile e il consenso statistico è valido. La chiude quando la pagina passa in secondo piano, viene chiusa o il consenso è revocato.
- Il servizio restituisce soltanto il totale. Il browser aggiorna il valore ogni 30 secondi e lo nasconde in caso di disconnessione o risposta non valida.
- Nessun identificativo applicativo, indirizzo IP, user-agent, percorso visitato, cookie di presenza o storico viene scritto dal Worker. Cloudflare riceve i dati tecnici necessari a gestire la connessione; i log applicativi del Worker sono disabilitati.
- I widget incorporabili, i redirect e la pagina offline non partecipano.

## Distribuzione

1. Dal PC autorizzato, nella cartella `infrastruttura/presenza`, eseguire `npx wrangler deploy` sull’account che ospita il servizio dedicato ADC.
2. Verificare due connessioni con origine ADC, aggiornamento del totale dopo la chiusura e rifiuto delle altre origini.
3. Impostare `endpoint` in `adc/presenza-config.json` sull’indirizzo **WSS** verificato, incluso `/presence`. Con un indirizzo vuoto l’indicatore resta nascosto.
4. Eseguire `node --test tests/adc-presence.test.mjs` per ripetere i controlli del Worker.

Il servizio è separato dal contatore storico `adc-contatore`. Per sospendere l’indicatore senza toccare le visite registrate, svuotare il campo `endpoint`.

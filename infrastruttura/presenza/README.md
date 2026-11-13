# ADC — indicatore dei lettori online

**Stato:** codice e interfaccia predisposti; **backend Cloudflare non ancora distribuito**. Il sito non mostra cifre finché `/adc/presenza-config.json` non contiene un endpoint verificato.

## Che cosa conta
Stima delle **schede browser attive** in tutte le pagine dell'Archivio Documentale Calatabiano, non persone identificate o utenti unici. Una stessa scheda mantiene l'identificativo passando fra pagine ADC. Due schede distinte possono essere contate due volte. Non confondere il risultato con `/visite`, che è un contatore storico di sessioni.

- Segnale ogni 40 secondi quando la pagina è visibile.
- Finestra temporale di 120 secondi; le schede inattive escono dal conteggio.
- Il Durable Object conserva soltanto un token casuale di scheda, il percorso ADC e l'ultima attività; una pulizia periodica tramite alarm rimuove i token scaduti.
- Nessun dato personale raccolto nel codice applicativo (IP, email, nome, user-agent, cronologia); l'infrastruttura Cloudflare può trattare IP/log di trasporto secondo le proprie condizioni.
- Nessuna richiesta al servizio senza il consenso statistiche valido; con consenso negato o servizio assente il widget non appare.
- I widget incorporabili in siti esterni sono esclusi.

## Componenti esistenti
- `worker.js`: Cloudflare Worker con un Durable Object SQLite condiviso fra le pagine dell'ADC.
- `wrangler.toml`: configurazione e migrazione del Durable Object.
- `/assets/js/lettori-presenti.js`: client condiviso, già precaricato in modo inerte dalle pagine ADC.
- `/assets/css/lettori-presenti.css`: stile caricato solo quando arriva una cifra reale.
- `/adc/presenza-config.json`: impostazione pubblica dell'endpoint, inizialmente vuota.

## Operazioni prima dell'attivazione
1. Accedere all'account Cloudflare che gestirà **adc-presenza**. Su PC Michele Wrangler è installato ma al 13 novembre 2026 non è autenticato. Non usare un deploy temporaneo.
2. Verificare limiti e costi del piano Worker/Durable Object; anche il piano gratuito prevede limiti. Non inserire token o credenziali nel repository.
3. Dalla cartella `infrastruttura/presenza`, con account autorizzato: `npx wrangler deploy`.
4. Collaudare il nuovo endpoint `/presence`: origine consentita, origine rifiutata, due browser/schede, cambio pagina senza duplicazione, disattivazione consenso, uscita dopo 120 secondi, rimozione dal database dopo allarme.
5. Aggiornare le informative Privacy/Cookie sulla presenza anonima, sul consenso e sui dati di trasporto del provider.
6. Impostare `endpoint` in `/adc/presenza-config.json` sull'**URL base HTTPS realmente verificato** (senza `/presence`) e verificare la pubblicazione su GitHub Pages.
7. Verificare che il valore online rifletta soltanto il backend, senza valori dimostrativi, e che l'indicatore si nasconda se il servizio non risponde.

## Limiti e sicurezza
Il numero è una stima in tempo quasi reale, non un conteggio certo delle persone. La validazione dell'origine e degli input limita gli usi accidentali, ma non è una protezione completa contro richieste automatizzate: prima della distribuzione pubblica valutare rate limiting Cloudflare e abuso del servizio. Non conservare statistiche storiche o ID di tracciamento persistenti per questa funzione.

Non eliminare o modificare il contatore visite già operativo `adc-contatore`. 

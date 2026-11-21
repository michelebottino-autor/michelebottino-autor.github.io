# ADC Memorie — criteri di conservazione e cancellazione

Documento operativo, versione 21 novembre 2026. La raccolta automatica dal sito ADC non è ancora abilitata. I periodi seguenti sono **criteri predisposti**, da finalizzare nella valutazione privacy prima dell'attivazione con dati reali. Non costituiscono una deroga agli eventuali obblighi di legge o alle richieste esercitabili dagli interessati.

## Periodi predisposti

| Categoria | Periodo | Azione programmata |
| --- | --- | --- |
| Contatori antispam pseudonimizzati | 7 giorni dalla fine del giorno registrato | Eliminazione giornaliera automatica |
| Testimonianze ricevute, non ancora valutate (`ricevuta`, `in_revisione`) | 180 giorni dall'ultimo aggiornamento | Proposta di eliminazione, non attivata fino a validazione delle regole |
| Testimonianze approvate, ma non pubblicate (`approvata`) | 365 giorni dall'ultimo aggiornamento | Proposta di eliminazione, non attivata fino a validazione delle regole |
| Testimonianze ritirate o respinte (`ritirata`, `respinta`) | 30 giorni dall'ultimo aggiornamento | Proposta di eliminazione, non attivata fino a validazione delle regole |
| Testimonianze pubblicate (`pubblicata`) | Revisione editoriale almeno ogni 24 mesi | Non cancellare automaticamente; valutare necessità della conservazione, anonimizzazione e richieste di ritiro |

## Precauzioni

- Le testimonianze sono depositate in un database Cloudflare D1 privato, non nel repository GitHub Pages.
- La pubblicazione richiede consenso espresso (nome o anonimato) e approvazione redazionale.
- Un racconto ritirato non è più visibile dall'API pubblica; la cancellazione definitiva avviene con revisione o attraverso la politica di eliminazione una volta attivata.
- Eventuali richieste di accesso, rettifica, cancellazione e ritiro devono essere gestite con identificazione del richiedente e verifica di eventuali obblighi di conservazione.
- Sono necessari controllo degli accessi, verifiche periodiche dei fornitori, backup e prova di ripristino, nonché informativa specifica prima di abilitare gli invii diretti.
- Le scadenze vengono calcolate da `updated_at`, che può cambiare durante le revisioni. Il sistema non prolunga artificiosamente questa data con la manutenzione.
- Non pubblicare registri con recapiti personali o contenuti grezzi.
- Lo svuotamento delle testimonianze tramite cron è **disabilitato per impostazione iniziale** e richiede una variabile privata `RETENTION_PURGE_ENABLED=true`, oltre al completamento delle verifiche sopra descritte.
- Le statistiche del ciclo di manutenzione non contengono nomi né testo delle testimonianze.

Riferimento generale: GDPR, articoli 5(1)(e), 13 e 17. I periodi indicati sono una scelta organizzativa proposta per ADC, non termini obbligatori fissati dal GDPR.

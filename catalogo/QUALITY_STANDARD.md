# Standard di qualità editoriale e didattica — Officina delle Storie

**Documento interno.** Lingua sorgente autorevole: italiano (it). Versione 1.0, 2026-10-10.

## Regole vincolanti

1. Ogni corso ha un identificatore stabile, un syllabus sorgente versionato, obiettivi di apprendimento misurabili, destinatari, prerequisiti, durata verificabile, materiali, esercizi, rubriche di valutazione, soglia di superamento e condizioni di attestazione.
2. Le traduzioni devono conservare la struttura didattica e la portata delle affermazioni del testo italiano. Non sostituire lezioni integrali con sintesi, né domande ufficiali con domande inventate, quando si dichiara equivalenza.
3. Per ogni lingua conservare ID stabili per unità, attività, domande, risposte, feedback e risultati attesi. Versionare separatamente i contenuti e le valutazioni; registrare il rapporto con la versione italiana.
4. Ogni traduzione richiede revisione da parte di un professionista competente nella lingua di arrivo e nella materia; successivamente una seconda verifica editoriale e didattica, con registrazione di revisore, data, versione ed esito.
5. Prima della pubblicazione come corso equivalente: controllare completezza (tutti i testi, esercizi, opzioni, feedback, navigazione, informative, materiali e attestati), accessibilità, resa mobile, collegamenti, persistenza, privacy e criteri di valutazione.
6. Non pubblicare nelle pagine rivolte agli studenti commenti di lavorazione, note di debugging, segnaposto, TODO, numeri di commit, annotazioni per traduttori o affermazioni di equivalenza non verificate. Le informazioni necessarie sulle limitazioni effettive del servizio devono restare comprensibili e visibili.
7. Un attestato privato di partecipazione/completamento non è un titolo riconosciuto. Non utilizzare “accreditato”, “riconosciuto”, “certificazione professionale” o equivalenti senza documentazione formale pertinente al corso, ente, territorio e periodo.
8. In caso di lacune o incertezza, mantenere la versione linguistica nello stato **in_review** e non abilitarla come corso completo; le anteprime di studio devono essere identificate come tali e non possono erogare attestati.
9. Evitare attribuzioni, riferimenti normativi, citazioni o fonti non controllati; distinguere esempi ipotetici da fatti storici documentati. Conservare provenienza delle fonti e limiti delle prove.
10. Dopo ogni modifica di contenuto sorgente, riesaminare l'impatto sulle traduzioni e bloccare l'equivalenza finché non viene riallineata.

## Stati

- `planned`: traduzione non iniziata.
- `in_translation`: lavorazione.
- `in_review`: traduzione o adattamento disponibile solo per studio, non equivalente o non validato.
- `available`: corso completo nella lingua, verificato e approvato.
- `published` indica soltanto lo stato del corso, non quello della sua traduzione.

## Verifica corrente — Bottino Method

| Aspetto | Italiano | Inglese |
| --- | --- | --- |
| Lezioni | 8, testi integrali nella versione sorgente | 8 sintesi/adattamenti, **non traduzioni integrali** |
| Esercitazioni | Nel corso sorgente | Attività formative adattate |
| Valutazione | Verifiche e prova finale proprie | 2 verifiche e 1 prova formativa, **non equivalenti** |
| Avanzamento | Locale | Locale, separato |
| Attestato | Attestato privato previsto dal percorso italiano | Non disponibile |
| Stato linguistico | `available` | `in_review` |

**Esito:** l'inglese non supera il controllo di equivalenza. Nessun corso nelle altre lingue può essere dichiarato tradotto integralmente finché non supera il medesimo controllo.

## Scheda di approvazione per ogni lingua

Registrare: ID corso, lingua, versione sorgente, versione tradotta, unità complete/attese, attività complete/attese, prove complete/attese, revisore linguistico, revisore disciplinare, revisore accessibilità, esiti dei test funzionali e mobili, data e decisione finale. In assenza di tali prove, non impostare `available`.

## Riconoscimento futuro

Definire prima l'ente e il tipo di riconoscimento desiderato; richiedere i requisiti ufficiali aggiornati. Predisporre tracciabilità di programmi, carico didattico, identità e competenze dei docenti, evidenze delle verifiche, conservazione delle prove, accessibilità, privacy e procedure di qualità. Questo standard è una base organizzativa, **non un accreditamento**.

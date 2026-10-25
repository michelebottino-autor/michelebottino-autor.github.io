# Audit tecnico del catalogo formativo — 25 ottobre 2026

## Provenienza
Controllo della branch main del repository Michele Bottino mediante clone separato sul PC Michele. Questa scheda registra solo verifiche realmente effettuate, senza dichiarare collaudi didattici o valutazioni umane non avvenuti.

## Inventario verificato
- 14 percorsi nel catalogo, di cui 1 published, 3 in_development e 10 coming_soon.
- Bottino Method — Corso Base: 8 unità gestite tramite JavaScript (non come cartelle unita-N).
- Scrittura Investigativa: 10 pagine unità su 10.
- Le storie che mancano: 10 pagine unità su 10.
- L'archivio diventa racconto: 10 pagine unità su 10.
- I dieci percorsi coming_soon non hanno landing didattiche pubblicate; alcuni prevedono sei unità nel catalogo, ma non dispongono delle relative pagine.

## Risultati della scansione dei riferimenti locali
- Scrittura Investigativa: 231 riferimenti verificati, 0 mancanti.
- Le storie che mancano: 169 riferimenti verificati, 0 mancanti.
- L'archivio diventa racconto: 146 riferimenti verificati, 0 mancanti.
- Totale: 546 riferimenti HTML locali verificati, 0 mancanti.
- La scansione non certifica il funzionamento dei link esterni, degli eventi JavaScript né l'accessibilità.

## Limite strumentale verificato
L'esecuzione di `node storie-che-mancano/test-course-e2e.js` si interrompe per `Cannot find module 'puppeteer'` sulla copia temporanea del PC. Questo è un prerequisito del runner, non un errore funzionale dimostrato nel corso. Installare o indicare un'installazione autorizzata del modulo e un browser compatibile prima di ripetere l'E2E.

## Chiusura corretta
1. Eseguire i test browser esistenti per i tre corsi pilota.
2. Controllare salvataggio locale, export, navigazione, schermate mobili, esercizi e informative.
3. Documentare una revisione editoriale indipendente e una sperimentazione reale prima di cambiare i relativi stati o attivare attestati.
4. Conservare le limitazioni: niente iscrizioni o attestati verificabili finché non risultano attivi e collaudati backend, valutazione e gestione dell'identità.
5. Progettare i dieci percorsi futuri singolarmente, con syllabus sorgente, obiettivi, esercizi, rubriche e fonti, senza pubblicare lezioni segnaposto.

© 2026 Michele Bottino — verbale tecnico di audit.

# Audit di ricostruzione del progetto Elena / ADC — 30 ottobre 2026

## Perimetro realmente controllato
1. Registro pubblico delle approvazioni (`adc/assets/elena-risposte-approvate.json`): 0 risposte.
2. Verbali `collazione-elena-20261021.json`, `prova-documentaria-1213-elena-limiti-20261022.json`, `elena-collaudo-integrato-db-reale-20261022.json`: 18 affermazioni in confronto editoriale, zero approvazioni formali.
3. Dossier pubblico del 1213 e scheda di verifica 2026-10-30: attestazioni A01–A03 delimitate sul testo edito, immagini e originale non verificati.
4. PC Michele, `Documents/ADC_RECONCILIATION_RUN/COLLAZIONE_HILLEN_DOC4_20261022.md`: lavoro preesistente con 5 nuclei testuali H1213-01–05, già concluso sul piano testuale il 22 ottobre.
5. `TEST_HILLEN_DOC4_ISOLATO_20261022.json`: prove isolate, non autorizzazioni di pubblicazione.
6. Archivio ZIP condiviso `michelebottino_site_integrato.zip`: 105 elementi; nessun file nella directory ADC e nessun componente Elena. È una fonte parziale per l'audit del sito, non uno snapshot integrale del progetto ADC.
7. Codice `elena-servizio/src/index.js`: servizio predisposto e testato nel repository, non attestato come distribuito online.

## Risultati e correzioni di metodo
- Il riesame del documento 1213 durante il 30 ottobre ha ripetuto una collazione testuale già registrata il 22 ottobre. Non descrivere la ripetizione come nuova acquisizione.
- Le sigle `APPROVED_EXCERPTS_ONLY` nel test isolato non sono equivalenti allo stato `APPROVED_FOR_PUBLICATION` richiesto per Elena pubblica.
- Non identificare `Arnaldo` del testo con `Armaleo Monaldeschi` senza verifica indipendente.
- Non presentare l'edizione a stampa come la pergamena medievale originale o come nuova edizione critica.
- La voce e le letture statiche non dimostrano capacità generativa documentaria.
- L'header HTTP Origin e un token opzionale non equivalgono a un sistema completo di controllo degli abusi per un'API pubblica.

## Decisione operativa
Mantenere il registro di risposte approvate vuoto fino alla validazione responsabile di affermazioni con citazione puntuale. Non connettere il Worker a Elena prima dei controlli di sicurezza e della pubblicazione formale. Concentrare la verifica residua su reperibilità delle immagini già acquisite, confronto visivo e autorizzazione documentata da un revisore.

## Limite del presente audit
Non è un censimento di ogni file su tutti i dischi e servizi: per l'intero patrimonio ADC restano necessari inventario canonico, SHA-256 e confronto con le acquisizioni accessibili. Nessuna modifica ai documenti originali.

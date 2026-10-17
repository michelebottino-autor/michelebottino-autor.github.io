# Sincronizzazione controllata Elena — 17 ottobre 2026

Questo ramo prepara la revisione della base documentaria di Elena senza modificare le risposte pubblicate.

## Stato sorgenti locali
- CATALOGO_FONTI_LOCALI_ELENA.csv: 10 PDF censiti; 9 impronte SHA-256 distinte.
- ELENA_VERIFICHE_PRIORITARIE_2026-10-17.csv: 10 controlli storici.
- ELENA_FONTI_STAGING_V2.json: 10 documenti, 10 verifiche, nessun documento approvato.
- valida_elena_fonti.ps1: controllo eseguito sul PC con 0 errori e 1 gruppo duplicato.

## Vincoli di pubblicazione
Il catalogo locale include percorsi Windows e documenti non ancora certificati: non deve essere copiato nel repository pubblico. Le impronte e i metadati dei documenti sono mantenuti nel PC. Il ramo GitHub ospita solo questa traccia metodologica, non i PDF né lo staging.

Le risposte pubbliche adc/assets/elena-risposte.json e l'indice adc/assets/elena-indice.json non vengono sovrascritti.

## Prossimo gate
1. Confermare la corrispondenza tra citazioni del libro e fonti originali.
2. Approvare singolarmente i record con citazione e limiti probatori.
3. Generare un export pubblico che escluda percorsi locali, dati riservati e documenti non autorizzati.
4. Testare l'export contro le risposte attuali e pubblicare solo dopo revisione.

Nota: GitHub Pages e il PC non sono sincronizzati automaticamente. Questo file registra l'avvio della sincronizzazione di progetto, non un backend IA.

# Ricognizione PC Michele — 15 ottobre 2026

**Metodo:** Desktop Commander, lettura di directory e file CSV esistenti. Nessun file locale modificato.

## Fonti locali già presenti

- `Documents/Sito_Autore_Audit_20261015/Inventario_Completo.csv`: 87 righe compresa intestazione; inventario preesistente di tre cartelle.
- `Documents/Sito_Autore_Audit_20261015/Riepilogo_Cartelle.csv`: snapshot sito del 5 ottobre (64 file, 35,65 MB); archivio Elena (20 file, 6,1 MB); connettore Elena scaricato (2 file).
- `Documents/Sito_Autore_Audit_20261015/Duplicati_Esatti.csv`: vuoto. Non è una prova di assenza di duplicati sull'intero PC.
- `Documents/Sito_Autore_Backup_20261015/`: archivio di backup preesistente; non alterato.
- `Documents/Ricerca_Alcantara_Calatabiano/`: dossier, PDF, registri, immagini Cusa e fonti medievali; fuori dall'inventario sito di cui sopra.
- `Documents/Elena_Archivio_Sviluppo_20261015/Registro_Spostamenti.csv`: registro con percorsi di origine/destinazione e SHA-256 per pacchetti ZIP; non equiparare il numero di pacchetti a versioni installate.

## Criticità di versione

Il sito locale `Sito-Michele-Bottino-Snapshot-2026-10-05` è uno **snapshot storico**, non una copia integrale verificata dell'attuale repository GitHub. Nel suo inventario sono presenti `index.html`, `robots.txt`, `sitemap.xml` e pagine di contenuto, ma non va assunto che rappresenti lo stato pubblicato il 15 ottobre.

`Ricerca_Alcantara_Calatabiano/REGISTRO_AGGIORNAMENTI_SITO.md` registra una modifica dell'11 ottobre a `adc/index.html` (commit `7c239f42c0cb6fd1bdb2b8f4beeff4a6ef612bee`) e dichiara espressamente che il registro non è una copia completa del file HTML.

## Decisioni

1. Conservare snapshot, audit, backup e pacchetti Elena.
2. Usare GitHub come baseline per il codice corrente; lo snapshot locale serve per confronti storici, non per sovrascrivere `main`.
3. Analizzare gli ZIP Elena in modalità di sola lettura prima di decidere se contengano componenti non integrati.
4. Integrare nel registro maestro solo dati verificati, evitando duplicazioni di inventari.
5. Non eseguire script di installazione, sincronizzazione o attività pianificate prima di una revisione dei loro effetti.

## Stato degli strumenti

Lettura remota di directory e CSV riuscita. Un comando PowerShell di ispezione ha avuto un errore di quoting: nessuna modifica effettuata; il comando va corretto prima di riutilizzarlo.

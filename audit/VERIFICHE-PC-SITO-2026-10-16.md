# Verifiche operative PC Michele, Elena e sito — 16 ottobre 2026

**Ambito:** test eseguiti da ChatGPT con Desktop Commander sul PC Michele e letture del repository GitHub. Solo lettura per le automazioni esistenti; scritture limitate ai nuovi file di collaudo in `Documents/Sito_Autore_Audit_20261015` e al ramo GitHub di consolidamento. Nessun cambio al ramo `main`.

## Sistema Elena e convalida delle proposte

- Ollama locale raggiungibile tramite `http://127.0.0.1:11434/api/tags`; presente il modello `qwen3:8b` e altri modelli.
- Script Windows separato `audit/powershell/Verifica-Proposte-Elena-Isolata.ps1` eseguito direttamente sul PC con Windows PowerShell 5.1; legge i due file originali `Contesto_Sito_ADC.txt` e `Proposte_Elena_Da_Validare.md`, non altera il loro contenuto.
- Esito reale: **REJECT**, 13 URL nel contesto, 12 pagine analizzate, **16 segnalazioni tecniche**: 4 indirizzi pagina alterati, 4 domini alterati (gli stessi URL contati secondo due criteri), 4 campi obbligatori mancanti, 4 indizi di troncamento. Non sono 16 anomalie indipendenti.
- Regressioni verificate: rapporto sintetico completo **REVIEW_REQUIRED / 0 anomalie**; rapporto con intestazione `## Pagina 2 - errore` **REJECT / 2 anomalie**; rapporto originale **REJECT / 16 anomalie**.
- Risolto un difetto del primo prototipo PowerShell: `$host` è una variabile automatica di PowerShell e non può essere utilizzata per assegnare l'hostname; il controllo ora usa `$urlHost`.
- Output locale: `Documents/Sito_Autore_Audit_20261015/Elena_Validazione_Isolata_20261016.json` e file `Test_Elena_*_Risultato.json`.
- Il modulo attivo `Analizza-ADC-Ollama.ps1` resta invariato. Il limite `num_predict=380` e l'output libero spiegano plausibilmente troncamenti e indirizzi inventati; non sostituirlo senza un collaudo del modulo di qualità già esistente.

## Stato delle attività pianificate

| Attività | Stato osservato | Evidenza |
| --- | --- | --- |
| `Elena - Controllo sito ADC` | Ready | Ultima esecuzione 15 ottobre 22:45:12; `LastTaskResult=0`; prossimo avvio 16 ottobre 09:00 |
| `Elena_Studio_Autonomo` | Running | `LastTaskResult=267009` (codice di attività in esecuzione); usa PowerShell 7 nel percorso WindowsApps |
| `Calatabiano_Audit_V12` | Ready | Ultima esecuzione 16 ottobre 00:01:03; `LastTaskResult=0`; prossimo avvio 00:31:02 |

La pipeline V12 chiama `AGGIORNA_SITO_LIVE_V13.ps1` (snapshot locale di `/ricerca/`), `MEMORIA_INCREMENTALE_V10.ps1` (hash, catalogazione e riscontri testuali) e `CONTROLLO_INTEGRATO_V12.ps1` (triage locale). Ultimo log: **381 record**, di cui 355 `DA_VERIFICARE` e 26 `POSSIBILE_GIA_NOTO`. Nessuno di questi stati equivale a fonte storica accertata. La lettura dei tre script non ha individuato una funzione di pubblicazione verso GitHub.

## Sito GitHub e test HTTP

- Tree `main`: **311 file**; `sitemap.xml` pubblica **69 URL**, tutti corrispondenti a file del repository.
- Sei pagine ADC `index.html` mancavano dalla sitemap. Le due pagine `adc/widget/` e `adc/widget/compatto/` hanno `noindex` e rimangono escluse.
- Sul ramo `consolidamento/2026-10-15` aggiunte tre pagine indicizzabili: `adc/calatabiano-1922-1943/`, `adc/lapicidi-epigrafi/`, `adc/custode/`. La pagina di invio contributi `adc/contribuisci/invia/` rimane da valutare editorialmente; non è stata aggiunta automaticamente.
- La sitemap candidata contiene **72 URL distinti**, tutti risolvibili in percorsi GitHub esistenti. Non è pubblicata.
- Controllo HTTP **dal PC Michele** via `audit/powershell/Controllo-HTTP-Sitemap-Isolato.ps1`: 16 ottobre 00:20:53–00:21:15, **72 indirizzi HEAD verificati, 72 risposte HTTP 200, zero errori**. Include 69 URL pubblici e i tre candidati ADC. Risultato locale `Documents/Sito_Autore_Audit_20261015/Controllo_HTTP_Sitemap.csv`.
- HEAD 200 è prova di risposta HTTP in quel momento, non di funzionamento JS, accessibilità, correttezza dei dati o assenza di link rotti nelle pagine.

## Decisione e attività residue

1. Non aggiornare né pubblicare il rapporto grezzo di Ollama.
2. Sottoporre `Analizza-ADC-Qualita.ps1` a un test controllato prima di proporre la sostituzione del modulo produttivo.
3. Fare audit dei collegamenti interni e dei componenti JS, non ancora coperti dal solo HEAD.
4. Controllare documenti e fonti primarie prima di alterare affermazioni storiche.
5. Nessuna modifica alla configurazione delle attività pianificate o ai file attivi finché non siano dimostrati i benefici della nuova versione.

**Conclusione:** sono stati eseguiti test reali e risolti problemi nel validatore; il monitoraggio principale risulta operativo. L'intero sito e tutti i sottosistemi di Elena non possono ancora dirsi collaudati esaustivamente.

## Collaudo supplementare dei link interni

Il controllo read-only `audit/powershell/Controllo-Link-ADC-Isolato.ps1` è stato eseguito sul PC Michele dopo il test HEAD precedente. **72 pagine HTML recuperate senza errori**, **126 collegamenti interni distinti** ricavati dagli attributi HTML `href` e `src`, **126 risposte HTTP HEAD 200 e 0 non-200** (runtime 37,12 secondi). Output locale `Documents/Sito_Autore_Audit_20261015/Controllo_Link_Interni.csv`. Questo non comprende collegamenti generati a runtime da JavaScript né collaudi interattivi, ma supera il controllo della sola sitemap.

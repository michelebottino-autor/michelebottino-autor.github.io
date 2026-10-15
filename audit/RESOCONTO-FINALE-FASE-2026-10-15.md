# Chiusura della fase di audit e consolidamento — 15 ottobre 2026

## Ambito e decisione
Questa chiusura riguarda la **ricognizione tecnica e il contenimento dei rischi editoriali**, non la certificazione dell'intero sito o dell'archivio storico. La versione pubblica `main` non è stata modificata. Il ramo di lavoro è `consolidamento/2026-10-15`.

## Stato verificato
- Repository pubblico: baseline di 311 file tracciati, 33 HTML in `adc/` e 16 in `adc-prototipo/`. Il prototipo non ha ancora dimostrato equivalenza funzionale con l'originale.
- Due coppie di immagini con contenuto identico individuate, non eliminate in attesa di verifica dei riferimenti.
- Inventario parziale del PC Michele: snapshot del sito, 19 pacchetti ZIP Elena, script del connettore; non equivale all'inventario dell'intero disco.
- Task `Elena_Studio_Autonomo` osservato in esecuzione: due fonti abilitate EpiDoc/EAGLE, due acquisizioni documentarie, cicli successivi di controllo. Le acquisizioni sono **non validate**.
- Task `Elena - Controllo sito ADC`: copia XML giornaliera e script di acquisizione esaminati; monitoraggio locale, non pubblicazione GitHub. Rapporto del 15 ottobre ore 22:45: 71 pagine, 14 nuove/modificate rispetto al manifesto, 0 errori riportati.
- Script Ollama: usa `qwen3:8b` e produce proposte non validate. Rapporto reale con **4 URL di pagina alterati** e **almeno 3 terminazioni sospette**.
- Moduli `Analizza-ADC-Qualita.ps1` e `Analizza-ADC-Critico141.ps1` già presenti; il modulo critico respinge citazioni non letterali. Nessuna prova che una proposta costituisca un errore storico accertato.
- Validatore isolato `audit/valida-proposte-elena.py` aggiornato per controllare **ogni proposta**: URL atteso, host alterati, campi mancanti e indizi di troncamento. Non scrive file, non pubblica; `REJECT` blocca e `REVIEW_REQUIRED` richiede comunque revisione umana.

## Limiti non risolti
1. La versione aggiornata del validatore non è stata ancora collaudata end-to-end sui due file originali tramite esecuzione della CLI. La verifica dei troncamenti resta euristica e può produrre falsi positivi o negativi.
2. Le attività `Calatabiano_Audit_V12` e altre automazioni non sono state ispezionate integralmente; nessuna garanzia di assenza di ulteriori scritture automatiche.
3. La revisione delle 14 variazioni non equivale a verifica delle fonti primarie, e non è completata per tutte le pagine.
4. Le pergamene Cusa, Processo 334/184, i riferimenti 1201/1213, le licenze delle immagini e le collazioni archivistiche restano soggetti a verifica specialistica.
5. Non sono stati eseguiti test browser completi di accessibilità, navigazione, moduli, ricerca, SEO e compatibilità mobile.

## Criteri per l'eventuale messa in produzione
- Eseguire il validatore sui file originali e su casi limite; registrare risultati e regressioni.
- Non usare output Ollama grezzi per aggiornare il sito; preferire il validatore di qualità già presente e mantenere il controllo editoriale.
- Eseguire un confronto GitHub controllato e verificare le fonti storiche prima di cambiare una pagina.
- Approvazione esplicita prima di modificare task, script attivi, `main` o eliminare file.

**Esito della fase:** audit documentato e difesa editoriale predisposta sul ramo isolato; **non dichiarare chiuso il collaudo operativo né completato il consolidamento del sito**.

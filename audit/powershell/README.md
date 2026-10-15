# Uso controllato degli strumenti PowerShell

## Stato

Lo script `Inventario-Sito.ps1` è stato creato il 15 ottobre 2026 e **non è ancora stato collaudato sul PC Michele**. Il collegamento Desktop Commander risulta online ma il servizio segnala quota mensile esaurita. Non è prevista alcuna installazione o esecuzione remota finché il canale non torna operativo.

## Comportamento

- Legge una cartella sorgente ed eventualmente una seconda cartella da confrontare.
- Esclude dal censimento i percorsi sotto `.git` e `node_modules` e i file di tipo reparse point.
- Calcola SHA-256 e produce inventari, gruppi di duplicati esatti e differenze per percorso.
- Scrive soltanto nella cartella dei rapporti, che deve essere esterna a entrambe le cartelle sorgenti.
- Non effettua sincronizzazioni, cancellazioni, push, pull o modifiche ai file del sito.

## Esempio (percorsi illustrativi, da sostituire dopo l'individuazione delle cartelle reali)

```powershell
.\Inventario-Sito.ps1 -Sorgente 'C:\PERCORSO\SITO' -Confronto 'C:\PERCORSO\COPIA' -DestinazioneReport 'C:\PERCORSO\AUDIT'
```

## Verifiche necessarie prima dell'uso

1. Individuare le directory effettive del sito, delle copie e dei documenti locali.
2. Confermare la versione PowerShell (5.1 o superiore) e la disponibilità dei permessi di sola lettura.
3. Eseguire un collaudo su cartelle di prova piccole, poi validare i risultati con un confronto manuale.
4. Evitare cartelle contenenti segreti, credenziali o dati personali non necessari al sito.
5. Esaminare i rapporti prima di pianificare eventuali operazioni di modifica.

## Architettura concordata

GitHub conserva il codice del sito; Google Drive conserva i documenti di ricerca; il PC è sede di materiali e copie locali. La sincronizzazione fra queste tre fonti deve essere esplicita, verificabile e reversibile. L'automazione futura richiederà una revisione separata e approvazione prima di abilitare qualsiasi scrittura sui sorgenti.

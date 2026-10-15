# Collaudo del modulo di qualità di Elena — 16 ottobre 2026

## Ambiente isolato
Macchina `Michele`, Windows PowerShell 7.6.6, Ollama locale `qwen3:8b`.
Copia di collaudo: `Documents/Sito_Autore_Audit_20261015/Analizza-ADC-Qualita-COLLAUDO.ps1`, riprodotta sul ramo in `audit/powershell/`.
La copia legge `ElenaUnica/DatiElena/SitoADC/Contesto_Sito_ADC.txt` senza modificarlo, ma salva rapporti e registri nella cartella di audit. Il modulo attivo `Analizza-ADC-Qualita.ps1`, il task di acquisizione e il sito non sono stati modificati.

## Test e risultati effettivi
1. **Versione di collaudo iniziale, 1 pagina (00:28)**: il modello ha restituito un rilievo formalmente valido sulla pretesa di indipendenza dell'ADC, usando come fonte **la stessa pagina ADC**. Il sistema lo ha accettato: falso positivo editoriale. Una citazione letterale non costituisce prova indipendente.
2. **Correzione isolata**: aggiornato il prompt per escludere dubbi generici su dichiarazioni già presenti e aggiunto un filtro deterministico che respinge le fonti autoreferenziali appartenenti al dominio `michelebottino-autor.github.io`. La correzione non autorizza nessun dato storico come verificato.
3. **Ripetizione su 1 pagina (00:31)**: pagina introduttiva ADC, **0 rilievi**, **0 risposte respinte**, **0 errori strutturali**; esito `NESSUN RILIEVO SPECIFICO`.
4. **Ripetizione su 2 pagine (00:32)**: pagina ADC introduttiva, **0 rilievi**; dossier `adc/acque-mulini-confini/`, **1 rilievo formalmente accettato** e 0 errori strutturali. La proposta richiede di verificare Archivio di Stato di Palermo e Salvatore Cusa, ma il dossier già esplicita la necessità di collazione delle fonti: **possibile duplicazione editoriale, NON incongruenza dimostrata**.

## Conclusioni
- Rilevato e corretto **nella sola copia di collaudo** il difetto delle fonti autoreferenziali.
- Il filtro evita il falso positivo specifico della pagina iniziale nei test effettuati.
- Restano possibili ripetizioni di cautela metodologica già dichiarata nel dossier; servono confronto con il testo integrale, registro di ricerche già eseguite e revisione umana. Il modulo `Analizza-ADC-Critico141.ps1` prevede già distinzioni migliori fra **nessun rilievo**, approfondimento e possibile incongruenza: evitare di duplicarne l'architettura.
- Non integrare ancora il candidato nell'acquisizione programmata, non sostituire moduli esistenti, non pubblicare proposte.
- Output e backup conservati nel percorso locale di audit: `Proposte_Elena_Qualita_Collaudo.md` e `Verifica_Qualita_Collaudo_20261016_*.json`.

**Stato:** miglioramento tecnico riprodotto, idoneità editoriale per l'integrazione **NON ancora accertata**.

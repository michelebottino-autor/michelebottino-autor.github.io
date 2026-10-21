# Processo 334 — Protocollo operativo HTR Cervello / Elena

Versione 1.0 · 21 ottobre 2026. Stato: **specifica operativa, modello non addestrato**.

## Identificazione e integrità
- Unico identificativo canonico del corpus: `ADC-PROCESSO-334`.
- `P184`, `PROCESSO_184` e varianti sono **alias storici errati** nelle copie di lavoro; non identificano un secondo fascicolo verificato.
- Conservare master e metadati d'acquisizione immutabili. Associare a ogni derivato `source_sha256`, dimensioni del master, coordinate, versione e identificativo stabile.
- Il valore SHA-256 registrato per la scansione di lavoro C003 è `AB6E7045006304204DEF3AEB8548225805DF41010374D50AA70D43FEEB123D40`, riscontrato sul file esaminato il 21/10/2026.

## Catena di lettura
1. Segmentare la pagina in aree, righe e poligoni, controllando manualmente l'ordine di lettura.
2. Annotare ogni riga con immagine/coordinate e proposta **diplomatica**, rispettando l'ortografia e le abbreviazioni del testimone.
3. Registrare, separatamente, lo scioglimento editoriale delle abbreviazioni e le alternative; non introdurle surrettiziamente nel testo diplomatico.
4. Distinguere `verificata`, `probabile`, `indecifrata` per ogni token, con motivazione e rimando grafico. La confidenza del modello da sola non equivale a verifica.
5. Aggiungere normalizzazione, traduzione italiana e interpretazione giuridica **solo** dopo la verifica diplomatica. Segnalare lacune, cancellature, interlinee e incertezze.
6. Indicizzare nel Cervello esclusivamente attestazioni con provenienza e stato; Elena deve indicare `non attestato` o `lettura incerta` quando non esiste riscontro.

## Insegnamento specialistico
- Formare un repertorio separato per **allografi** (varianti delle lettere), legature, segni abbreviativi, formule di cancelleria, titoli, antroponimi, toponimi e lessico feudale/notarile.
- Distinguere lingua, datazione e mano scrivente. Non presupporre che l'intero fascicolo impieghi un'unica mano o una sola lingua.
- Per ogni esempio conservare immagine/coordinate, trascrizione approvata e autore della verifica.
- Creare un insieme di prova **mai usato per l'addestramento**, preferibilmente separato per carte/mano, e misurare CER e WER; archiviare gli errori per tipologia.
- Con poche righe non dichiarare un modello addestrato: utilizzare anzitutto confronto paleografico e ipotesi controllate. In seguito valutare fine-tuning di un modello compatibile.

## Architettura
- **Cervello locale:** ingestione dei master, segmentazione, HTR, apparato delle varianti, valutazione dei risultati e memoria delle correzioni approvate.
- **Elena pubblica:** accesso in sola lettura alle attestazioni validate e a una sintesi dello stato di avanzamento; non pubblicare trascrizioni speculative come documenti certi.
- Esportare il corpus in PAGE XML / ALTO per l'HTR e TEI-XML per l'edizione critica, quando i dati siano pronti.
- Niente pubblicazione automatica delle trascrizioni prodotte dal modello.

## Riferimenti tecnici
- eScriptorium: https://escriptorium.readthedocs.io/en/latest/train/
- Kraken: https://kraken.re/6.0.0/tutorials/training.html
- Guida della biblioteca universitaria di Mannheim: https://ub-mannheim.github.io/eScriptorium_Dokumentation/Training-with-eScriptorium-EN.html

**Limite:** questo protocollo non costituisce installazione, fine-tuning, lettura paleografica completa o collaudo del backend Cervello.

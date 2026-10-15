# ADC — Registro collaudo pre-pubblicazione (15 ottobre 2026)

## Verifiche statiche effettuate
- 33/33 pagine HTML del percorso adc/ hanno il collegamento al design-system.css con risoluzione relativa corretta.
- Otto sezioni principali includono sezioni-2026.css; in tutte è presente una sola chiusura head e una sola apertura main.
- Homepage: eliminata la visualizzazione duplicata dell'intestazione legacy; skip link collegato all'inizio del nuovo layout.
- Homepage: tutti gli anchor href #... hanno ID corrispondente.
- Homepage: controllo dei riferimenti locali href/src contro l'albero del repository originale: nessuna risorsa mancante; eccezioni previste: design-system.css (aggiunto solo nel ramo design) e ../ (radice del sito).
- Le immagini usate nel layout provengono da risorse già nel repository; non sono prova documentaria di specifici eventi storici.

## Controlli non ancora effettuati / blocchi alla pubblicazione
- Render visivo effettivo a 320, 375, 768, 1280 e 1920 px.
- Prove con browser reale di menu, moduli, ricerca, filtri, tastiera e dispositivi mobili.
- Confronto visivo della homepage con la bozza approvata: il panorama fotografico richiesto non è ancora riprodotto fedelmente.
- Controllo integrità del backup ZIP indipendente dal repository (esiste il ramo di ripristino GitHub).
- Revisione finale della correttezza storica dei richiami 1201, 1213, 1282 e 1537: non dichiarare collazioni documentarie non svolte.

## Stato distribuzione
- Modifiche solo su design/adc-modernizzazione-2026-10-15.
- Nessun merge in main eseguito in questa fase.
- Non dichiarare pubblicazione completata fino a verifica GitHub Pages.

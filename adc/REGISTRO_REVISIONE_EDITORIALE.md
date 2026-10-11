# Registro di revisione editoriale ADC — 11 ottobre 2026

Documento di lavoro nel repository; non è un nuovo dossier storico. Base: file HTML effettivamente letti sul ramo principale di GitHub.

## Perimetro verificato
14 pagine: adc/index.html; adc/acque-mulini-confini/index.html; adc/carta/index.html; adc/contribuisci/index.html; adc/dossier-1213-1537/index.html; adc/dossier-rationes/index.html; adc/dossier-zucchero/index.html; adc/gioco/index.html; adc/opere-pubbliche-1860-1866/index.html; adc/ponte-alcantara-medievale/index.html; adc/processo-334/index.html; adc/programma/index.html; adc/storia/index.html; adc/terremoto-1818/index.html.

## Regola di non duplicazione
- Castello e vendita 1213: dossier-1213-1537 è il riferimento di approfondimento; index e storia sono sintesi con rimando.
- Rationes e chiese medievali: dossier-rationes è il riferimento.
- Zucchero e Cruïlles/Mirulla: dossier-zucchero è il riferimento; distinguere il documento del 1537 trattato anche nel dossier 1213-1537.
- Acque e mulini 1101–1245: acque-mulini-confini è il riferimento. Panagia ≠ Alcantara senza prova; San Marco Val Demenna ≠ San Marco Calatabiano senza prova.
- Ponte Alcantara: ponte-alcantara-medievale è il riferimento; al-Idrisi, interpretazioni archeologiche e 1943 sono livelli diversi.
- Terremoto 1818: terremoto-1818 è il riferimento, ma le carte originali non risultano esaminate.
- Opere pubbliche 1860–1866: opere-pubbliche-1860-1866 è scheda di reperimento, non prova di lavori effettuati.
- Processo 334: diario di lettura, non trascrizione definitiva.
- Programma, Carta, Storia e Gioco: non devono introdurre nuove affermazioni storiche non tracciate nei dossier.

## Controlli eseguiti
- Inventario directory ADC tramite API GitHub.
- Lettura dei 14 file HTML, titoli e intestazioni.
- Estrazione dei collegamenti interni e delle ancore presenti; nessun collegamento letterale href="#" rilevato.
- Le ancore locali usate dai link della homepage sono presenti nel file index.html.

## Controlli ancora da svolgere
- Validazione HTML/CSS/JS completa e verifica in browser.
- Risoluzione HTTP di tutti i collegamenti esterni, inclusi PDF storici.
- Controllo filologico puntuale di ogni citazione, pagina e segnatura.
- Confronto tra repository e sito effettivamente distribuito da GitHub Pages.
- Censimento degli altri file fuori da adc/ (homepage autore, robots, sitemap, metadati).
- Correzione dell'eventuale ripetizione testuale solo dopo confronto integrale fra paragrafi.

## Principio operativo
Prima di pubblicare: cercare la notizia nelle 14 pagine; identificare la fonte primaria o secondaria; indicare il livello di consultazione; aggiungere solo informazione nuova; non trasformare ipotesi in fatti. Ogni revisione deve essere tracciata con commit.

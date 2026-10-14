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

## Correzione tecnica completata
- 11 ottobre 2026: sitemap.xml integrata con 11 pagine ADC esistenti che mancavano dall'elenco. Le altre 3 erano già presenti. Commit `644635e05e33520e0bd970292c1747134c800d7c`. Il file XML aggiornato non certifica da solo la corretta distribuzione su GitHub Pages né l'indicizzazione.

## Chiusura del ciclo di consolidamento — 14 ottobre 2026

**Perimetro chiuso:** integrazione Inventario–Atlante e controlli statici del catalogo. Questa chiusura non costituisce certificazione complessiva del sito né verifica filologica degli originali.

- Inventario: 18 record (`ADC-0001`–`ADC-0018`), 10 classificati B e 8 C; nessun ID duplicato o campo obbligatorio vuoto nel controllo strutturale.
- I sette percorsi distinti ai dossier indicati dai record esistono nel ramo principale del repository.
- Atlante: 17 collegamenti diretti alle schede originarie dell'Inventario, tutti con ID esistenti; la testimonianza ADC-0018 mantiene il collegamento al dossier sul crocifisso.
- Inventario: introdotte ancore stabili e richiesta di scorrimento dopo il caricamento JSON; reso visibile il livello documentario già presente nei dati.
- Commit del ciclo: `9ee85d21`, `dbd1c321`, `22440d5d`, `65bdb22d`, `14cb5a2f`, `362f8c75`.

**Questioni non certificate e mantenute aperte:** distribuzione GitHub Pages e test in browser/mobile; verifica HTTP di link esterni e PDF; accessibilità; corrispondenza delle citazioni con originali o riproduzioni; attribuzione delle classificazioni B; inventario n. 47 (opere pubbliche 1860–1866) senza esame dei fascicoli; dossier 1922–1943 con fonti eterogenee da separare; revisione complessiva delle pagine dell'autore e dei metadati SEO.

**Regola per la riapertura:** non duplicare i dossier; aprire un nuovo intervento solo con un riferimento controllabile, una discrepanza tecnica riproducibile o una fonte nuova. Evitare la dicitura «audit generale completato» finché i controlli sopra elencati non siano stati effettuati.

## Controllo sitemap–repository — 14 ottobre 2026

Controllo statico concluso su `sitemap.xml` (67 URL univoci). I percorsi sono stati normalizzati come file GitHub (`/` → `index.html`, directory con slash finale → `index.html`, file `.html` invariati). La ricerca dei file ha confermato 37 percorsi; i restanti 30 sono stati controllati direttamente tramite lettura del file nel repository. **Risultato: 67/67 percorsi presenti, 0 mancanti, 0 URL duplicati.**

Questo esito non certifica la risposta HTTP di GitHub Pages, l'indicizzazione nei motori di ricerca, l'assenza di errori JavaScript, la resa mobile, la validità dei collegamenti esterni o l'accuratezza storico-documentaria. Non sono state apportate modifiche ai contenuti del sito durante questo controllo.

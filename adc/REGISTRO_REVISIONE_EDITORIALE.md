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

## Ricognizione web su novità documentarie — 14 ottobre 2026

Ricerca mirata su portali istituzionali e fonti scientifiche, con confronto preliminare con i dossier già pubblicati. **Piste registrate, non automaticamente integrate nei testi storici:**

1. **Castello medievale di Calatabiano, valorizzazione 2026:** avviso del Dipartimento regionale dei Beni culturali del 18 giugno 2026; proroga pubblicata il 29 luglio, scadenza 9 ottobre 2026. Fonte: https://www.regione.sicilia.it/istituzioni/servizi-informativi/bandi/avviso-pubblico-invito-alla-manifestazione-interesse-gestione-concessione-castello-medievale-calatabiano-ct . La documentazione prova l'avvio della procedura, **non** l'affidamento o la riapertura effettiva; nessun esito successivo verificato in questa ricognizione. Da valutare in sezione contemporanea, non nel dossier storico del 1213.
2. **Archivio di Stato di Catania, pergamene ex copertine notarili:** scheda ministeriale aggiornata 11 maggio 2026, con restauro e progetti 2026: https://cultura.gov.it/luogo/archivio-di-stato-di-catania-pergamene-ex-copertine-di-volumi-notarili . Non documenta, da sola, pergamene pertinenti a Calatabiano.
3. **Portale ICAR Archivio Digitale:** scheda istituzionale aggiornata 15 maggio 2026: https://icar.cultura.gov.it/sistemi-e-portali/sistemi-legacy/archivio-digitale . Ricerca libera su pergamene, atti notarili, cartografia; **non è stata identificata una nuova unità digitalizzata pertinente a Calatabiano**.
4. **Salvo d'Antonio, croce del 1502:** tesi di Giuseppe Fazio reperibile nel repository dell'Università di Padova: https://www.research.unipd.it/retrieve/e14fb26f-b7d5-3de1-e053-1705fe0ac030/fazio_giuseppe_tesi.pdf . Il testo tratta la commissione del 24 ottobre 1502 e l'attribuzione stilistica; è fonte scientifica secondaria aggiuntiva, non il protocollo notarile originale. Controllare dati bibliografici e pagine prima di citarla nel dossier; assente nella pagina ADC esaminata.

**Esito editoriale:** non aggiungere schede Inventario o affermazioni storiche finché le nuove piste non siano collazionate con le fonti già note. Ricerca web e controllo del repository sono attività distinte dalla consultazione degli originali.

## Esito collazione web mirata — 14 ottobre 2026

- Consultato il testo PDF della tesi di Giuseppe Fazio (Università di Padova): menziona esplicitamente la croce della chiesa madre di Calatabiano commissionata a Salvo d'Antonio il 24 ottobre 1502, scheda di catalogo IV.38, e ne discute l'interpretazione stilistica. Inserito riferimento bibliografico nel dossier `adc/crocifisso-1502/index.html`, senza mutare attribuzioni, dati notarili o livello probatorio. Commit `1ab4add7cc779e1617a68c9ccda930eca0c3e8f5`.
- Consultati gli avvisi della Regione Siciliana sulla concessione del Castello medievale: avviso 18 giugno 2026 e proroga 29 luglio 2026, termine 9 ottobre 2026. Nessun atto di affidamento successivo identificato nei risultati istituzionali esaminati alla data della ricognizione. Non scrivere che la concessione è stata assegnata.
- Non creare ulteriori record nell'Inventario in assenza di una nuova testimonianza documentaria distinta. Verifica in browser e delle fonti primarie ancora aperta.


## Verifica incrociata Atlante–Inventario–cartografia — 14 ottobre 2026

- Confermata nel repository la scheda `adc/atlante/mortillaro-113/index.html`, con attribuzione della mappa n. 113 al repertorio CRICD e distinzione tra fonte catalografica e originale non esaminato.
- Inventario `adc/inventario/testimonianze.json`: 18 record, identificativi ADC-0001–ADC-0018. La mappa Mortillaro non è stata aggiunta come diciannovesima testimonianza in assenza di una nuova scheda documentaria controllata.
- Verificati i collegamenti della scheda Mortillaro all'Atlante e all'Inventario; restano distinti i dossier medievali su acque, mulini e ponte, senza dedurre identità geografiche dalle carte ottocentesche.
- La sitemap comprende il percorso della mappa n. 113. Tentata l'apertura pubblica della pagina e della sitemap il 14 ottobre 2026: il servizio di consultazione non ha restituito le risorse. Non è quindi certificata la risposta HTTP del sito pubblico.
- L'immagine del repertorio CRICD non è riprodotta sul sito: condizioni di riutilizzo della singola riproduzione digitale non accertate in modo conclusivo.

**Esito:** nessuna discrepanza tale da giustificare modifiche ai dati storici o ai livelli documentari. Restano aperte verifica HTTP/browser, verifica puntuale delle fonti originali e disciplina di riuso dell'immagine.


## Audit di consolidamento — 14 ottobre 2026

**Ambito:** confronto fra il bilancio critico del 12 ottobre, il piano della seconda edizione, il registro editoriale corrente e le pagine ADC consultate dal repository. Non è un'autopsia delle pergamene né un audit completo di tutte le pagine del sito. Le registrazioni seguenti non costituiscono nuovi documenti storici e non incrementano l'inventario delle testimonianze.

| ID controllo | Affermazione / nodo | Testimonianza già individuata | Livello di prova attuale | Pagina o sezione da confrontare | Esito e prossima azione |
| --- | --- | --- | --- | --- | --- |
| AUD-20261014-01 | Titolo giuridico su castello/terra di Calatabiano nel 1201 | MGH DD F II.1, n. 33, pp. 67–70; regesto Aracne 69; Spinella, nota 93 | Edizione identificata; dispositio non collazionata; divergenza «castello»/«terra» | adc/index.html; adc/dossier-1213-1537/ | **Aperto**. Leggere testo integrale MGH; non equiparare le formulazioni dei regesti. |
| AUD-20261014-02 | Diritti catanesi del 1213 | Rinvio presente nel dossier; atto integrale non collazionato nel bilancio | Citazione indiretta | adc/dossier-1213-1537/; adc/index.html | **Aperto**. Identificare e leggere l'atto; distinguere soggetto, bene e titolo. |
| AUD-20261014-03 | Restituzione e diritti nel 1282 | ADM perg. 1034; Spinella, pp. 72–74; Starrabba 1888, pp. 109–126 | Passi letti in tesi, originale non letto | adc/dossier-1213-1537/; adc/storia/ | **Parziale**. Collazionare Starrabba e pergamena; distinguere castello da giardino e sentenze del 1267. |
| AUD-20261014-04 | Passaggi feudali Cruïlles–Gaetani–Mirulla | Repertorio dei processi d'investitura 184 (b. 1484) e 334 (b. 1485) | Repertorio, non integrale collazione delle carte | adc/processo-334/; adc/dossier-zucchero/ | **Parziale**. Controllare singoli atti e date; non confondere estremi cronologici dei processi con data di vendita. |
| AUD-20261014-05 | Diritti su acque, mulini e Gullia | Tabulario di Fragalà/Maniace, perg. 7, 11, 24, 25, 28, 63; Cusa e Silvestri | Regesti ed edizioni; autopsia non completata | adc/acque-mulini-confini/ | **Parziale**. Collazione visiva; evitare identificazione automatica Gullia=Calatabiano e Panagia=Alcantara. |
| AUD-20261014-06 | Produzione e commercio dello zucchero | Morreale 2020, ASP TRP Scritture pendenti vol. 13; Stracuzzi, ASM Notarile vol. 15 ff. 330–332 (1537) | Fonti secondarie con segnature | adc/dossier-zucchero/; adc/economia-storica/ | **Parziale**. Consultare atti; non convertire 16.000 caselle in ettari né quantificare produzione senza riscontro. |
| AUD-20261014-07 | Rotazione riso–frumento–canapa dal 1683 | Sergio Caia con rinvio a Silvana Cassar; sintesi universitaria | Testimonianza storiografica indiretta; data non verificata in Cassar | adc/economia-storica/ | **Aperto**. Controllare opera originale e localizzazione; non presentare 1683 come data primaria certa. |
| AUD-20261014-08 | Agrumi, vite, olivo e attività tessili nell'Ottocento | Sintesi storico-divulgativa comunale | Fonte locale secondaria, senza superfici | adc/economia-storica/ | **Aperto**. Verificare catasti di Giarre e censimenti ISTAT comunali. |
| AUD-20261014-09 | Postilla 1239, epigrafe, formule latine e pratiche cultuali | Asserzioni nel master di Calatabiano Sacra; nessuna segnatura originale dimostrata nel piano | Non verificato | Libro, eventuali pagine religiose ADC | **Critico**. Non presentare come citazioni documentarie finché non siano identificate e lette le fonti. |
| AUD-20261014-10 | V12 e V33 come fonti utilizzabili | Bilancio critico 12 ottobre: V12 377 record da validare; V33 controllo testuale parziale | Strumenti di lavoro, non fonti primarie | Pipeline interna, non pagine divulgative | **Aperto**. Conservare registri; eseguire controllo visivo, non promuovere output automatici a prove. |

### Decisioni operative
1. **Sospendere nuovi dossier e nuove asserzioni storiche pubbliche** fino al controllo delle fonti corrispondenti; preservare il contenuto attuale, annotando internamente le riserve.
2. Non creare nuovi identificativi ADC di testimonianza per riferimenti già censiti. Gli ID `AUD-` identificano esclusivamente controlli editoriali.
3. Aprire la collazione dalla sequenza **1201 → 1213 → 1282**; a seguire investiture, pergamene, zucchero e colture.
4. Per ogni verifica chiusa annotare: citazione letterale, archivio/fondo/segnatura, immagine o edizione effettivamente letta, pagina o carta, stato, URL pubblico coinvolto e correzione eventuale.
5. Non dichiarare certificata la corrispondenza integrale sito/fonti fino alla lettura di tutte le pagine interessate.

**Materiali di confronto:** `BILANCIO_CRITICO_E_PIANO_RIPRESA_CALATABIANO_2026-10-12.md`; `Calatabiano Sacra — Piano di ricerca, revisione documentaria e produzione della seconda edizione`; `adc/LINEE-GUIDA-EDITORIALI.md`. Le verifiche sui file pubblici eseguite in questa sessione hanno incluso `adc/index.html`, `adc/acque-mulini-confini/index.html` e `adc/dossier-zucchero/index.html`, oltre al registro stesso.


### Verifica mirata AUD-20261014-01 — riscontro delle fonti online (14 ottobre 2026)
- **Aracne 69, arenga 028**: confermati data giugno 1201, luogo Palermo, destinatari arcivescovo Berardo e Chiesa di Messina, regesto sulla cessione del castello, riferimento MGH DD F II.1 n. 33 p. 67 e incipit `Etsi divine maiestatis intuitu`. URL: https://www.detail-lod.it/documents/ara69.arenga_028 . Il testo latino pubblicato in questa scheda è l'**arenga**, non l'intera dispositio; il regesto non è una trascrizione diplomatica.
- **Spinella, tesi dottorale, p. 73, nota 223**: la nota descrive espressamente il diploma come concessione del `castrum` di Calatabiano, citando MGH n. 33 pp. 67–70; nota 224 segnala ADM perg. 1034 per il 1282. PDF: https://www.iris.unict.it/retrieve/9652da58-4762-45e9-8290-66def0caed02/BMRSpinella_TesiDottorato.pdf . La formulazione `terra` attribuita alla nota 93 nel bilancio precedente deve essere verificata nel suo contesto, non usata per sostenere una contraddizione generalizzata con Spinella.
- **MGH**: identificato il volume digitale DD F II.1: https://www.dmgh.de/resolving/diplomataD_F_II_91 . L'accesso al testo integrale tramite il browser di ricerca ha restituito errore; **non effettuata la collazione delle pp. 67–70**.
- **Stato**: metadati del 1201 riconfermati; un precedente rilievo di divergenza terminologica richiede contestualizzazione; contenuto giuridico del dispositivo e confronto con 1213/1282 **ancora aperti**. Nessuna correzione assertiva alle pagine pubbliche.


### Controllo testuale AUD-20261014-02 — confronto tra dossier 1213 e pagina «Storia»
- **File correnti letti nel repository:** `adc/dossier-1213-1537/index.html` (SHA `b63f0839c68a932f2b928ccef018ca2228e01001`) e `adc/storia/index.html` (SHA `1af7edbfedfb74d22d1c9d9b4c63446fc6d74cab`).
- Entrambi presentano il **1213** come notizia attribuita a studi storici, non come risultato di lettura diretta dell'atto. Il dossier richiama Antonio Mursia (tesi 2023–2024, p. 103) e Francesco Muciaccia; la pagina «Storia» rimanda al dossier e dichiara il limite della consultazione. **Esito: coerenza editoriale su questo punto; nessuna correzione pubblica necessaria ora.**
- La cifra di **15.000 tarì** e la vendita attribuita ad **Armaleo Monaldeschi** sono informazioni **storiografiche**, non verifiche diplomatiche dell'atto. Non promuoverle a dato di prima mano; controllare il documento o l'edizione e la relativa catena di citazioni.
- La verifica delle pagine non risolve la compatibilità dei titoli del 1201 e 1213. È necessario controllare l'oggetto e la natura giuridica di ciascuna concessione/alienazione, non assumere un trasferimento lineare fra le due Chiese.
- **Stato:** controllo di coerenza delle due pagine **chiuso**; verifica storica dell'atto del 1213 **aperta**. Non sono state modificate pagine pubbliche né l'inventario.


## Audit tecnico del sito — 14 ottobre 2026 (prima passata)
**Fonte di verità:** repository GitHub corrente, non `michelebottino_site_integrato.zip` (copia storica).

- `index.html`: lingua `it`, descrizione SEO e manifest presenti; non è ancora un collaudo completo di HTML, prestazioni, accessibilità o dati strutturati.
- `sitemap.xml`: 69 URL `loc` esaminati, nessun duplicato testuale; contiene le principali pagine ADC incluse `economia-storica`, `atlante`, `inventario`. **Da verificare** che ogni URL risponda HTTP 200 e abbia canonical coerente; il conteggio non dimostra copertura integrale del repository.
- `robots.txt`: permette scansione pubblica e segnala la sitemap; include `Disallow` per alcuni file di lavoro. **Attenzione:** robots.txt non è una misura di riservatezza; file interni in un repository pubblico rimangono accessibili. Non pubblicare dati sensibili o materiali non autorizzati.
- `404.html`: assente all'inizio del controllo, **creato** con contenuto italiano, navigazione verso sezioni principali, `noindex,follow`, collegamenti accessibili. Commit `ae54233f94dc8853dae1a11b32c1229c2c956b6e`.
- `adc/index.html`, `adc/economia-storica/index.html`: canonical presente. Necessari ulteriori controlli sistematici su collegamenti interni, immagini, alt, header, responsive, script e validazione HTML.
- **Limitazioni:** nessun test HTTP live completo o scansione automatizzata di tutte le pagine eseguito in questa passata; non dichiarare il sito «certificato». Nessuna modifica ai dati storici o alla pipeline V12.

### Coda tecnica di correzione
1. Esportare l'albero completo del repository corrente e costruire un elenco di URL e risorse locali.
2. Controllare tutti i collegamenti interni e le risorse `src`, distinguendo ancore, percorsi assoluti e relativi.
3. Confrontare sitemap, canonical e `robots` con gli URL realmente pubblicati.
4. Validare markup HTML, accessibilità tastiera, etichette, immagini e contrasto su mobile e desktop.
5. Testare funzionamento di ricerca ADC, moduli, manifest, CSS/JS e percorsi multilingue.
6. Esaminare eventuali file interni pubblicamente accessibili e le politiche di gestione delle informazioni.
7. Applicare correzioni puntuali con test e commit tracciati; nessuna riscrittura massiva senza necessità.

## Revisione conservativa intersezionale — 21 ottobre 2026

**Base del controllo:** albero GitHub `main` all'avvio della sessione, commit `319f044ee43c29878d70175c632b19d1c501bf1e`. Gli allegati ZIP di precedenti sessioni non sono stati ripubblicati. Le modifiche di questo ciclo sono preparate sul ramo `revisione-editoriale-2026-10-21`, in attesa di revisione e integrazione.

### Verifiche statiche effettuate

- Inventariati 579 elementi del repository, di cui 141 file HTML (incluso il file di verifica Google). Controllati gli attributi `href` e `src` dei 141 HTML rispetto ai percorsi presenti nell'albero GitHub: **nessun file locale mancante** nella normalizzazione dei link relativi e assoluti; non sono state controllate risposte HTTP dei server.
- `sitemap.xml`: 122 URL `loc` distinti; nessun duplicato e nessun percorso assente dall'albero GitHub. Questo non prova che tutte le pagine del repository siano destinate a essere indicizzate.
- Nelle pagine di contenuto esaminate non sono emersi duplicati letterali dell'attributo `id` o tag `img` senza attributo `alt` nella scansione lessicale. I file di protezione delle directory `images/` e il widget ADC compatto non sono articoli e non richiedono automaticamente un `h1`.
- Confrontate quattro coppie tematiche tra `articoli/` e `strutture-irrisolto/`. Angela Celentano: forte duplicazione del testo; le altre tre coppie (Cristina Golinucci, Denise Pipitone, Jack lo Squartatore) contengono trattazioni autonome a livello del confronto lessicale eseguito.

### Correzioni proposte in questo ciclo

1. `strutture-irrisolto/angela-celentano/index.html`: sostituito il duplicato dell'articolo con una trattazione metodologica distinta, senza aggiungere nuove attestazioni storiche o investigative; rimosso un rimando a se stessa; raccordo all'articolo principale, canonical e JSON-LD coerenti con la nuova pagina, SEO, descrizione dell'immagine e stile del sottotitolo aggiornati. L'articolo originale resta immutato.
2. `adc/acque-mulini-confini/index.html`: riscritta una frase di registro operativo in forma di limite della fonte consultata; nessun cambiamento di contenuto storico.

### Esclusioni e limiti

- Nessun dossier storico, fonte originale, registrazione dell'Inventario o risposta certificata di Elena è stato alterato.
- Il controllo dei link è lessicale e di presenza nel repository: non valida le ancore `#id`, l'esecuzione dei file JavaScript, le API esterne o il comportamento degli URL sul server.
- Non sono stati eseguiti in questa sessione test in browser mobile/desktop, validazione HTML con parser standard, test WCAG, test dei moduli, verifica dei collegamenti esterni, né controllo diplomatico delle fonti.
- Mantenere distinte le verifiche tecniche dall'audit scientifico; non dichiarare conclusa la revisione editoriale dell'intero corpus sulla base della sola scansione strutturale.

## Coerenza tra homepage, sezioni d’autore e dossier ADC — 21 ottobre 2026

### Fonti interne della revisione

Confrontati direttamente sul ramo di revisione: `index.html`, `biografia/index.html`, `opere/index.html`, `poetica/index.html`, `metodo/index.html`, `ricerca/index.html`, `pubblicazioni-ricerca/index.html`, `adc/index.html`, `adc/storia/index.html`, `adc/fonti/index.html`, `adc/carta/index.html`, `adc/programma/index.html`, `adc/dossier-1213-1537/index.html`, `adc/dossier-zucchero/index.html`, `adc/dossier-rationes/index.html`, `adc/processo-334/index.html`, `adc/archivio-gravina-cruillas/index.html`, `formazione/index.html`, `catalogo/index.html`, `corso/index.html`.

Sono state mantenute le distinzioni già previste dalla Carta: l'ADC è il progetto culturale indipendente; il Laboratorio ne è l'ambito di ricerca e divulgazione. Le sintesi in Storia e homepage ADC rimandano ai dossier senza doverne riprodurre integralmente le note: non sono state eliminate come falsi duplicati.

### Incongruenze riprodotte e corrette nel ramo di proposta

1. **Galleria delle opere nella homepage:** tutti gli 8 pulsanti «Scheda dell’opera» rimandavano genericamente a `opere/`, senza selezionare il titolo. Sostituiti con 8 URL `opere/#opera-...` specifici.
2. **Galleria nella pagina Opere:** gli 8 collegamenti «Scheda dell’opera» puntavano alla stessa pagina corrente. Inseriti 8 attributi `id` distinti sulle rispettive schede bibliografiche già presenti; i pulsanti ora puntano all'ancora corretta. Non aggiunte né riscritte schede, titoli o ISBN.
3. **Breadcrumb Ricerca:** `Home › Michele Bottino` indicava l'autore invece della sezione. Corretto in `Home › Ricerca`.
4. **Breadcrumb Metodo:** `Home › Metodo – Michele Bottino` non seguiva la denominazione sintetica adottata per le altre sezioni. Corretto in `Home › Metodo`.
5. **Collegamento contestuale in Storia ADC:** il link etichettato genericamente «Diario di ricerca», già diretto a `adc/processo-334/`, ora è etichettato «Diario del processo 334». Nessuna modifica al diario né alle attestazioni.

### Risultato dei controlli

- 8 corrispondenze tra galleria homepage, galleria catalogo e 8 `id` bibliografici: **PASS**, 0 destinazioni assenti.
- 10 pagine direttamente coinvolte o usate come confronto: un solo `h1`, nessun `img` privo di `alt` e nessun `id` duplicato nel controllo statico.
- `main` e i dossier originari rimangono invariati durante questa proposta. Nessuna modifica al corpus certificato di Elena, alle scansioni, alle fonti, ai file dei corsi o alle schede di ricerca.

### Limiti di certificazione

Test dei frammenti e delle etichette effettuati sul codice HTML del ramo: non sostituiscono una verifica in browser/mobile, il controllo HTTP della distribuzione, l'accessibilità completa o una collazione scientifica. Nessuna pubblicazione definitiva è implicita finché la proposta GitHub non viene integrata.

## Revisione dedicata all’ADC — 21 ottobre 2026

**Base del controllo:** `main` a SHA `4c357de6f57adff7dcd21c197c3066af47abb6a6`. La revisione è stata eseguita sulla copia di lavoro temporanea del repository corrente e preparata nel ramo `revisione-adc-editoriale-2026-10-21`.

### Inventario della revisione

- **42 pagine HTML ADC** lette nella ricognizione statica; controllati collegamenti locali e frammenti, titoli principali, identificatori, attributi `alt`, canonical e paragrafi lunghi. Non sono state individuate duplicazioni letterali di paragrafi di almeno 150 caratteri fra pagine differenti.
- **17 rinvii dell’Atlante** all’Inventario, inizialmente non presenti nell’HTML statico, sono **validi**: l’Inventario li genera in JavaScript da `adc/inventario/testimonianze.json`, che contiene 18 schede con identificatori univoci. Non rimuovere questi frammenti.
- **39 delle 42 pagine ADC** compaiono nella sitemap; le tre eccezioni sono il modulo di invio e due widget incorporabili, non pagine editoriali.
- Nessuna anomalia strutturale confermata tale da giustificare una riscrittura massiva dei dossier o dell’Inventario. Le questioni di collazione delle fonti storiche restano distinte dalla correzione editoriale.

### Difetti dimostrati e interventi

1. `adc/cerca/index.html`: la ricerca interna interrogava 23 pagine, escludendo 11 dossier e percorsi storico-documentari già pubblicati. Aggiunti i 11 percorsi esistenti, per un totale di **34 pagine interrogate**. Restano distinti i 18 record dell’Inventario caricati da JSON. Le pagine di ricerca, invio, assistenza e incorporamento non sono equiparate a dossier storici.
2. `adc/index.html`: corretta la parola corrotta «eredit?», ripristinato il testo «eredità» e sistemati due collegamenti il cui indicatore grafico era stato sostituito erroneamente da «?». Aggiornata la data di revisione della pagina.
3. `adc/fonti/index.html`: corretti due collegamenti alla sezione patrimonio edilizio, con frecce e separatore leggibile; aggiornata la data editoriale.
4. `adc/atlante/index.html`: corretta la forma «Regesti ed edizioni», eliminato il carattere anomalo nel collegamento all’atlante edilizio e allineata un’etichetta dell’indice al titolo effettivo della sezione.
5. `adc/archivio-gravina-cruillas/index.html`: formulato in modo impersonale il limite della consultazione inventariale, senza promuovere i registri ad originali letti; corretto un collegamento e aggiornata la data della revisione.

### Collaudi sul ramo proposto

- Elenco della ricerca: **34 percorsi univoci, 34 file presenti**, 11 nuove inclusioni; array JavaScript conservato nella struttura originale.
- Inventario: 18 identificatori univoci, di cui tutti i 17 richiesti dall’Atlante.
- Nelle cinque pagine corrette: un solo `h1`, nessun `id` duplicato e nessun `img` senza `alt` nel controllo statico.
- Nessuna modifica alle carte storiche, alle schede `testimonianze.json`, alle fonti primarie, alla ricerca archivistica privata, alle attestazioni certificate o al codice del motore di Elena.

### Limiti

Il controllo statico non certifica l’esecuzione JavaScript su tutti i dispositivi, la disponibilità HTTP di siti terzi, il corretto funzionamento di ogni controllo assistivo o la verifica diplomatica delle fonti. Il rapporto registra l’esito delle verifiche effettuate, non una certificazione generale dell’Archivio.

## Collaudo browser ADC — Ricerca mobile e Custode — 21 ottobre 2026

**Base:** sito pubblico dopo PR 21, `main` a `32ad3245a2e82cf56770a97084d141b88bfa984e`. Le modifiche di questo intervento sono state testate nel browser su una copia temporanea del ramo `correzione-adc-mobile-custode-2026-10-21`, senza sovrascrivere i documenti dell'utente o `main`.

### Difetti riscontrati in Chromium

- **Ricerca ADC su schermi piccoli:** con viewport da 320 a 414 px, il box principale aveva una larghezza effettiva di `viewport + 32 px`, perché al `width:100%` si sommavano 16 px di padding per lato in `content-box`; il taglio orizzontale era mascherato dall'`overflow-x:clip`. A 390 px il margine destro misurato arrivava a 422 px. Applicata una sola regola responsiva `@media(max-width:767px){body > main{box-sizing:border-box}}`.
- **Custode:** l'elenco dei testi consultati includeva 18 pagine; restavano esclusi 11 dossier già pubblicati e ricercabili. L'elenco sale a **29**, mantenendo distinte le risposte verificate di Elena e il catalogo delle 18 attestazioni in `testimonianze.json`.
- **Pertinenza del Custode:** query ordinarie come «notai medievali» privilegiavano testimonianze su chiese o ponti che coincidevano soltanto per parole generiche. La correzione aggiunge varianti linguistiche (`medioevo`), esclude parole interrogative comuni (`sappiamo`, `dicono`, `possedeva`), attribuisce più peso al titolo della scheda e richiede almeno due riscontri quando una domanda include più termini significativi, per elencare attestazioni dell'Inventario. La procedura resta deterministica, non genera nuovi fatti.
- **Messaggi della Ricerca e del Custode:** corretta la concordanza fra numero e nome («1 testimonianza», «2 testimonianze»).

### Verifica prima della proposta

- Browser: Chromium headless su Windows, con esecuzione completa degli script; il ramo proposto è stato servito in locale da una copia temporanea, preservando le risorse e i percorsi originali.
- Ricerca: verificati **320, 360, 390, 414, 768 e 1366 px**. Dopo la correzione, `main` e i controlli del modulo rientrano in tutti i viewport, senza regressioni nel conteggio dei risultati per `gravina` (8 pagine).
- Custode: **5/5** domande di controllo con collegamento al dossier specifico atteso: castello 1213, mulini medievali, notai medievali, Gravina-Cruillas e catasto Mortillaro. La prova sul 1213 restituisce ancora la voce pertinente dell'Inventario.
- Nessun errore JavaScript osservato nelle prove dichiarate. La homepage ADC, l'Inventario, l'Atlante, Elena, il Custode e le Fonti erano già stati aperti su desktop/mobile nella fase diagnostica; l'Inventario caricava 18 schede e Elena rispondeva alla domanda sul 1213 con collegamenti documentari. Il test diagnostico non costituisce validazione scientifica dei testi.
- Non toccati `adc/inventario/testimonianze.json`, scansioni, documenti originali, moduli certificati del motore Elena o gli altri dossier storico-documentari.

### Limiti

Questo è un collaudo mirato di layout e comportamento applicativo. Non certifica l'intera accessibilità WCAG, tutti i browser o tutti i possibili quesiti. I rapporti non promuovono fonti indirette a prove originali.


## Stato consolidato e protocollo anti-ripetizione — 9 novembre 2026

**Scopo.** Questo aggiornamento integra il registro editoriale esistente. Non istituisce un secondo archivio, non modifica le fonti storiche e non trasforma controlli statici in collaudi browser.

### Esiti già acquisiti — non ripetere senza una modifica pertinente

| Ambito | Evidenza disponibile | Validità e limiti |
| --- | --- | --- |
| Sitemap ADC | Confronto di 42 percorsi ADC; controllo di unicità delle URL | Valido per la versione esaminata; ripetere soltanto dopo cambi di struttura o sitemap |
| Struttura delle pagine ADC | Verificati titoli, canonical, descrizioni, ID e ancore; controlli immagini alt su campioni dichiarati | Non equivale a una certificazione completa di accessibilità |
| Ricerca ADC | Elenco statico aggiornato da 35 a 42 percorsi; commit `b518f3eb8829e6696e3edfc67b385fc264f621ec` | Copertura del catalogo verificata sul codice, non nuova prova browser |
| Custode | Elenco aggiornato a 37 percorsi, poi sostituito con reindirizzamento verso Elena; commit `2c6dbd2eb5df7b86c79bc5e477ec228aec0d51f6` | Il vecchio motore non è più quello pubblico; non collaudarlo come servizio autonomo |
| Homepage ADC | Collegamenti al Custode sostituiti con Elena; commit `e3ff20cd7d52af4ee1b88bca813ae7fb462ad962` | Controllo statico post-commit positivo |
| Indice Elena | Aggiunte sette sezioni pubblicate; commit `4b87f3f92aa0c5af2e07dd6dc917dc2ab692174e` | Copertura documentaria statica verificata |
| Deduplicazione Elena | 45 voci portate a 42 URL distinti, conservando tag e cautele; commit `c148c4f3824aa1632e75461dbf39c91f8a246401` | Nessuna URL duplicata nel file riletto |
| Risposte approvate Elena | Una risposta approvata, relativa al 1213; confronto di coerenza con il dossier ADC | Non è una nuova collazione della pergamena originale |
| Browser mobile e Custode storico | Collaudo Chromium del 21 ottobre documentato in questo registro | Prova riferita a una versione precedente; non valida automaticamente per Elena unificata |

### Verifiche ancora aperte — non segnare come superate

1. **Elena unificata, browser reale:** caricamento dell'indice e delle risposte approvate, domande campione, gestione errori di rete, collegamenti alle fonti, reindirizzamento da `/adc/custode/` con parametro `q`.
2. **Risposte storiche:** campione con esito atteso e classificazione separata fra risposta approvata, proposta di percorso e assenza di prove. Nessuna risposta nuova senza revisione documentaria.
3. **Voce Elena:** disponibilità dei file audio, avvio/interruzione e comportamento su dispositivi mobili; nessun esito dichiarato in assenza di prova.
4. **Mediateca e navigazione:** verificare soltanto comportamenti non ancora collaudati o componenti modificati dopo l'ultima prova.
5. **Pubblicazione GitHub Pages:** controllare distribuzione e comportamento pubblico dei commit recenti; la presenza del codice nel repository non basta a certificarli.
6. **Copertura dell'intero sito autore:** il presente registro riguarda prevalentemente ADC; pagine editoriali esterne all'ADC, moduli, privacy e altri sottosistemi richiedono un inventario distinto prima di qualsiasi attestazione globale.

### Regola operativa obbligatoria

- Prima di ogni controllo consultare questo registro e identificare **file, componente, ultimo commit pertinente e tipo di verifica già effettuata**.
- Non rieseguire una verifica superata e ancora valida; procedere soltanto sui file cambiati o su un rischio nuovo, dichiarando il motivo.
- Separare sempre: **esaminato staticamente**, **collaudato nel browser**, **verificato sulle fonti**, **pubblicato e controllato online**. Nessuno di questi stati implica automaticamente gli altri.
- Ogni difetto deve avere riproduzione, file interessato, correzione minima, commit e prova successiva; evitare interventi editoriali senza evidenza.
- Le modifiche storiche restano subordinate alla verifica delle fonti; non aggiornare una conclusione storica soltanto per uniformità con un riassunto o con un indice.
- Aggiornare **questo stesso registro** alla conclusione di ogni lotto di lavoro. Non creare registri paralleli né ripetere test globali dopo ogni modifica locale.


### Elena — gestione errore caricamento dati — 9 novembre 2026

- **Difetto riproducibile per ispezione del flusso:** `Promise.allSettled` lasciava entrambi gli insiemi di dati vuoti se fallivano le due richieste JSON; `reply()` trattava quindi il problema di rete come mancanza di fonti pertinenti.
- **Intervento circoscritto:** introdotti indicatori di disponibilità per indice e risposte approvate. Quando entrambi i caricamenti falliscono, l'interfaccia segnala che l'archivio è temporaneamente non disponibile e che non si può concludere nulla sulle testimonianze.
- **Commit:** `2a9324714055d2bcc3906e3b5dd26ff1854b7d19`.
- **Verifica:** controllo statico del codice aggiornato; non ancora test di errore di rete in browser.
- **Aperto:** distinguere anche i casi di fallimento di una sola delle due risorse, e collaudare il flusso con rete simulata; non ripetere gli audit generali già registrati.


### Elena — caricamento parziale delle risorse — 9 novembre 2026

- **Ambito:** prosecuzione della verifica già aperta, senza rieseguire audit globali.
- **Problema:** il fallimento di una sola richiesta JSON non era segnalato all'utente. Con indice indisponibile, l'assenza di corrispondenze poteva essere confusa con assenza di testimonianze; con risposte approvate indisponibili, i percorsi suggeriti non esplicitavano il limite della consultazione.
- **Correzione:** avvisi distinti per indisponibilità dell'indice e del registro di risposte approvate; quando manca l'indice e non esiste una risposta approvata corrispondente, viene restituito un messaggio tecnico, non una conclusione storica.
- **Commit:** `5fde88503dfc8fa70036e3888337f669cee825ea`.
- **Verifica:** rilettura statica post-commit del file `adc/assets/elena-dialogo.js`. **Non eseguito** un collaudo browser con richieste di rete bloccate; resta aperto.


### Elena — collaudo funzionale su risorse pubblicate — 9 novembre 2026

- **Ambiente:** Node.js v24.19.0 su PC autorizzato «Michele», caricamento HTTP delle tre risorse pubbliche `elena-dialogo.js`, `elena-indice.json`, `elena-risposte-approvate.json`; HTTP 200 per tutte e tre nel primo ciclo. Il test esegue la funzione pubblica `reply()` sul codice effettivamente distribuito, non l'interfaccia grafica completa.
- **Dati:** 42 voci di orientamento, una risposta approvata.
- **Casi e attese:** 1213 → `documentary`, dossier 1213 e limiti; Pianotta → `index`, Pianotta; mulini medievali → `index`, acque-mulini-confini; notai medievali → `index`, notai-medievali; Palazzo Gravina → `index`, scheda palazzo; termini inesistenti → `empty`; primo sindaco → `empty`, nessuna attribuzione inventata.
- **Esito:** 7/7 classificazioni e collegamenti principali attesi superati, dopo correzione dell'aspettativa del caso «primo sindaco», che deve restare `empty` in assenza di una risposta approvata.
- **Pertinenza residua:** le domande su mulini e notai producono anche collegamenti secondari di pertinenza debole. Aggiunti qualificatori temporali al gruppo di termini generici, commit `da96e6d7632f6e5f4a02a781dd28fd19bcc609cd`; il secondo ciclo 7/7 conferma i risultati principali ma **non elimina** tutti i collegamenti secondari. Non dichiarare risolto il problema.
- **Limiti del test:** nessuna simulazione di errori HTTP, nessuna interazione DOM, nessuna prova voce o accessibilità mobile. Non ripetere i sette casi senza modifiche alla logica; il prossimo test deve misurare esplicitamente i falsi positivi e l'ordine dei risultati.


### Elena — falsi positivi, misurazione e correzione mirata — 9 novembre 2026

- **Ambito:** solo pertinenza delle ricerche; nessun audit globale.
- **Misura iniziale sul sito pubblico:** «mulini medievali» 2 risultati, entrambi pertinenti; «notai medievali» 1 risultato pertinente; «Palazzo Gravina» 4 risultati, dei quali 2 meno specifici rispetto alla richiesta; «castello di San Marco» mostrava fino a 5 risultati, compresi collegamenti deboli.
- **Causa:** il ranking ammetteva corrispondenze con un solo termine specifico anche quando esistevano schede che ne coprivano più di uno.
- **Correzione:** filtro basato sulla massima copertura dei termini specifici della domanda quando almeno due termini trovano riscontro; ordinamento e deduplicazione per URL conservati. Commit intermedi `9a01998b0ffd391e7a6fba8cd327fccb10c14b89` e finale `39d4cb4e2f64905283ac6a0a723ecaf44a0329be`.
- **Prova:** Node.js su PC «Michele» con JS e JSON prelevati dal commit immutabile `39d4cb4e2f64905283ac6a0a723ecaf44a0329be`. 8/8 casi superati, inclusi i 7 precedenti perché la logica di ranking è stata modificata. «Palazzo Gravina» ora 2 collegamenti (scheda e pagina del patrimonio); «castello di San Marco» 1 collegamento specifico; mulini 2 e notai 1, senza regressioni.
- **Limite:** prova eseguita sul contenuto del commit GitHub, non ancora confermata la propagazione della nuova versione su GitHub Pages. Non equivale a collaudo DOM o accessibilità. Ulteriori verifiche solo se compaiono nuovi falsi positivi documentati.


### Elena — conferma distribuzione GitHub Pages — 9 novembre 2026

- **Obiettivo circoscritto:** verificare soltanto che la nuova logica di pertinenza sia stata distribuita, senza rieseguire gli otto test funzionali.
- **Verifica remota:** richiesta HTTP diretta dal PC «Michele» a `https://michelebottino-autor.github.io/adc/assets/elena-dialogo.js?verifica=20261109` con risposta **200 OK**.
- **Evidenza di versione:** il corpo della risposta contiene la nuova istruzione `bestCoverage=candidates.reduce`, introdotta nel commit `39d4cb4e2f64905283ac6a0a723ecaf44a0329be`.
- **Metadati HTTP:** `Last-Modified: Mon, 09 Nov 2026 06:58:18 GMT`; `ETag: "6af16f0a-3800"`.
- **Esito:** **distribuzione della correzione confermata** sul sito pubblico. Non costituisce nuovo test browser/DOM né nuova verifica delle fonti; il collaudo funzionale 8/8 resta quello già registrato.


### Elena — interfaccia conversazionale e lettura vocale — 9 novembre 2026

- **Richiesta:** visualizzare domande e risposte come chat, con risposte vocali.
- **Interfaccia:** in `adc/elena/index.html` introdotti messaggi utente/Elena separati, cronologia a scorrimento, compositore compatto per smartphone, esempi di domanda, messaggio iniziale e riduzione di spiegazioni ripetute. Commit `5c5fa5eb3ace96a2e072a55032ecc7ed94b18c29`.
- **Voce:** in `adc/assets/elena-dialogo.js` il comando «Ascolta la risposta» usa `SpeechSynthesisUtterance` per leggere il **testo della risposta corrente** e, quando presente, il limite della verifica; scelta preferenziale di voce italiana disponibile, regolazione velocità e comando Interrompi. Conservata la registrazione originale del benvenuto. Commit `63a37bd981b83f5ee85e5d6e5c996d199d4d9772`.
- **Integrità:** `reply()`, `rank()`, indice e risposte approvate non modificati in questo lotto; nessun motore generativo aggiunto e nessuna fonte storica alterata.
- **Verifica:** `node --check` sul JavaScript del commit indicato, uscita 0. **Non ancora eseguiti** collaudo visivo mobile, riproduzione vocale reale su Android, comportamento di voci non disponibili, e conferma distribuzione della nuova UI su GitHub Pages.


### Elena — comando vocale non visibile su Android — 9 novembre 2026

- **Segnalazione:** screenshot reale Android della risposta approvata sul castello nel 1213: la risposta compare correttamente ma il comando vocale non è visibile nel primo tratto della scheda.
- **Causa individuata nel codice:** i comandi di ascolto erano aggiunti dopo tutto il testo, le cautele e gli avvisi; con risposta lunga rimanevano fuori dall'area immediatamente visibile.
- **Correzione mirata:** `voiceControls` inserito subito dopo il titolo della risposta, prima del testo; nessuna modifica al ranking o alla risposta storica. Commit `cf68da3d4480c61ebcf8e13544d251002c013402`.
- **Verifica:** `node --check` sul file del commit, uscita 0. **Da confermare su Android:** visibilità del comando, avvio effettivo della sintesi vocale, arresto, compatibilità browser e distribuzione pubblica.

## Consolidamento pubblico ADC — 11 novembre 2026

**Perimetro controllato:** sitemap principale con 42 URL della sezione ADC; lettura diretta delle pagine di sintesi, storia, fonti, inventario, atlante, mediateca, Elena, epigrafe, patrimonio e dossier principali, non certificazione integrale delle 42 pagine. Per le 14 pagine principali controllate in questo ciclo: un H1, canonical presente e nessun link letterale href="#"; controllo automatico statico non equivale a collaudo HTML/WCAG/browser né a esecuzione dei componenti JS.

**Correzioni pubblicate:**
- `adc/processo-334/index.html`: stato editoriale portato all'11/11/2026; citazione del repertorio ASPa/Protonotaro del Regno, Tommaso erede di Francesco, vendite/atti successori/investitura separati; ricognizione delle 20 pagine e ipotesi di procura di p.13 presentate come distinte da trascrizione diplomatica e provvedimento eseguito. Conservata la cronologia delle proposte precedenti. Commit `fb79a7c5ee15822b88056440ae82ba67129994f0`.
- `adc/programma/index.html`: priorità 1 allineata alla reale collazione: atto del 1484, titolo successorio, mandante/procuratore, provvedimento d'investitura e verifiche degli effetti. Processo 184 citato in repertorio distinto dalla sola etichetta errata P184 nei vecchi file. Commit `0c4ba26abc052ceac8fbfb0cfb69c838641ed301`.

**Rettifica documentaria:** non modificare i riferimenti a Tribunale del Real Patrimonio presenti in `adc/storia/index.html` (Riveli beni/anime) e `adc/dossier-zucchero/index.html` (Scritture pendenti richiamate da Morreale): si riferiscono a serie diverse e non attribuiscono il Processo 334 al TRP. La serie dell'investitura n.334 resta il Protonotaro del Regno.

**Limiti espliciti:** non effettuato test browser mobile, accessibilità automatica completa, controllo HTTP di tutti i link esterni, collazione filologica di tutte le 42 pagine e ispezione del deploy GitHub Pages immediatamente dopo commit. La pubblicazione nel repository main è confermata dai commit; la propagazione pubblica va verificata separatamente. Non sono stati pubblicati nuovi dati paleografici non verificati e non sono stati alterati PDF originali, database ADC, foto o modelli HTR.

### Completamento tecnico dell'audit pubblico — 11 novembre 2026
- Verificati tramite richieste HTTP dal PC Michele **47 URL ADC** pubblicati nella sitemap aggiornata: **47/47 HTTP 200**, 47 pagine con esattamente un H1 e un canonical, zero collegamenti interni verso pagine ADC assenti dalla sitemap nel controllo statico. Un unico HTTP 503 intermittente su `/adc/economia-storica/` è rientrato in due tentativi immediati e nel controllo finale; annotare come episodio temporaneo, non guasto persistente.
- Cinque pagine pubbliche collegate internamente ma assenti dalla sitemap sono state aggiunte: `calata-san-filippo/`, `dragut-calatabiano/`, `rivolta-1879/`, `stampa-ricerca/`, `storia-per-tutti/`. Commit sitemap: `b13b7cf0e9faec8708c9ecc1adf37c200c940811`.
- Canonical mancanti aggiunti alle quattro pagine `dragut-calatabiano/`, `rivolta-1879/`, `stampa-ricerca/`, `storia-per-tutti/`; la pagina `calata-san-filippo/` era già dotata di canonical. Commit: `b5cb0086a3fb158b2c739f0ebb88e2152dd9285e`, `79df24079b503b2cde5cf60568da927286a0c149`, `17eb480a08b6cfafd8119807fd34d27f764e6e5f`, `a5a6d263c17afd09416b05cc3d4d9a00ae29b15a`.
- Rapporto tecnico in sola lettura sul PC Michele: `ADC_Centro_Verifica/AUDIT_ADC_PUBBLICATO_20261111.json`, generato con `AUDIT_ADC_PUBBLICATO_20261111.py`. Non è un secondo archivio storico.
- **Limiti non risolti:** validazione WCAG/tastiera/contrasto, esecuzione dei JavaScript e moduli dinamici, verifica HTTP di tutti i riferimenti esterni, controllo filologico integrale dei contenuti di tutte le pagine, test mobile con dispositivi reali. Nessuna certificazione implicita di tali ambiti.

### Audit del testo pubblico: note tecniche e ridondanze — 11 novembre 2026
- Esaminate **47 pagine ADC** presenti nella sitemap pubblicata, tramite estrazione del testo dei blocchi visibili al lettore (titoli, paragrafi, elenchi e celle), esclusi navigazione, intestazioni e footer. Recuperate 47/47 pagine. Verificati marcatori di lavorazione (commit, checksum, script, JSON, debug, TODO, backend, training, ecc.), confronti di uguaglianza letterale dei paragrafi nello stesso documento e paragrafi lunghi molto simili nella stessa pagina.
- **Nessun duplicato esatto interno** e **nessun duplicato lungo quasi identico interno** rilevato dalla scansione. **Due** avvertenze metodologiche brevi ripetute fra dossier differenti; mantenute perché distinguono interpretazione e fonte, non ripetono notizie storiche.
- **Una nota editoriale ridondante individuata** in `adc/chiese-cinquecento/index.html`: «Nota editoriale: nessuna delle due notizie viene presentata come una trascrizione diplomatica autonoma dell’ADC.» Eliminata perché il paragrafo immediatamente precedente già esplicita i limiti documentari. **Commit `ee0bdaa737a5b2ca62b071cb75e58dea2a15a2e3`**. La modifica è stata verificata sul ramo principale GitHub; nel primo controllo HTTP successivo l'hosting pubblicava ancora la versione precedente (propagazione da ricontrollare).
- Gli unici tre riscontri di `repository` nel testo estratto si riferiscono **legittimamente a depositi istituzionali universitari di fonti**, non a note tecniche del sito.
- Rapporti tecnici locali in `ADC_Centro_Verifica/AUDIT_EDITORIALE_ADC_20261111.json` e `AUDIT_SEMANTICO_ADC_20261111.json` (PC Michele); non sono archivi documentali canonici.
- **Limiti dell'audit:** possibile ridondanza semantica parafrasata senza sufficiente somiglianza testuale; elementi generati da JavaScript o modali non esaminati in browser; eventuali pagine ADC non elencate nella sitemap; contenuti esterni; regole editoriali e filologiche articolo per articolo. Nessuna certificazione assoluta.

### Origine del nome Calatabiano — consolidamento del 12 novembre 2026
- Recuperata la ricerca da cronologia critica e registro evidenze preesistenti in Drive, pagine storiche pubblicate, e Centro Verifica PC Michele. Distinta etimologia del nome da fondazione dell'abitato e costruzione della fortezza.
- Integrata nel solo percorso `adc/percorsi.html#nome-calatabiano` la spiegazione linguistica di `qalʿa(t)` (rocca/fortezza), l'incertezza sul secondo elemento `Bian/al-bayān`, la forma candidata `Calatabien` del 1151 (non certificata su testo originale) e i riferimenti editi 1193, 1201, 1213. Bibliografia selettiva Treccani, Caffarelli 2025, *Incontri* 2014. La spiegazione «occhi» resta ipotesi alternativa non accertata. Non si deduce una data di fondazione o una persona Biano.
- Aggiornata la risposta editoriale della scheda `nome` in `adc/assets/elena-risposte.json`, con link allo stesso approfondimento. Non introdotta una pagina parallela o una nota di laboratorio nella pagina pubblica.
- Commit: `c1227f40e15742b56daaa5ba898d680b1fe1728c` (percorso storico); `c6374618536efd6912304c2403d5d71def530121` (Elena).
- Verificati entrambi i file nel ramo principale GitHub. La prima verifica HTTP immediatamente successiva alla modifica ha restituito ancora la versione precedente (propagazione GitHub Pages da accertare); non dichiarare già distribuito il nuovo contenuto senza nuovo riscontro live.

### Verifica della forma Calatabien — 12 novembre 2026
- **Pista bibliografica risolta fino all'edizione**: G. G. Mellusi, *Governare il sacro* (Università di Messina, 2021/2022), p. 6, nota 19, riproduce una frase latina in cui compare `Calatabien` e attribuisce il passo a **Starrabba, doc. XII**. Contesto a pp. 5–6: papa Eugenio III, vescovo Goffredo di Messina, 1151.
- **Distinzione di data confermata tramite studio indipendente**: Vincenzo Roberto Imperia, *Tra due poli*, *Historia et Ius* 22 (2022), p. 22, nota 59: due bolle indirizzate a Messina nel 1151, maggio (destinatario Roberto) e **dicembre (destinatario Goffredo)**; il secondo atto è edito in *I diplomi della Cattedrale di Messina*, **doc. XII, pp. 15–17**. Non confondere i due atti.
- Luigi Santagati, *Viabilità e topografia della Sicilia antica*, II (2013), dizionario, p. 67, riportava già la forma `1151 Calatabien` senza nel breve lemma il rinvio diplomatico puntuale ora ricostruito. Confronto con Mellusi e Imperia recupera la catena dell'informazione.
- **Classificazione**: `CALATABIEN-1151 = FONTE STORIOGRAFICA CON CITAZIONE LATINA E RIFERIMENTO DIPLOMATICO PRECISO`; NON `AUTOGRAFIA DEL TESTIMONE VERIFICATA`. Non esaminati direttamente edizione completa Starrabba pp. 15–17 e codici di provenienza; la verifica del testimone rimane necessaria. La bolla riguarda delimitazione di giurisdizione ecclesiastica, NON atto fondativo del borgo o del castello.
- Fonti: https://iris.unime.it/retrieve/a6a85580-4b0b-489d-a5f4-e6838a661b76/tesi%20MELLUSI.pdf ; https://www.historiaetius.eu/uploads/5/9/4/8/5948821/imperia_22.pdf ; https://www.galleria.media/wp-content/uploads/2021/01/Viabilita-e-topografia-della-Sicilia-antica.-Volume-II.pdf
- Corretti i riferimenti pubblici in `adc/percorsi.html` (commit `df66de1d33dcd9bf6db763cb11055266cfba8a00`) e la voce `nome` di `adc/assets/elena-risposte.json` (commit `705330e0c504be7ecd0c6e81391667ddbaabb9e7`). Alla verifica HTTP immediatamente successiva all'aggiornamento entrambi gli URL rispondevano 200 ma mostravano ancora la versione precedente; il deploy GitHub Pages richiede riscontro separato.

### Chiusura editoriale della ricerca sull'origine del nome — 12 novembre 2026
Su richiesta dell'autore, **nessuna richiesta archivistica** è stata effettuata o predisposta. Riordinati i risultati già acquisiti e pubblicati direttamente nella sezione esistente `adc/percorsi.html#nome-calatabiano`: significato di `qalʿa(t)`, seconda componente incerta (Biano come tradizione non accertata), forma `Calatabien` citata da Mellusi per la bolla di Eugenio III del dicembre 1151 (fonte Starrabba doc. XII pp. 15–17), elenco geografico con Castellionem/Masclam e distinta Calatabutor, attestazioni 1193, 1201 e 1213, ipotesi alternativa degli «occhi» non dimostrata. Il testo cita fonti senza inventare la lettura del manoscritto. Evitate note tecniche e ripetizioni; nessuna nuova pagina o archivio.
Aggiornata la risposta `nome` di `adc/assets/elena-risposte.json`, mantenendo una sintesi e il rinvio alla stessa pagina, separando esattamente il contributo di Mellusi da quello di Imperia. Commit `b01dd1e2bd9329df56bf3c01df254872c677a6a3` e `1ea9f90f463158098079e7247ab104e56016b66a`. **Il testo del 1151 resta una citazione in letteratura verificata, non collazione di Starrabba effettuata**. Non comunicare come avvenuta la lettura delle pp. 15–17, né una identificazione codicologica del testimone.

### Consolidamento senza ulteriori integrazioni — riconciliazione 35/18 (12 novembre 2026)
Su direttiva dell'autore: arrestata la ricerca di nuove fonti e le prove di decifrazione come condizione per la chiusura dei dossier. I limiti delle letture restano dichiarati; non inventare originali né promuovere OCR/HTR a trascrizione diplomatica. Nessuna nuova struttura, scheda o software.
- `STATO_CORRENTE_ADC.json` sul PC Michele conferma una concordanza locale canonica `CONCORDANZA_DOCUMENTARIA_UNICA_v1_9_20261110.json` con **35 schede**. L'inventario pubblico `adc/inventario/testimonianze.json` contiene **18 schede**: il primo raccoglie asserzioni e verifiche, il secondo testimonianze selezionate; non sono elenchi equivalenti.
- Collazione analitica scheda-per-scheda registrata nel **registro di continuità locale già esistente** `ADC_Centro_Verifica/VERIFICA_INTEGRATA_STATO_20261111.md`. Quattro schede pubbliche (ADC-0001–0004) condividono un nodo storico specifico o tematico con alcune schede di concordanza; le altre 14 appartengono ad altri dossier pubblici, **non sono automaticamente fonti assenti**. I 35 ID locali rimangono invariati.
- Verificato materialmente l'indice locale: 35 ID distinti, **16 riferimenti asset verso 8 percorsi distinti, tutti 8/8 esistenti sul PC**. Questo controllo non copre tutti gli originali dell'ADC. Secondo il campo di stato, zero originali sono contrassegnati `originale_collazionato:true` in quel registro, senza pregiudicare la lettura documentata di repertori e studi.
- **Dossier Rationes, chiusura editoriale condizionata**: il dossier `adc/dossier-rationes/index.html` già espone il contrasto 536/525 nella numerazione; la scheda ADC-0004 dell'inventario pubblico è stata allineata senza forzare una lettura definitiva. Commit `1783a8ccdb295fec6ec9021f4ca89f7fd274daf9`.
- **Dossier 1213, chiusura editoriale condizionata**: controllo delle schede ADC-C001–003, C012 e ADC-0001 contro `adc/dossier-1213-1537/index.html` e `adc/storia/index.html`; entrambe distinguono già testo edito Hillen, 15.000 tarì, Arnaldo e identificazione storiografica Armaleo Monaldeschi, nonché conferma regia vs compravendita. Nessuna nuova modifica pubblica necessaria.
- **Dossier notai medievali, chiusura editoriale condizionata**: controllo ADC-C029–030 con `adc/notai-medievali/index.html`, regesto Salvo 1348 e repertorio Marrone 1356; eliminato elenco di ricerche future inapplicabile alla chiusura dei materiali posseduti e conservati limiti delle testimonianze. Commit `7c15cb90ca5d0d3720500321ba1b9805951c021e`.
- Dossier ancora da ricontrollare singolarmente **senza ricerca esterna come prerequisito**: feudalità Alagona / investiture, commercio dello zucchero, Fragalà–Maniace (territori da non assimilare), terremoto 1818, opere d'arte 1502, epigrafe e araldica; le ultime letture non certificate restano espressamente incerte.
- **Chiusura editoriale ≠ chiusura della questione storica**: significa testo coerente con ciò che le fonti già acquisite effettivamente sostengono, citazioni e limiti mantenuti, nessuna nuova investigazione imposta.

### Consolidamento della feudalità — chiusura editoriale sul materiale disponibile (12 novembre 2026)
- Verificati senza nuove acquisizioni `adc/storia/index.html`, `adc/atlante/index.html`, `adc/processo-334/index.html`, `adc/dossier-1213-1537/index.html`, `adc/archivio-gravina-cruillas/index.html` e `adc/programma/index.html`.
- **Alagona (ADC-C004–C006, C028):** la storia pubblica già attribuisce a Marrone la notizia del pegno del 1364, registrando la discordanza 1363/1364 per indizione; la permuta verso Motta Sant'Anastasia e i rapporti feudali sono descritti come ricostruzioni da studi, non come lettura diretta di pergamene.
- **Gaetani/Cruyllas (ADC-C007) e successione Mirulla:** il repertorio del Protonotaro fornisce la catena Gaetani–Cruyllas; il processo 334 è legato a Tommaso erede di Francesco, acquirente da Giovanni Cruyllas. Il diario del processo 334 pubblicato distingue vendita, eredità, procura candidata e investitura non dimostrata. NON inferire continuità diretta da repertori cronologicamente diversi.
- **Gravina/Cruyllas (ADC-C008–C010):** conservare le distinzioni fra Fiumefreddo, Calatabiano e Francofonte; 3630 bis non è la stessa voce della 3630. I registri non letti non sono presentati come originali esaminati.
- **Modifica pubblicata:** la prima priorità del `adc/programma/index.html` non descrive più una nuova decifrazione del fascicolo 334 come attività obbligatoria. È ora una sintesi dello stato delle fonti e dell'esito editoriale disponibile; nessuna trascrizione paleografica inventata. Commit `46e87fb42c9681b55a5149f36f46f72d1ce9d1e8`.
- **Esito:** nucleo feudale CHIUSO EDITORIALMENTE CON RISERVE, non chiuso sotto il profilo diplomatico: atto di vendita, successione e investitura non sono tutti direttamente collazionati; le attribuzioni storiografiche rimangono esplicite. Nessuna modifica a originali o cataloghi canonici e nessun nuovo modello, registro, pagina o archivio.

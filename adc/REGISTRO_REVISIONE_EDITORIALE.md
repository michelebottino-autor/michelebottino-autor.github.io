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

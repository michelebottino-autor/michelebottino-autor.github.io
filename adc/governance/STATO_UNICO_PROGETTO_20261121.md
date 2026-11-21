# Stato unico di coordinamento — Sito web autore e ADC

**Data di ricognizione:** 21 novembre 2026.  
**Repository canonico:** `michelebottino-autor/michelebottino-autor.github.io`, ramo `main`.  
**Natura:** documento di coordinamento interno, non articolo pubblico né certificazione filologica o tecnica.

## 1. Gerarchia delle evidenze

1. **Stato del sito:** file presenti nel ramo principale del repository, verificati direttamente, e risultati di distribuzione GitHub Pages. Un vecchio ZIP non prevale sui file GitHub correnti.
2. **Stato del lavoro:** audit, registri, chat e appunti sono testimonianze del processo, da datare e confrontare con i file correnti. Una dichiarazione di completamento non prova, da sola, l'esito.
3. **Fatti storici:** trascrizioni e PDF realmente consultati, con pagina, edizione e livello documentario. Distinguere sempre fonti primarie, edizioni e citazioni indirette.
4. **Stato scientifico:** pubblicazione, deposito, DOI, revisione indipendente e accettazione di collaborazioni sono fatti diversi e non intercambiabili.
5. **Stato funzionale:** esistenza di codice, superamento dei test automatici, funzionamento nel browser e sicurezza del servizio sono livelli diversi.

## 2. Inventario del repository osservato

Censimento mediante Git tree ricorsivo del ramo `main`, 21 novembre 2026:
- 1.428 elementi totali, comprendenti directory;
- 1.101 file;
- 531 elementi sotto `adc/`, comprendenti directory;
- 90 file HTML sotto `adc/`;
- 62 elementi sotto `adc/governance/`, comprendenti directory;
- 273 file HTML nel repository nel suo insieme;
- 5 file PDF nel repository (numero di file, non misura del corpus di PDF esterni);
- 10 schede HTML individuali delle chiese.

Questi conteggi descrivono **un'istantanea**, non il numero di opere o ricerche concluse. L'audit del 18 novembre riferisce 86 HTML ADC: differenza compatibile con modifiche successive, non prova di perdita di materiale.

## 3. Architettura editoriale canonica

| Materia | Sede principale | Altri percorsi |
| --- | --- | --- |
| Autore, opere e profilo | homepage, biografia e sezioni opere del sito | articoli, cataloghi e altri percorsi rimandano alla sede principale |
| ADC nel suo insieme | `/adc/` | ingresso e navigazione, non archivio parallelo di dossier |
| Storia generale | `/adc/storia-per-tutti/` e percorso storico distinto per funzioni | sintesi contestuali con rimandi ai dossier |
| Chiese: indice | `/adc/chiese/` | elenco dei dieci edifici censiti |
| Chiese: singoli edifici | `/adc/chiese/schede/<slug>/` | un solo racconto storico completo per ciascuna chiesa |
| Chiese: questioni medievali e documentarie | `/adc/chiese/studi/` | non trasformare un'ipotesi in cronologia accertata |
| Fonti e livelli di prova | `/adc/fonti/` e dossier specialistici | citazioni tracciabili per edizione e pagina |
| Persone e pubblicazioni su Calatabiano | `/adc/persone/` | `/adc/stampa/autori/` resta percorso di compatibilità |
| Immagini, oggetti e territorio | mediateca, patrimonio, atlante | descrizioni autonome, senza duplicare storia delle chiese |
| Elena | `/adc/elena/` per la componente web | assistente locale Windows è progetto diverso |
| AEGIS | componente tecnica separata | non presentare un logo come certificazione di sicurezza |

## 4. Conflitti e sovrapposizioni rilevati

### C-01 — Nuovo riepilogo delle chiese
Il 21 novembre è stata creata `/adc/chiese/quadro-storico/`. Riassume le dieci schede e le questioni medievali, ma l'audit di unicità del 18 novembre prescrive una sola sede narrativa per ciascuna chiesa. **Stato: risolto sul piano della navigazione il 21 novembre 2026.** Il contenuto è stato confrontato con `/adc/chiese/` e con `/adc/chiese/studi/medievali/`; e sono stati mantenuti nell'indice i raccordi alle fonti medievali, mentre la pagina di riepilogo è stata trasformata in reindirizzamento con `noindex` e canonical verso `/adc/chiese/`. Il testo precedente è conservato nella cronologia Git. Non è stata effettuata alcuna nuova collazione archivistica.

### C-02 — Audit con fotografie cronologiche differenti
`adc/AUDIT-STATO-PROGETTO.md` (12 ottobre), `.github/audits/ADC-REVISIONE-GENERALE-2026-11-18.md` e i registri di revisione riportano perimetri e conteggi di date diverse. **Stato: chiarito.** Non sostituire i loro conteggi con quelli attuali nei rapporti storici; presentare unicamente questo registro come istantanea più recente.

### C-03 — Revisioni editoriali e scientifiche non equivalenti
`adc/REGISTRO_REVISIONE_EDITORIALE.md` contiene uno storico esteso, mentre `adc/governance/registro-revisioni.json` tratta soltanto decisioni di revisione indipendente e include casi ancora in attesa. **Stato: distinto, non da fondere.** I loro nomi sono simili, le funzioni differenti.

### C-04 — Originali, edizioni e riscontri indiretti
L'ADC conserva riferimenti alle `Rationes Decimarum`, ai diplomi medievali, al Processo 334 e alle fonti ecclesiastiche. La collazione con ogni manoscritto originale non risulta completata. **Stato: ricerca aperta.** Nessuna elevazione automatica di grado probatorio.

### C-05 — Componenti tecniche autonome
`Elena` web, `ELENA_UNICA` Windows e AEGIS hanno scopi e stati tecnici diversi. **Stato: separare nel registro funzionale**, senza confondere script presenti con servizi effettivamente funzionanti e collaudati.

## 5. Risultati concreti confermati

- Repository accessibile in lettura e con permesso di scrittura.
- Dieci schede storiche pubblicate nel repository `adc/chiese/schede/`.
- `/adc/chiese/studi/medievali/` e gli studi su temi autonomi restano le sedi di approfondimento.
- La galleria dell'Annunziata contiene file immagine organizzati in anteprime e versioni HD.
- L'audit del 18 novembre documenta controlli statici su 86 HTML ADC e 2.187 collegamenti interni alla data di quella verifica.
- L'esecuzione GitHub Pages del 21 novembre, successiva agli interventi sulle chiese, è segnalata come completata con successo. **Non equivale a un controllo manuale di tutte le URL pubbliche.**

## 6. Lavori ancora da dimostrare o concludere

| ID | Attività | Stato | Prova necessaria |
| --- | --- | --- | --- |
| P-01 | Collazione integrale delle citazioni ecclesiastiche e medievali | Aperta | PDF/scansione leggibile, pagina, trascrizione confrontata |
| P-02 | Consolidare la pagina di raccordo sulle chiese senza nuova narrazione parallela | Risolta nel repository; verifica distribuzione aperta | confronto testi, sostituzione con reindirizzamento e verifica link nell'indice |
| P-03 | Verificare le URL pubbliche e i PDF esterni | Aperta | risposte HTTP e controllo del contenuto |
| P-04 | Collaudo grafico e accessibilità su browser reale | Aperta | esiti verificabili su dispositivi e viewport |
| P-05 | Analisi della ricerca interna e copertura dell'indice | Aperta | test su query note, null result e file non indicizzati |
| P-06 | Elena web/locale: inventario funzionale | Aperta | prove separate per ciascun ambiente |
| P-07 | AEGIS: evidenza delle protezioni realmente attive | Aperta | configurazione, test, limiti e assenza di affermazioni eccessive |
| P-08 | DOI, Zenodo, ORCID, Academia.edu | Aperta | confronto puntuale tra record effettivamente visibili |
| P-09 | Foto, licenze e crediti | Aperta | inventario dei diritti e delle provenienze |
| P-10 | Confronto dei lavori nelle chat con file effettivi | Aperta | corrispondenza per oggetto, percorso e commit |

## 7. Procedura vincolante per i prossimi interventi

1. Controllare questo registro e l'audit specialistico pertinente, senza trattare chat e ZIP come versioni pubblicate.
2. Individuare la pagina canonica e confrontare il testo prima di scrivere.
3. Conservare fonti, annotazioni e cronologia delle modifiche; evitare duplicazioni di narrazione.
4. Registrare separatamente: fatto acquisito, verificato in fonte, pubblicato nel repository, distribuito sul sito, collaudato in browser.
5. Non mostrare sul sito pubblico note interne di audit o dichiarazioni scientifiche non dimostrate.
6. Non alterare documenti originali né inventare date, segnature, DOI o attribuzioni.
7. Aggiornare questo file dopo una verifica sostanziale, indicando data e prove.

## 8. Audit da conservare come documentazione storica

- `adc/AUDIT-STATO-PROGETTO.md` (12 ottobre 2026)
- `adc/REGISTRO_REVISIONE_EDITORIALE.md` (storico cronologico)
- `adc/governance/AUDIT_UNICITA_CHIESE_20261118.md` (regola di unicità)
- `.github/audits/ADC-REVISIONE-GENERALE-2026-11-18.md` (ricognizione e problemi del 18–19 novembre)
- `.github/audits/ADC-PUBBLICAZIONI-RICOGNIZIONE-2026-11-18.md` (catalogo bibliografico)
- `adc/governance/registro-revisioni.json` (decisioni di revisione scientifica indipendente)

**Regola finale:** consolidare ciò che è già verificato e non dichiarare terminato un lavoro senza un esito osservabile.


## 9. Bonifica della sovrapposizione sulle chiese — 21 novembre 2026

- Confrontati direttamente `/adc/chiese/`, `/adc/chiese/quadro-storico/` e `/adc/chiese/studi/medievali/` sul ramo principale.
- Il riepilogo aggiuntivo ripeteva in forma breve le dieci schede già presenti nell'indice; le note sul Medioevo rimandavano allo studio dedicato.
- L'indice conserva le dieci schede e ora collega direttamente gli studi medievali e la sezione fonti.
- L'URL `/adc/chiese/quadro-storico/` resta funzionante come reindirizzamento `noindex` verso l'indice, per non perdere eventuali link condivisi; il contenuto precedente è recuperabile nella cronologia Git.
- Verifica residua: controllare la distribuzione GitHub Pages e la navigazione nel browser reale. Nessun dato storico, fotografia o studio specialistico è stato eliminato.


## 10. Verifica dossier storici — 21 novembre 2026

### Documenti controllati nel repository

- `/adc/dossier-1213-1537/`: dossier autonomo che tratta distintamente il privilegio del 1213 e una notizia notarile del 1537. Conserva collegamenti a PDF di edizioni diplomatiche e studi. Non è una duplicazione integrale del dossier sullo zucchero; l'intersezione del 1537 va mantenuta come rimando al dossier specialistico.
- `/adc/dossier-zucchero/`: dossier economico incentrato su Cruylles, Mirulla, trappeto e produzione zuccheriera, con riferimento al 1537. La sua funzione distinta è confermata.
- `/adc/chiese/studi/rationes/`: dossier sulle decime, Santa Maria, San Giorgio e cappellani, con passi attribuiti alla riproduzione testuale di Sella. Il vecchio indirizzo `/adc/dossier-rationes/` è già un reindirizzamento corretto.
- `/adc/chiese/studi/cinquecento/`: storia istituzionale delle attestazioni 1531 e 1594, distinta dal racconto sulle singole chiese. Il vecchio indirizzo `/adc/chiese-cinquecento/` è già un reindirizzamento.
- `/adc/percorsi.html`, `/adc/storia/` e `/adc/storia-per-tutti/`: hanno funzioni potenzialmente sovrapponibili come percorsi narrativi generali. Non sono stati modificati senza confronto completo dei capitoli.

### Anomalie puntuali

**D-01 — Numerazione delle Rationes.** Nel testo pubblico del dossier è presente una nota secondo cui una trascrizione preliminare indica il n. 525, mentre la riproduzione testuale consultata indica il n. 536 a p. 53. L'audit storico del 19 novembre dichiara verificate nell'edizione di Sella le voci 536 (p. 53), 670 (p. 59) e 897 (p. 67). Rimane inoltre nel prospetto la frase «numerazione della voce da ricontrollare». Il dossier risulta quindi meno aggiornato dell'audit; la discrepanza va risolta soltanto controllando il PDF della pagina a stampa. **Non è stata eseguita una correzione filologica automatica.**

**D-02 — 1537.** Il dossier 1213–1537 e quello sullo zucchero menzionano entrambi l'anno 1537, ma hanno funzioni documentarie diverse. La sovrapposizione tematica non giustifica cancellare uno dei testi; occorre mantenere l'approfondimento economico nel dossier sullo zucchero e un rimando contestuale nell'altro, dopo collazione completa.

**D-03 — Tre racconti storici generali.** `/adc/storia/`, `/adc/storia-per-tutti/` e `/adc/percorsi.html` sono tutti navigabili come testi storici. Occorre individuare il rispettivo destinatario e limitare sovrapposizioni narrative. Non modificati in questa sessione.

### Stato

Ricognizione strutturale sui file completata per i dossier sopra elencati; nessuna modifica ai testi storici. Resta aperto il controllo esterno dei PDF e la valutazione editoriale dei tre racconti generali.


## 11. Distinzione dei tre percorsi storici — 21 novembre 2026

### Esame dei contenuti effettivi
- `/adc/storia-per-tutti/`: sei capitoli di lettura continuativa, dalle testimonianze romane alla storia contemporanea. **Funzione canonica:** narrazione generale per il pubblico.
- `/adc/storia/`: capitoli documentari e approfondimenti su castello, testimonianze ecclesiastiche, demografia, crisi sanitarie, terremoti e Processo 334. **Funzione:** approfondimento e contesto critico, senza qualificarsi come seconda storia generale di riferimento.
- `/adc/percorsi.html`: sezioni monografiche su origini, chiese, castello, patrimonio edilizio e Quattrocento. **Funzione:** navigazione per argomento, non seconda narrazione cronologica principale.

### Modifiche tecniche eseguite
- Inserita una navigazione condivisa e accessibile nelle tre pagine con le voci «Leggi la storia», «Approfondisci la ricerca», «Esplora per argomento», evidenziando la pagina corrente.
- Sostituita nella pagina di approfondimento l'etichetta fuorviante «Calatabiano raccontata a tutti · Capitolo iniziale» con «Documenti e storia · Percorso di approfondimento».
- Precisata l'introduzione ai percorsi tematici, senza rimuovere testi storici o cambiare le URL canoniche.
- Commit: `c8a8425`, `c401fa7`, `5ea356a`.
- La struttura di navigazione è verificata a livello di file GitHub. Collaudo responsive e distribuzione in browser ancora da verificare.

**Stato D-03:** funzione editoriale dei tre percorsi distinta e navigazione aggiornata; revisione semantica paragrafo per paragrafo ancora aperta. 


## 12. Verifica dei PDF: 1213 e decime medievali — 21 novembre 2026

Creato il registro interno `adc/governance/REGISTRO_RISCONTRI_FONTI_20261121.md` per separare edizioni lette, citazioni indirette e PDF non effettivamente disponibili. Il PDF del privilegio del 1213, nella raccolta di Hillen (2007), è stato consultato in testo ricercabile: n. 4, pp. 47–49, con riferimento a Calatabiano e ai 15.000 tarì. La fonte è una raccolta di stampe precedenti, non una nuova edizione critica, come già correttamente dichiarato nel dossier pubblico. Per Sella (1944), l'esistenza dell'edizione è confermata in catalogo, ma non è stata ottenuta una nuova lettura integrale libera del PDF; **resta aperta la discrepanza 525/536** e non è stata modificata la trascrizione pubblica. Nessun PDF è stato salvato localmente in questo ciclo, e nessuna nuova attestazione di visita pastorale è stata dichiarata.


## 13. Matrice delle fonti per tutte le chiese — 21 novembre 2026

Sono stati aperti e letti i dieci apparati `ECC-001`–`ECC-009` e `ECC-014`. Le evidenze da essi riportate, i limiti interpretativi e le priorità di nuova collazione sono stati registrati in `adc/governance/MATRICE_FONTI_CHIESE_20261121.md`. Le fonti esterne citate negli apparati non sono state tutte riaperte in questo ciclo, perciò la matrice costituisce un controllo della documentazione del sito, **non** una nuova verifica filologica indipendente. Nessuna pagina storica è stata modificata.


## 14. Revisione retrospettiva e sitemap — 21 novembre 2026

Ricostruito l'ordine dei lavori della conversazione: ricognizione iniziale delle chiese e dei PDF; correzione della falsa impressione che mancassero le dieci schede; creazione e successivo accorpamento di un riepilogo ridondante; istituzione del registro unico; distinzione dei tre percorsi storici; registrazione separata dei riscontri del 1213, delle Rationes e del vincolo del 2020; lettura degli apparati ECC. Si tratta di operazioni diverse: le modifiche del repository sono verificabili con SHA, la collazione scientifica rimane parziale.

**Controllo sitemap attuale:** 198 URL presenti prima dell'aggiornamento; tutti corrispondevano a percorsi esistenti sul ramo `main`. Restavano fuori nove HTML ADC, in prevalenza vecchi redirect, widget, pagine tecniche e la galleria fotografica dell'Annunziata. Non è stato considerato necessario pubblicare ogni pagina tecnica nell'indice.

**Correzione circoscritta:** aggiunto un link canonical alla galleria fotografica dell'Annunziata e inserita la galleria in `sitemap.xml`. Numero di URL previsto dopo l'aggiornamento: 199. Conservati tutti i 40 riferimenti alle immagini della galleria. Non è stato dichiarato un esito di indicizzazione Google né eseguita una verifica visiva in browser.

**Distinzione essenziale:** lo ZIP allegato è un'istantanea precedente e non include l'ADC corrente. Il repository è la base operativa; i registri sono documentazione storica del processo, non attestazioni di avvenuta revisione filologica di ogni fonte.


## 15. Prima bonifica di errori riproducibili — 21 novembre 2026

### Incongruenza documentaria D-01: Rationes
- Il repertorio pubblico `adc/chiese/studi/rationes/index.html` presentava la cifra 525 da una trascrizione preliminare come se la numerazione 525/536 fosse una «controversia» attestata. Il testo è stato corretto per distinguere il dato della riproduzione testuale (536) dalla trascrizione preliminare non verificata (525), senza cambiare le citazioni latine.
- Aggiornata anche la scheda di riferimento della voce 897, specificando che il numero proviene dalla riproduzione testuale. La pagina a stampa non è stata nuovamente consultata in PDF, pertanto **la collazione filologica resta aperta**.
- Commit: `da76861`.

### Risultati del controllo GitHub Actions
- Esecuzione SEO n. `44880372266`, job `136774152477`: stato **success** ma log con **11 avvisi**: 10 pagine `adc/chiese/studi/ecc-*/` senza meta description e un link `#contenuto` inesistente nella pagina `/corso/`.
- Verificate le 10 pagine ECC: la meta description era effettivamente assente in ciascuna. Aggiunte descrizioni originali, coerenti con l'apparato specifico, senza modificare le affermazioni storiche.
- Verificato `corso/index.html`: il collegamento «Vai al contenuto» portava a `#contenuto` non presente, mentre `main` aveva `id="main"`. Corretto il collegamento a `#main`.
- La vecchia esecuzione CI non prova ancora che i successivi commit siano esenti dagli avvisi. Occorre verificare il nuovo audit automatico e la distribuzione pubblica.
- Commit pagina corso: `25acad9`. Le dieci descrizioni ECC sono state salvate in dieci commit separati (dal `61604cb` a `0109945`).

### Criterio di chiusura
- **Correzione nel repository:** completata per tutti gli 11 avvisi enumerati.
- **Ricontrollo del nuovo audit e prova nel browser:** ancora richiesti prima di dichiarare definitivamente chiusi gli avvisi sul sito distribuito.


### Esito di controllo successivo
- GitHub Actions «Audit SEO e struttura sito», esecuzione `44880516997`, job `136774606226`, conclusione **success** (commit `25acad953`).
- Log verificato: **«URL sitemap: 199 | errori: 0 | avvisi: 0»**.
- **Stato correzioni SEO e ancora corsi: chiuso per l'audit automatico.** La prova di accessibilità in browser reale rimane distinta.
- **Stato D-01 Rationes: formulazione corretta, collazione della pagina 53 ancora aperta.**


## 16. Verifica automatizzata della galleria dell'Annunziata — 21 novembre 2026

- Verificati catalogo JavaScript, categorie disponibili e percorsi delle quattro varianti di ciascuna fotografia. La collezione contiene 26 schede di opere/ambienti, 40 fotografie numerate consecutivamente e 160 file referenziati (`originali`, `hd`, `web`, `anteprime`), senza riferimenti a risorse mancanti nel repository.
- Aggiunto `.github/scripts/check-adc-gallery-assets.mjs`: verifica deterministica di numeri, categorie, percorsi, unicità e presenza dei file.
- Integrato lo script in `.github/workflows/audit-seo.yml`, con attivazione anche alle modifiche della cartella fotografica.
- **Risultato GitHub Actions verificato:** run `44880694480`, job `136775114506`, `success`. Log: «URL sitemap: 199 | errori: 0 | avvisi: 0» e «Galleria ADC verificata: 26 schede, 40 fotografie, 160 file collegati, 0 errori».
- **Conclusione circoscritta:** integrità dei riferimenti fotografici e coerenza dei filtri verificate automaticamente. Rimangono separati la verifica visiva su browser reale, i diritti, le attribuzioni iconografiche e il confronto con gli originali.


## 17. Collaudo ricerca ADC ed Elena web — 21 novembre 2026

**Perimetro:** codice effettivamente presente nel repository, test automatici GitHub Actions e richieste HTTP dall'host autorizzato «Michele». Non riguarda ELENA_UNICA Windows e non certifica l'interfaccia mediante test visivi.

### Ricerca ADC
- `/adc/cerca/` carica `adc/cerca/indice-pagine.json` (80 pagine), integrando 18 schede di `adc/inventario/testimonianze.json`. L'indice di pagine viene generato automaticamente a partire dalla sitemap e dal repository; il conteggio non deve essere confuso con le 90 pagine HTML ADC totali, fra cui alcuni percorsi tecnici, non indicizzati o esclusi dalla sitemap.
- Aggiunto `.github/scripts/test-adc-public-search.cjs`, che esegue il JavaScript inline reale della pagina in un DOM simulato e verifica caricamento dell'indice, query «castello», «chiese», «annunziata», «parlamento», assenza risultati e query troppo breve; controlla inoltre esistenza e sicurezza dei 42 percorsi dell'indice Elena, risposta approvata sul 1213 e astensione in assenza di fonti.
- Integrato il test in `.github/workflows/audit-seo.yml` e nei relativi trigger.
- **CI superato:** run `44881006552`, log «ADC_RICERCA_ELENA_OK: 80 pagine, 18 schede inventario, 42 rotte Elena, query note e query vuote verificate». La stessa esecuzione riferisce «URL sitemap: 199 | errori: 0 | avvisi: 0» e prova integrità galleria fotografica.

### Elena web
- Nell'indice `adc/assets/elena-indice.json` la scheda «Rationes Decimarum» rimandava al vecchio `/adc/dossier-rationes/` e indicava 525 come voce corrente. Modificata per usare la sede canonica `/adc/chiese/studi/rationes/`, riportando 536 dalla riproduzione testuale **con la riserva della collazione della pagina a stampa**. Allineati altri rinvii di compatibilità (`/adc/chiese-cinquecento/`, `/adc/custode/`).
- Corretto il dato 525 anche nel file archivistico `adc/assets/elena-risposte.json`, registrando la variante come trascrizione preliminare non confermata. Quel file non alimenta le risposte approvate del dialogo corrente: la distinzione resta esplicita.
- Esteso `.github/workflows/elena-dialogo-check.yml` ai test di dialogo, contesto e widget. Il test del widget è stato aggiornato alla reale presenza dei controlli audio; la prima esecuzione ha rivelato un'incompletezza del DOM simulato, corretta nel test senza alterare il widget pubblico.
- **CI superato:** run `44881092940`, log con «ELENA_DIALOGO_VERIFICATO», «ELENA_CONTESTO_OK» e «ELENA_WIDGET_REGRESSION_OK: 5 casi mirati». Controllati risposte approvate, rinvio al Processo 334, rifiuto di dati JSON errati o in bozza, domanda senza fonte, e riferimenti conversazionali effimeri.

### Distribuzione HTTP dal PC Michele
- URL `/adc/cerca/`, `/adc/elena/`, `/adc/cerca/indice-pagine.json`, `/adc/assets/elena-indice.json`, `/adc/assets/elena-dialogo.js`: **tutti HTTP 200** con `curl.exe` dal PC autorizzato.
- **Limiti:** il tentativo di eseguire Edge headless non ha prodotto una prova utilizzabile (uscita con codice 1 senza output di pagina). Quindi non si rivendica un collaudo visivo/browser end-to-end. I test JavaScript sono simulazioni controllate e il controllo HTTP non prova l'esecuzione nel browser degli utenti.
- Le nuove versioni del sito possono richiedere un normale ciclo di pubblicazione e cache; l'esito del GET non certifica, da solo, che ogni browser veda l'ultima revisione.

### Chiusura
- **Chiusi:** validazione logica della ricerca, integrità dei riferimenti Elena, regressione di risposta/documentazione e disponibilità HTTP dei file fondamentali.
- **Aperti:** resa mobile, usabilità/tastiera e funzionamento audio su dispositivi reali, verifica browser end-to-end; servizio locale ELENA_UNICA è progetto separato.


## 18. Domande pubbliche sulle chiese e ricognizione web — 21 novembre 2026

**Obiettivo:** utilizzare temi emergenti nella consultazione pubblica per migliorare la leggibilità delle dieci schede, senza confondere l'interesse dei cittadini con una testimonianza storica.

### Perimetro effettivamente verificato
- Eseguite ricerche sul web, compresi tentativi mirati a Facebook, Instagram e Reddit. Le ricerche non hanno consentito una lettura completa e attribuibile di commenti social specifici riguardanti le chiese di Calatabiano. Pertanto **non** si rivendicano domande citate testualmente da utenti, frequenze, graduatorie di interesse o statistiche social.
- Rilevati argomenti effettivamente discussi dalla stampa e riportati in fonti pubbliche: relazione fra proprietà ecclesiastica, conservazione e fruizione del castello; presenza del Crocifisso e della Madonna del Carmine sul Monte Castello; campana e simulacro; cronologie controverse delle chiese.
- **Fonti pubbliche di confronto:** Comune di Calatabiano, scheda Santissimo Crocifisso `https://www.comune.calatabiano.ct.it/it/vivere/chiesa-del-ss-crocifisso`; Comune, Annunziata `https://comune.calatabiano.ct.it/it/vivere/chiesa-maria-ss-annunziata`; Diocesi di Acireale, elenco parrocchie `https://www.diocesiacireale.it/diocesi/comunita-e-persone/parrocchie/calatabiano/parrocchia-maria-ss-annunziata/`; guida comunale storica riprodotta `https://diazilla.com/doc/777729/presentazione---comune-di-calatabiano`; Provincia Italiana dei Carmelitani `https://carmelit.org/2025/10/18/il-carmelo-siciliano-nella-storia/`; LiveSicilia, 10 marzo 2022 `https://livesicilia.it/calatabiano-castello-vendita/`. Le notizie sul castello non costituiscono documenti di proprietà delle singole chiese.
- Le cinque domande formulate nell'indice ADC sono **redazionali**, derivate dal confronto fra documentazione esistente e questioni potenzialmente utili al pubblico, non trascrizioni di commenti.

### Interventi pubblici
- In `/adc/chiese/` introdotta una sezione di orientamento con risposte circoscritte a: antica e attuale Chiesa Madre, distinzione costruzione 1737–1740/erezione parrocchiale 1881, Santissimo Crocifisso e San Filippo come due denominazioni, campana del Carmine, lettura ancora incerta dell'epigrafe 1484, proprietà e manutenzione da accertare sui titoli. Ogni punto collega le schede canoniche e/o apparati di prova; nessuna attribuzione giuridica non dimostrata.
- In `adc/assets/elena-indice.json` aggiunta la scheda di orientamento verso `/adc/chiese/`, rendendo questi argomenti reperibili tramite il componente pubblico Elena senza aggiungere risposte documentarie approvate non verificate.
- Le dieci schede individuali sono rimaste integre; nessuna pagina parallela creata.

### Limiti e passi documentari
- Nessun accesso ai commenti privati o a contenuti soggetti a login; non sono stati utilizzati profili individuali o dati personali.
- Il 1510 attribuito alla campana e il 1518 del convento carmelitano sono dati riportati da fonti secondarie distinte; necessaria epigrafe/atto originale. I documenti di proprietà e responsabilità manutentiva del Carmine e del Crocifisso non sono stati letti.
- La verifica della domanda sociale effettiva richiederebbe consultazione diretta di discussioni pubbliche specifiche e attribuibili, non un'inferenza da ricerca generica.


### Integrazione ulteriore — Gesù e Maria e i Frati Minori
- La guida storica comunale «Presentazione», sezione «Chiesa Gesù e Maria», riprodotta all'indirizzo `https://diazilla.com/doc/777729/presentazione---comune-di-calatabiano`, formula **come ipotesi** un antico collegamento con un convento dei Frati Minori scomparso, richiamando un simbolo dell'ordine presente nella chiesa.
- La notizia non compariva nelle pagine ADC `/adc/chiese/schede/gesu-e-maria/` e `/adc/chiese/studi/ecc-002/`. È stata integrata nella sede narrativa canonica e nell'apparato critico con una riserva esplicita: **nessun atto primario di fondazione del convento è stato esaminato**, e il solo simbolo non dimostra la presenza istituzionale dell'ordine.
- Commit scheda `214da07`, apparato `14a4690`.
- **Controllo automatico successivo:** GitHub Actions run `44881463945`, conclusione **success**. Log «URL sitemap: 199 | errori: 0 | avvisi: 0» e «ADC_RICERCA_ELENA_OK: 80 pagine, 18 schede inventario, 43 rotte Elena».
- Resta distinto l'esito tecnico del repository dall'effettiva lettura di commenti social: nessuna frequenza o citazione testuale di domande Facebook/Instagram verificata.


## 19. Verifica mirata: Gesù e Maria, Carmine e testimonianze pubbliche — 21 novembre 2026

- Ricerca web mirata sulle chiese, con tentativi di individuare domande su piattaforme social. **Nessun campione verificabile di commenti pubblici è stato acquisito:** non attribuire a specifici utenti né classificare per frequenza i temi individuati.
- La guida storica comunale `https://diazilla.com/doc/777729/presentazione---comune-di-calatabiano` riporta per Gesù e Maria la collocazione di un quadro di Gesù e Maria nel 1709 a spese di Antonino Mirabelli e una custodia degli oli santi del 1714 con le braccia di Cristo e san Francesco incrociate. Sono notizie **secondarie**, non atti di committenza o una lettura autoptica di iscrizioni.
- Il motivo delle braccia incrociate è pertinente all'iconografia francescana (cfr. `https://www.ofmcap.org/stemma-del-cardinale/`), ma **non prova** da solo un convento dei Minori a Calatabiano.
- Integrate le due indicazioni nella scheda canonica `/adc/chiese/schede/gesu-e-maria/` e nel registro delle fonti `/adc/chiese/studi/ecc-002/`. Non creata una nuova narrazione parallela. Commit `5303ecf` e `445711f`.
- La pubblicazione dei Carmelitani `https://carmelit.org/2025/10/18/il-carmelo-siciliano-nella-storia/` distingue un'ipotesi sul 1510, l'attestazione secondaria della fondazione conventuale nel 1518, la soppressione nel 1652 e il riferimento indiretto alla concessione del 1583 richiamato da Nicotra. La scheda critica ECC-003 **già censisce** la concessione del 1583; non duplicare la notizia né ricondurre automaticamente Santa Caterina all'edificio del Carmine attuale.
- Prossima verifica scientifica: immagini leggibili della custodia del 1714 e della campana del Carmine, più documenti d'archivio francescani e carmelitani di Calatabiano. Verifiche tecniche GitHub Actions da distinguere dal collaudo delle fonti.


## 20. Rilettura della prima edizione *Calatabiano Sacra* — 21 novembre 2026

- Recuperato su Google Drive e letto il PDF integrale della prima edizione 2025, `calatabianosacra_michelebottino2025.pdf` (ISBN 9798272417756), con i tre PDF separati del capitolo X.
- Confrontato direttamente con il Google Doc `01_REGISTRO_EVIDENZE – Calatabiano Sacra – Seconda Edizione`, che già marca **non riscontrate** le formule attribuite a postilla 1239, due monaci verso Nicosia e *domus virginum S. Annae*, oltre alla cronologia da rivedere della visita De Ciocchis.
- Creato il fascicolo interno `adc/governance/RISCONTRI_CALATABIANO_SACRA_2025_MONACHESIMO_20261121.md`: tabella delle piste, lacune di segnatura e nuovi ingressi archivistici verificabili, inclusa pergamena 1264 dei Frati Minori di Francavilla nell'inventario dell'Archivio di Stato di Messina. La pergamena concerne **Francavilla**, non prova una fondazione francescana a Calatabiano.
- Non inserite nuove attestazioni come fatti certi nelle schede pubbliche; prima edizione usata come repertorio di domande e ipotesi, non fonte indipendente di se stessa.


## 21. Palermo: fonti dirette inventariate sui Padri Agostiniani e sulle contrade — 21 novembre 2026

Ricontrollati inventari ufficiali dell'Archivio di Stato di Palermo, incrociati con il Registro delle evidenze della seconda edizione *Calatabiano Sacra*. Creato il fascicolo `adc/governance/SEGNATURE_PALERMO_CALATABIANO_MONASTERI_20261121.md`, che registra:
1. **Fidecommissaria del principe di Palagonia, inventario n. 81, voce 417, volume antico 86, anno 1799:** due magazzini con trappeti censiti dai Padri Agostiniani alla Secrezia di Calatabiano. **Dato certo a livello di inventario**, ma ubicazione, titolo e presenza di un convento non accertati.
2. Nello stesso inventario, voce 422, volume antico 95 (1747–1749): causa con il Capitolo della Cattedrale di Catania relativa all'acqua del cavo di San Basilio; rapporto con i trappeti non dimostrato.
3. **Deputazione del Regno, Riveli di Calatabiano:** 1039 (1681), 2146–2149 (1747–1750), oltre alle unità della rettifica 1811–1816 (nn. 443–444, 1315, 1607, 2185). Da verificare su ogni carta contrade, titolari, censi e registrazioni ecclesiastiche.
4. **Tabulario San Filippo di Fragalà / Santa Maria di Maniace:** 80 pergamene in inventario, 1090–1620. Le pergamene 24–25 del 1217 riguardano acqua, terre e mulino di Santo Marchetto, ma il regesto non nomina Calatabiano. Evitare collegamenti geografici non dimostrati.
5. **Protonotaro del Regno, repertorio processi di investitura n. 122:** identificati nuovamente i riferimenti 184 e 924, in relazione a Calatabiano. Gli atti integrali non sono stati ricollazionati.

**Aggiornamenti pubblici:** aggiunta al dossier canonico `/adc/archivio-gravina-cruillas/` una sezione sui Padri Agostiniani, con riserva sul tenore del fascicolo; aggiornato solo il rimando nell'indice `/adc/fonti/`. Nessun collegamento monastico ipotetico è stato promosso a fatto certo. Fonte consultata: testo digitale degli inventari ufficiali; i tentativi di cattura grafica tramite screenshot web non hanno fornito una riproduzione utilizzabile. Collazione degli atti originali ancora aperta.

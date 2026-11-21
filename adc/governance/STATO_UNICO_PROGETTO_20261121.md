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

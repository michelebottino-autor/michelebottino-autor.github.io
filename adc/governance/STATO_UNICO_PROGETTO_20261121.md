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
Il 21 novembre è stata creata `/adc/chiese/quadro-storico/`. Riassume le dieci schede e le questioni medievali, ma l'audit di unicità del 18 novembre prescrive una sola sede narrativa per ciascuna chiesa. **Stato: da razionalizzare.** Non cancellare il testo: confrontarlo con `/adc/chiese/` e con `/adc/chiese/studi/medievali/`; conservare soltanto i raccordi nuovi e sostituire eventuali doppioni con rimandi. Il semplice fatto di essere una pagina di raccordo non comporta necessariamente duplicazione letterale: è una sovrapposizione di funzione editoriale.

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
| P-02 | Consolidare la pagina di raccordo sulle chiese senza nuova narrazione parallela | Aperta | confronto testuale e verifica dei rimandi |
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

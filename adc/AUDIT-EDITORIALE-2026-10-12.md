# ADC — Audit editoriale dell'archivio

Data: 12 ottobre 2026. Documento interno, non destinato alla pubblicazione come articolo.

## Perimetro

Ricognizione dei 23 file HTML presenti sotto `adc/` nel ramo principale, mediante lettura di titoli e ricerca di formule operative. Questo è un **audit lessicale e strutturale preliminare**, non una verifica completa di ogni frase, di ogni immagine o del rendering di ciascuna pagina.

## Interventi pubblicati in questa sessione

- `adc/atlante/collazione/index.html`: ricostruito come articolo divulgativo sui diplomi greci, senza registri di sessione o protocollo operativo. Il precedente registro è recuperabile dalla cronologia GitHub; per una consultazione scientifica continuativa occorre un dossier interno separato.
- `adc/atlante/index.html`: riformulati alcuni riferimenti a controlli futuri e collazioni.
- `adc/dossier-1213-1537/index.html`: sostituito elenco operativo dei controlli con spiegazione del valore delle fonti e delle clausole giuridiche.
- `adc/dossier-zucchero/index.html`: riformulato stato delle fonti come spiegazione della provenienza delle informazioni.
- `adc/dossier-rationes/index.html`: migliorata intestazione di una sezione; altre intestazioni richiedono ancora revisione.
- `adc/percorsi.html`: riformulata una formula di avanzamento ricerca.
- `adc/contribuisci/index.html` e `adc/contribuisci/invia/index.html`: eliminato annuncio di un futuro canale tecnico antispam.

## Inventario di copertura delle 23 pagine

| File | Stato della revisione |
|---|---|
| acque-mulini-confini/index.html | ricognito; da rileggere editorialmente |
| atlante/collazione/index.html | riscritto per il pubblico |
| atlante/index.html | revisione parziale |
| calatabiano-1922-1943/index.html | ricognito; da rileggere editorialmente |
| calatabiano-1922-1943/ricostruzione-1943.html | ricognito; testo e interazione da controllare |
| carta/index.html | ricognito; nessun intervento lessicale in questa sessione |
| cerca/index.html | ricognito; controllare copertura delle nuove pagine |
| contribuisci/index.html | revisione puntuale |
| contribuisci/invia/index.html | revisione puntuale |
| dossier-1213-1537/index.html | revisione parziale |
| dossier-rationes/index.html | revisione parziale |
| dossier-zucchero/index.html | revisione parziale |
| fonti/index.html | ricognito; contiene sezioni di stato della ricerca da rielaborare |
| gioco/index.html | ricognito; controllare testi delle domande |
| index.html | ricognito; nessun intervento lessicale in questa sessione |
| opere-pubbliche-1860-1866/index.html | ricognito; da rileggere editorialmente |
| percorsi.html | revisione parziale |
| ponte-alcantara-medievale/index.html | ricognito; da rileggere editorialmente |
| processo-334/index.html | ricognito; da rileggere editorialmente |
| programma/index.html | ricognito; valutare se la natura programmatica è adatta al pubblico |
| scritture/index.html | riscritto in una sessione precedente |
| storia/index.html | ricognito; presenta ancora linguaggio di cantiere editoriale |
| terremoto-1818/index.html | ricognito; da rileggere editorialmente |

## Questioni editoriali ancora aperte

- La pagina `fonti/index.html` presenta sezioni di «stato della ricerca», «questioni aperte» e «come leggere le fonti del laboratorio»: distinguere bibliografia pubblica e registri interni.
- Il dossier `dossier-rationes/index.html` contiene intestazioni come «Oggetto e stato della ricerca», «Controllo incrociato» e «Documenti e riscontri ancora da acquisire».
- `storia/index.html` contiene formule come «grado di verifica» e «storia in costruzione».
- Verificare tutte le immagini remote e i collegamenti, compresi quelli all'edizione Cusa e a Wikimedia Commons.
- Verificare la corrispondenza fra i documenti 24/28/29 degli inventari e gli atti XXVIII/XXXI/XXXII dell'edizione Cusa senza introdurre equivalenze improprie.
- Controllare navigazione, SEO, accessibilità e compatibilità mobile in un browser reale.

## Criterio di completamento

La bonifica sarà **completa** soltanto dopo rilettura integrale delle 23 pagine, verifica delle fonti e delle didascalie, controllo di tutti i link e test visuale del sito pubblicato. La sola ricerca di espressioni tecniche non basta a certificarla.

## Rilettura integrale dei dossier principali e delle pagine di sintesi — secondo passaggio

Sono stati recuperati integralmente dal repository e letti per struttura, contenuti e passaggi di lavorazione i sei file: `acque-mulini-confini/index.html`, `dossier-1213-1537/index.html`, `dossier-rationes/index.html`, `dossier-zucchero/index.html`, `fonti/index.html`, `storia/index.html` (complessivamente circa 90.000 caratteri HTML). Sono stati applicati interventi editoriali mirati a tutti e sei, preservando i rimandi bibliografici.

**Esito della certificazione:** NON certificato come bonifica completa. L'esame ha evidenziato ancora linguaggio operativo nei dossier su acque e decime e nella pagina Fonti, inclusi riferimenti a OCR, collazioni e note di verifica. Inoltre non sono stati eseguiti test visivi completi di tutti i 23 URL, né una verifica automatica di tutti i link e delle risorse remote. Non confondere questa rilettura editoriale con un controllo paleografico degli originali o una verifica indipendente di ogni asserzione storica.

**Azioni prioritarie residue:** riscrivere i passaggi operativi restanti nei tre file sopra indicati; esaminare integralmente le altre 17 pagine ADC; verificare la navigazione e le immagini sul sito effettivamente pubblicato; controllare tutte le fonti citate e i link. Solo allora rilasciare un verbale di certificazione conclusiva.

## Verifiche dirette sul sito pubblicato — 12 ottobre 2026

Eseguite dal computer autorizzato Michele tramite richieste HTTP verso `https://michelebottino-autor.github.io/adc/`:

- **23/23 URL HTML ADC** restituiscono HTTP 200.
- **34/34 URL interni distinti** estratti dagli attributi `href` delle 23 pagine restituiscono HTTP 200. Sono stati ignorati i frammenti `#...` e i collegamenti `mailto:`/`tel:`; non è una verifica dei singoli anchor di destinazione.
- **3/3 risorse esterne campione** rispondono HTTP 200: immagine IIIF BSB Cusa p. 440 (image/jpeg), fotografia Wikimedia della lapide quadrilingue (image/jpeg), scheda BSB del volume (text/html).
- Sono state ulteriormente eliminate note di lavoro e checklist visibili nei dossier Acque, Rationes, nella sezione Fonti e nella Storia generale.

### Limiti della certificazione

**Verifica HTTP e navigazione: superata per il perimetro sopra definito.** Non equivale a certificazione integrale: non sono stati controllati tutti i collegamenti esterni, gli ancoraggi interni, il caricamento JavaScript, la resa grafica su mobile e desktop, l'accessibilità assistiva, la correttezza paleografica di ogni citazione o i diritti di tutte le immagini. Restano inoltre formulazioni di carattere operativo in alcuni dossier, da eliminare prima di dichiarare l'archivio interamente bonificato. Lo stato della certificazione generale rimane **NON COMPLETATO**.

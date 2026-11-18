# Audit di unicità editoriale — Le chiese di Calatabiano

Data: 18 novembre 2026. Ambito: sito ufficiale `michelebottino-autor.github.io`, repository `michelebottino-autor/michelebottino-autor.github.io`, ramo principale esaminato nella fase iniziale. Copia locale di controllo sul PC Michele: `Documents/ADC_SITE_AUDIT_20261118`.

## Oggetto

Mantenere **una sola sede per la storia generale di ogni chiesa di Calatabiano**: `/adc/chiese/schede/<slug>/`, con l'indice `/adc/chiese/`. Gli approfondimenti storico-documentari relativi alle chiese sono raccolti in `/adc/chiese/studi/`. Studi sulle opere d'arte, sulla ritualità, sui terremoti e sulla cronologia generale possono continuare a esistere come trattazioni di oggetti autonomi, senza riscrivere la storia complessiva della stessa chiesa.

## Perimetro effettivamente controllato

- 263 file HTML censiti da `git ls-files '*.html'` al momento del clone; 234 pagine HTML con corpo testuale analizzabile automaticamente.
- Ricognizione per titoli e termini di chiese, cappelle, dedicazioni e toponimi, confronto con le dieci schede narrative `adc/chiese/schede/`.
- 24 pagine esterne alla sezione `adc/chiese/` con più di una ricorrenza tematica nella scansione testuale; verifica manuale approfondita delle maggiori sovrapposizioni e dei rimandi collegati.
- L'assenza di copia testuale letterale non esclude sovrapposizioni tematiche. Il controllo dei paragrafi omonimi non è un controllo archivistico di merito né un'indicizzazione di immagini, PDF o contenuti generati dinamicamente.

## Decisioni attuate

| Percorso originario | Esito editoriale |
| --- | --- |
| `/adc/chiese-cinquecento/` | Contenuto preservato integralmente come studio in `/adc/chiese/studi/cinquecento/`; vecchio indirizzo convertito in reindirizzamento HTML e `noindex` |
| `/adc/dossier-rationes/` | Contenuto conservato come `/adc/chiese/studi/rationes/`; vecchio indirizzo convertito in reindirizzamento HTML e `noindex` |
| `/adc/percorsi.html#chiese` | Soppresso il racconto autonomo parallelo; sezione ridotta a presentazione generale con collegamento all'indice unico |
| `/adc/materiali-patrimonio/` | Eliminati due riassunti di chiese e rinviata al dossier ECC-001 la questione delle date 1740 e 1881, con fonti preservate; rimane il repertorio di materiali, opere, inventari e diritti fotografici |
| `/adc/calatabiano-1922-1943/` | La nascita della parrocchia e la distruzione bellica di San Giuseppe a Pasteria sono richiamate brevemente e rimandate alla storia e alle fonti uniche |
| `/adc/storia-per-tutti/` | Corretto l'accesso alle due raccolte spostate; aggiunto link alla sezione generale delle chiese |
| `/adc/atlante/` e `/adc/fonti/` | Correzione dei rimandi verso i due studi e l'indice ufficiale |
| `/adc/chiese/studi/medievali/` | Aggiunti rinvii ai due dossier nella sede corretta |
| `/adc/epigrafe-santissimo-crocifisso/`, `/adc/crocifisso-1502/`, `/adc/calata-san-filippo/`, `/adc/terremoto-1818/` | Trattazioni specifiche preservate; aggiunti rimandi alla storia unitaria degli edifici |
| `/sitemap.xml` | Sostituiti i due URL storici con gli indirizzi canonici dei dossier ricollocati |

## Contenuti da NON duplicare e contenuti da conservare

- La storia complessiva del Santissimo Crocifisso e di San Filippo Siriaco resta nella scheda `/adc/chiese/schede/santissimo-crocifisso/`; la commissione artistica della croce nel 1502 è un tema autonomo.
- La storia dell'Annunziata è nella relativa scheda; discrepanze bibliografiche e cronologiche sono nell'apparato ECC-001.
- Santa Maria e San Giorgio sono riferimenti medievali trattati nel racconto `/adc/chiese/studi/medievali/` e nei dossier documentari, senza presentare due edifici precisamente localizzati.
- Il terremoto del 1818 riguarda contemporaneamente case, castello, infrastrutture e chiese: il suo dossier mantiene il contenuto trasversale.
- I testi di carattere biografico, le descrizioni topografiche dell'Atlante e le registrazioni delle fonti possono menzionare le chiese purché non sostituiscano una seconda narrazione completa del luogo.

## Continuità

Per nuove pubblicazioni: prima di scrivere una pagina sul ruolo o sulla storia di una chiesa, aggiornare la corrispondente scheda canonica; nei restanti percorsi inserire un riferimento contestuale sintetico e il collegamento. Evitare nuove URL autonome con titolo equivalente a una scheda già pubblicata.

Questa è una verifica di **unicità editoriale**, non una certificazione che ogni singola parola del sito sia priva di analogie semantiche o che tutte le testimonianze originali siano state rilette da capo.

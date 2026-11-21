# Elena ADC — archivio di conoscenze verificabili

## Stato

Il sito GitHub Pages utilizza il motore `elena-dialogo.js`, l'indice di orientamento `elena-indice.json`, il registro di risposte redazionalmente approvate `elena-risposte-approvate.json` e le unità controllate in `elena-conoscenza-verificata.json`.

L'archivio delle conoscenze **non** è un motore generativo e **non** prende decisioni storiche autonome: sceglie esclusivamente testi approvati in anticipo. In assenza di una corrispondenza solida, rimanda alle schede o dichiara l'insufficienza della documentazione.

## Regole per una nuova unità

1. Accertare che il documento sia identificato con riferimento, pagina o folio e collocazione verificabili.
2. Separare la trascrizione documentaria, il dato attestato, l'interpretazione e i limiti.
3. Creare o aggiornare la risposta in `elena-risposte-approvate.json`, includendo revisore, data, ragione della revisione, stato di evidenza e fonte.
4. Solo dopo l'approvazione, aggiungere una voce in `elena-conoscenza-verificata.json`, indicando `source_answer_id` corrispondente a una risposta approvata e la **stessa fonte, pagina e tipologia**.
5. Compilare l'enunciato senza oltrepassare il contenuto documentario approvato e le riserve metodologiche.
6. Definire i requisiti di identificazione della domanda: `must_match_any`, `must_match_subject`, `keywords`. Se mancano riferimenti sufficienti il motore non dà una risposta documentaria.
7. Eseguire test su domanda pertinente, domanda ambigua, domanda estranea, citazione discordante e risposta non approvata prima del rilascio.
8. Conservare le modifiche in Git con revisione editoriale. Non aggiungere file privati, recapiti, testimonianze non autorizzate o documenti soggetti a restrizioni.

## Stati probatori

- `SOURCE_IDENTIFIED`: fonte identificata, non ancora collazionata.
- `EDITION_TEXT_CHECKED`: testo dell'edizione controllato.
- `IMAGE_COLLATED`: confronto effettuato su immagini disponibili.
- `ORIGINAL_COLLATED`: riscontro sull'originale.

Questi stati sono descrizioni del lavoro documentario **effettivamente svolto**, non punteggi probabilistici. Non elevare uno stato sulla base di una semplice parafrasi.

## Sicurezza e limiti del sistema

- Non esiste un database privato esposto da GitHub Pages.
- Nessuna API di modello linguistico o chiave di servizio è pubblicata nel browser.
- Le domande vengono trattate nel browser per il confronto con file statici.
- I file pubblici restano accessibili e possono essere salvati dai visitatori.
- L'app `ELENA_UNICA` sul PC Michele e il suo database SQLite sono un ambiente **distinto**: non sono collegati a questo archivio tramite sincronizzazione automatica.
- L'archivio può crescere soltanto attraverso aggiornamenti controllati e nuove fonti realmente esaminate.

## Prova iniziale

Le prime due unità di conoscenza riprendono una sola risposta già approvata: il privilegio del marzo 1213 sul castello di Calatabiano e la somma di 15.000 tarì ricordata nel testo. Entrambe fanno riferimento al dossier ADC che cita l'edizione Hillen, pagine 47–49. L'originale della pergamena non è stato esaminato. Nessun altro documento è dichiarato verificato da questo aggiornamento.

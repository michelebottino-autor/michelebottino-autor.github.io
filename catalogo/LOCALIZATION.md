# Officina delle Storie — specifica multilingue v1.0

## Lingue e identificatori
Lingua sorgente: italiano (`it`). Lingue pianificate: `en`, `es`, `fr`, `de`, `pt`. Usare tag BCP 47 e attributo HTML `lang` coerente con la lingua realmente visualizzata. I contenuti editoriali ancora italiani vanno marcati `lang="it"` anche quando l'interfaccia è localizzata.

## Modello dati
Ogni corso mantiene un ID stabile, categoria, stato di produzione, versione del syllabus e stato per lingua. Stati traduzione: `planned`, `in_translation`, `in_review`, `available`. Solo `available` abilita l'accesso alla versione linguistica. Non equiparare `published` (corso) a `available` (traduzione).

## Struttura proposta
`/catalogo/i18n/{locale}.json` per stringhe UI; `/corsi/{id}/{locale}/manifest.json` per indice versionato; `/corsi/{id}/{locale}/unita-01.json` per lezioni, esercizi e feedback. Conservare ID identici tra lingue per unità, attività, domande e criteri di valutazione. La pubblicazione di ogni lingua richiede il completamento di lezioni, quiz, feedback, accessibilità, informativa e attestati eventualmente previsti.

## Navigazione e persistenza
Selettore visibile nel catalogo e in ogni corso. Preferenza locale per il dispositivo; eventuale preferenza account solo dopo attivazione del backend e informativa adeguata. Il cambio lingua mantiene corso, unità e progresso usando ID stabili, se la traduzione è disponibile. Se non disponibile, chiedere conferma per aprire la versione italiana e non sostituire silenziosamente il contenuto.

## Qualità e rilascio
Revisione terminologica umana, glossario condiviso, test per lingua, verifica RTL qualora aggiunta, link e metadati localizzati, `hreflang` solo per URL effettivamente pubblicati. Nessuna traduzione automatica non revisionata deve essere annunciata come disponibile.

## Stato verificato 2026-10-10
Catalogo: interfaccia e schede in italiano e inglese; le altre lingue sono pianificate e non selezionabili. Le descrizioni inglesi del catalogo non attestano la disponibilità di corsi completi in inglese. Bottino Method: otto unità in inglese sotto forma di sintesi/adattamenti con prove formative, stato `in_review`, non equivalente alla versione italiana e senza attestato. Non esiste un account multilingue né sincronizzazione dei progressi tra dispositivi. Le altre traduzioni dei corsi non sono pubblicate come complete.

Per la checklist di revisione, gli stati e le condizioni di eventuale futura attestazione/riconoscimento, consultare `QUALITY_STANDARD.md`.

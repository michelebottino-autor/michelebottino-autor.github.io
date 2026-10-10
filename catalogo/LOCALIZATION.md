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

## Stato implementazione 2026-10-10
Catalogo: selettore e stringhe UI in sei lingue; schede e corsi in italiano. Traduzioni dei contenuti: pianificate, non pubblicate. Non esiste ancora un sistema di account multilingue né una sincronizzazione dei progressi tra dispositivi.

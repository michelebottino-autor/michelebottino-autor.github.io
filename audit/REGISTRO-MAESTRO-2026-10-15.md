# Registro maestro — Consolidamento sito autore

Data di apertura: 2026-10-15. Stato: audit in corso. Ramo di lavoro: `consolidamento/2026-10-15`.

## Regole vincolanti

1. Conservare integralmente il sito pubblico e le 33 pagine HTML originali in `adc/` fino ad approvazione esplicita. Nessuna cancellazione o sovrascrittura automatica.
2. Trattare `adc-prototipo/` come ambiente sperimentale, non come sostituto del sito ufficiale.
3. Eliminare le duplicazioni soltanto dopo confronto di contenuti, funzioni, fonti, dipendenze e collegamenti. Preferire l'archiviazione alla distruzione.
4. Ogni modifica deve avere un'origine, un motivo, un commit e una verifica di regressione.
5. Non pubblicare trascrizioni, traduzioni o immagini di archivio senza identificazione della fonte, verifica della lettura e controllo dei diritti di riutilizzo.

## Baseline verificata

- Repository: `michelebottino-autor/michelebottino-autor.github.io`.
- Commit di partenza `main`: `0e4f5233830d93c9be0165dc6e926050912f44dd`.
- File tracciati nel tree GitHub: 311.
- Pagine HTML originali `adc/`: 33.
- Pagine HTML `adc-prototipo/`: 16.
- Presenza di `sitemap.xml`, `robots.txt`, `index.html`, `site-uniform.css` e script PWA: sì; funzionamento non ancora collaudato.

## Registro dei gruppi di pagine

| Gruppo | Stato | Azione prima del consolidamento |
| --- | --- | --- |
| Sito autore | Pubblicato; verifica aperta | Confronto catalogo, contenuti, navigazione e metadati |
| ADC originale (33 HTML) | Preservato | Inventario e test di equivalenza funzionale |
| ADC prototipo (16 HTML) | Sperimentale | Confronto riga per riga con fonti e dipendenze |
| Elena | Ricerca locale disponibile | Test di risposte, fonti e limiti; non dichiarare IA generativa attiva |
| Formazione | Da verificare | Individuare pagine, flussi e dipendenze effettive |
| Materiali storici Drive/PC | In catalogazione | Inventario, provenienza, licenze, collegamento a dossier |

## Priorità e criteri di chiusura

1. Inventario completo dei percorsi e degli asset, identificando duplicati esatti (hash) e varianti editoriali (diff).
2. Matrice URL originale → URL candidata → dipendenze CSS/JS/immagini → collegamenti → stato verifica.
3. Audit dei dossier storici: ogni affermazione controversa ha fonte e grado di certezza.
4. Collaudo su desktop/mobile di navigazione, strumenti interattivi, accessibilità, metadati e SEO.
5. Solo dopo confronto e approvazione, migrazione controllata con backup e piano di ripristino.

## Registro decisioni

- 2026-10-15: autorizzato consolidamento e deduplicazione prudente, non cancellazione indiscriminata. Aperto ramo isolato e registro maestro.
- Nessuna pagina originale modificata in questa fase.

## Questioni aperte

- Differenze tra eventuali rami di design e il prototipo corrente.
- Link relativi e risorse esterne nei dossier migrati.
- Parità funzionale per carta, ricerca, inventario, moduli e widget.
- Provenienza e riutilizzo del PDF `processo_334.pdf`; trascrizione ancora da verificare.

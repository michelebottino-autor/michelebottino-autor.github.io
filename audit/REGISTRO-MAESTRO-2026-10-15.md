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

## Prima verifica di duplicazione esatta (Git blob SHA)

Confrontati i 311 file tracciati del ramo `main` alla baseline. Risultano **due coppie di file byte-identici**, entrambe immagini di copertina:

- `images/opere/michele-bottino_oniro_copertina.jpg` = `images/opere/oniro_copertina.jpg`
- `images/opere/michele-bottino_stige_copertina.jpg` = `images/opere/stige_copertina.jpg`

**Decisione:** non cancellare ancora. Verificare prima i riferimenti HTML/CSS/JS, i metadati e gli eventuali URL indicizzati. Il confronto SHA non identifica duplicazioni semantiche o versioni quasi uguali.

## Verifica Elena del 15 ottobre — controllo proposte

- Task `Elena_Studio_Autonomo` in esecuzione: acquisizione documentaria, non addestramento di modello; 260 cicli e 2 URL visitati al momento della lettura.
- Task `Elena - Controllo sito ADC`: copia del task pianificato con esecuzione giornaliera alle 09:00, script `ElenaUnica/ConnettoreSito/Aggiorna-SitoElena.ps1`; non pubblica su GitHub. La copia XML non dimostra da sola lo stato attuale della pianificazione.
- Rapporto locale del 15 ottobre alle 22:45: 71 pagine acquisite, 14 URL nuovi/modificati, 0 errori riportati. Sono variazioni rispetto al manifesto locale, non correzioni storiche accertate.
- `Analizza-ADC-Ollama.ps1` invoca `qwen3:8b` in locale e genera `Proposte_Elena_Da_Validare.md`. La bozza delle 22:45 contiene URL alterati (`michelebott0-autor`, `michelebottari-autor`, `michelebotttino-autor`) e testi troncati: **non usarla come fonte editoriale né pubblicarla**.
- `Analizza-ADC-Qualita.ps1` impone JSON, citazioni letterali e URL presi dal contesto, non generati. `Analizza-ADC-Critico141.ps1` distingue nessun rilievo, approfondimento e possibile incongruenza. Ultimo rapporto critico esaminato: 1 nessun rilievo, 1 approfondimento, 1 risposta respinta per citazione non letterale; nessuna incongruenza accertata.
- L'approfondimento Gullia–Beviere/Archivio Nelson è già trattato nell'ADC; verificare il fascicolo originale e i lavori già registrati prima di aprire nuova ricerca.

**Decisione:** congelare editorialmente le proposte grezze, preservare i rapporti, non modificare `main` né i task. Priorità: confrontare le 14 variazioni con il contenuto GitHub e applicare controlli di citazione/provenienza prima di ogni integrazione. La mera lettura degli script non certifica il successo delle esecuzioni future.

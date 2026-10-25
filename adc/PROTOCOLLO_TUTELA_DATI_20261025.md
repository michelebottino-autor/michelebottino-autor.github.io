# ADC — Protocollo di verifica editoriale e tutela dei dati

Data: 25 ottobre 2026. **Stato: avvio operativo, non attestazione di conformità complessiva.**

## Risultati verificati nel repository

- La pagina `/privacy/` già contiene diritti dell'interessato e indicazione del titolare, ma rimanda ai contatti.
- La pagina `/contatti/` informa che il recapito diretto non è pubblicato e un canale protetto è ancora da attivare. **Criticità aperta: manca un canale effettivamente raggiungibile per le istanze riservate.**
- Il sito è pubblicato tramite GitHub Pages: un file presente nel repository pubblico non è protetto da `noindex`, `robots.txt` o mancata presenza in sitemap.
- Il file `robots.txt` esclude alcuni file tecnici dalla scansione, ma non ne impedisce l'accesso diretto. Non considerarlo una misura di riservatezza.
- Non sono stati ancora esaminati individualmente tutti i documenti, le immagini, i nomi e le biografie pubblicate. Non dichiarare conformità legale già verificata.

## Procedura interna per ciascuna pagina o documento

1. Registrare URL, titolo, tipologia e identificativo della fonte, segnatura, autore, datazione e stato del riscontro.
2. Distinguere fonte primaria, trascrizione, OCR, testimonianza riferita, inferenza editoriale ed esempio simulato.
3. Valutare la presenza di persone viventi, dati particolari, dati familiari, minori, indirizzi, immagini riconoscibili e altri elementi non indispensabili.
4. Verificare base giuridica pertinente, finalità, proporzionalità, titolarità e condizioni di riproduzione; non presumere un'esenzione generale perché il documento è storico.
5. Decidere se pubblicare integralmente, minimizzare/mascherare dati, usare descrizione al posto del facsimile, limitare l'accesso o non pubblicare.
6. Separare decisione di pubblicazione online da opportunità di indicizzazione; `noindex` non sostituisce autenticazione.
7. Controllare titoli, metadati, JSON-LD, ricerca del sito, anteprime social, sitemap e immagini per evitare che informazioni non necessarie vengano ripetute.
8. Registrare la decisione senza includere dati identificativi sensibili in Git o in file pubblici. Rettifiche trasparenti e cronologia delle versioni pubbliche solo quando appropriate.
9. Richiedere valutazione giuridica qualificata per contestazioni delicate, dati particolari o bilanciamenti complessi.

## Registro di lavoro (senza dati personali)

| Area | Verifica iniziale | Stato | Attività aperta |
|---|---|---|---|
| Informativa privacy | Diritti già indicati | Parziale | Collegamento a procedura esplicita |
| Contatti privati | Nessun recapito diretto pubblico | Bloccante | Attivare recapito privato realmente funzionante e informarlo correttamente |
| Homepage ADC | Descrizione archivio e indicizzazione presenti | Parziale | Audit nominativi e documenti collegati |
| Biografie, genealogie, fotografie | Non verificate individualmente in questo audit | Non verificato | Esame documento per documento |
| Pagine di cronaca e indagini | Non verificate individualmente | Non verificato | Accertare aggiornamento, attribuzioni, proporzionalità |
| Robots e sitemap | Presenti; non proteggono file riservati | Verificato come rischio tecnico | Cercare file di lavoro pubblici, definire rimozione quando necessaria |
| Elena / ricerca interna | Risposte e indicizzazione dei dati personali non verificate qui | Non verificato | Verifiche dedicate senza esporre dossier privati |

## Criterio di completamento

La presenza della pagina pubblica e del protocollo non costituisce una valutazione conclusiva di conformità GDPR. L'audit sarà completo soltanto dopo revisione puntuale dei contenuti e attivazione di un contatto riservato effettivo, con verifica giuridica dove necessaria.

**© 2026 Michele Bottino.**

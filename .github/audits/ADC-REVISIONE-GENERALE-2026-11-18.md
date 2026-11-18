# Revisione generale ADC — 18 novembre 2026

## Perimetro e stato

La revisione è stata eseguita sul repository `michelebottino-autor/michelebottino-autor.github.io`, partendo dal commit `b0ebdde771074438e629a2f883fec8a5e299dd69`. L’ADC comprende 259 file, di cui 86 pagine HTML. La sitemap da sola non è stata usata come censimento: il conteggio deriva anche dai file presenti nel repository. L’inventario JSON è stato aggiornato con la pagina `/adc/persone/` e con i file modificati.

## Interventi completati in questa revisione

- La navigazione condivisa offre accesso diretto a Archivio, Storia, Chiese, Fonti, Atlante, Mediateca, Patrimonio, Stampa, Persone e libri, Elena e sito dell’autore.
- Il foglio grafico condiviso uniforma tipografia, fondo, indicatori di focus e presentazione dei footer ADC. Le pagine d’installazione e offline sono state collegate ai componenti condivisi.
- È stato tolto dal footer il conteggio delle sessioni, insieme al valore iniziale artificiale di 2.000. Non forniva una misura trasparente delle visite.
- `/adc/persone/` è il riferimento principale per i profili: ora riunisce i 13 profili nominativi già presenti nella sezione autori e le forme d’autore individuate nel catalogo bibliografico. Le opere mantengono schede bibliografiche separate e stabili, con identificativi `pub-001`–`pub-017`, e collegamenti ai profili quando l’attribuzione è individuale.
- Le schede di Rodolfo Amodeo e Mario Pafumi, duplicate nel vecchio repertorio persone, sono state riunite nei profili canonici. Le schede di Salvatore Longo Minnolo e Antonino Alibrandi collegano anche i riferimenti bibliografici pertinenti.
- `/adc/stampa/autori/` resta raggiungibile come indice di compatibilità; le schede e i contenuti dettagliati si consultano nella pagina canonica. Gli URL storici con frammento sono inoltrati al profilo corrispondente. I collegamenti interni del repertorio sono stati aggiornati.
- Il repertorio stampa e la scheda di Giuseppe Fumia riportano le date mostrate dalle pagine originali per “Scavi clandestini sulla collina” (15 agosto 2026) e “Incrocio della paura: il muro resta in piedi, la sicurezza no” (20 settembre 2026). Le pagine originali riportano la firma di Fumia.
- Rimossa dalla scheda di Salvatore Zappulla una veduta paesaggistica che non era un ritratto del giornalista.
- Aggiunto un filtro testuale accessibile per le schede personali.

## Controlli eseguiti

- `node .github/scripts/verify-public-editorial.js`: superato; nessuna violazione delle regole editoriali pubbliche.
- Controllo dei collegamenti interni nelle 86 pagine HTML ADC: 2.187 collegamenti verificati, nessun percorso o frammento locale non risolto.
- Controllo degli identificativi della pagina persone: nessun ID duplicato; 29 profili nominativi nel repertorio unico e 17 schede bibliografiche.
- La navigazione e i footer condivisi sono caricati da 83 pagine. Restano fuori i due widget incorporabili e la vecchia rotta `/adc/custode/`, che reindirizza a Elena.

## Verifiche storiche e bibliografiche ancora aperte

Queste voci non sono state trasformate in certezze senza prove sufficienti. Sono registrate qui, nella documentazione di lavoro, e non sono note tecniche da mostrare nel sito:

1. **“Scavi clandestini sulla collina”**: la pagina aperta della testata mostra 15 agosto 2026, mentre un risultato indicizzato in precedenza mostra 1 luglio e i metadati strutturati della pagina riportano una data diversa. Nel repertorio pubblico è stata usata la data visibile nella pagina corrente; serve un controllo successivo dell’archivio editoriale per ricostruire la cronologia.
2. **Due titoli di Salvatore Zappulla in La Sicilia**: “Brucia Monte Castello, evacuato ristorante” e “«Disagi per lavoratori pendolari e turisti»” sono presenti nell’indice autore, ma i permalink individuali non sono stati recuperati. Non sono stati costruiti URL per supposizione.
3. **Bibliografia**: il rapporto fra i record di Silvana Cassar datati 1981 e 2012 va chiarito consultando i cataloghi e gli esemplari; per Felice Vitale il titolo editoriale e i dati commerciali richiedono conferma. Le voci registrate con iniziali (C. Ricca, S. Sorbello, I. Sgrò, F. Maurici e gli autori del contributo archeologico) restano nella forma della fonte.
4. **Questioni storico-documentarie già individuate**: distruzione del ponte sull’Alcantara (1942/1943); numerazione 525/536 nelle *Rationes Decimarum*; data dell’episodio del febbraio 1541; cronologia dell’incursione attribuita a Dragut (1544/1547); materiale lapideo di alcune schede; datazione dell’epigrafe del 1484; lettura della trascrizione del Processo 334. Occorre collazionare i rispettivi documenti e riferimenti prima di correggere le conclusioni.
5. **Completezza delle persone e della stampa**: il repertorio è una selezione documentata, non la prova che tutti gli articoli, gli autori, i libri o i manoscritti relativi a Calatabiano siano stati individuati. Gli archivi cartacei e le emeroteche non consultate restano fuori dalla ricognizione.

## Limite del collaudo

La scansione automatica e il controllo dei collegamenti interni sono riusciti. La revisione visiva effettiva su desktop e telefono e la verifica dopo la pubblicazione restano necessarie prima di considerare completato il consolidamento grafico dell’intero sito. Le pagine dei widget mantengono la grafica compatta richiesta dall’incorporamento e non ricevono la navigazione completa.

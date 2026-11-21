# Elena ADC — amministrazione e pratiche del Comune di Calatabiano

## Ambito

L'archivio pubblico `elena-amministrazione.json` integra, separatamente dai documenti storici ADC, nomi e incarichi pubblicati nel portale istituzionale del Comune di Calatabiano e percorsi per alcune pratiche amministrative. Il motore legge il file nella pagina di Elena e nell'assistente contestuale.

## Fonti e datazione

- Sindaco, vicesindaca, Giunta e Consiglio: profili e schede istituzionali aggiornati a luglio 2026; nomi ripresi dalle pagine ufficiali.
- Commissariamento marzo 2026: registrato come fase precedente, senza confonderlo con la composizione successiva degli organi.
- Responsabili di area e di servizio: indicati soltanto quando identificati in una scheda attribuibile al Comune. Alcune schede sono datate 2025: non dimostrano autonomamente la permanenza attuale nell'incarico.
- Repertorio nominativo del personale amministrativo: elenco pubblicato dal Comune con data 11 luglio 2023, quindi **non trattato come organico aggiornato**.
- Pratiche: link ai procedimenti e agli uffici ufficiali. Sono descrizioni orientative; non sono confermati tempi, costi, requisiti o moduli se non accertati per la specifica domanda.

## Misure editoriali

Elena deve:
1. Attribuire nomi, funzioni e periodi alle fonti istituzionali.
2. Non ricostruire le deleghe dei singoli assessori partendo dalla sola appartenenza alla Giunta.
3. Non scegliere una persona sulla sola base di un nome comune; utilizzare nomi completi o cognomi non ambigui.
4. Distinguere organi attuali da precedenti gestioni e da pagine con aggiornamenti datati.
5. Guidare ai procedimenti senza acquisire carte d'identità, codici fiscali, certificati o dati sanitari dal visitatore.
6. Non affermare di avere presentato pratiche, prenotato appuntamenti, effettuato pagamenti o consultato fascicoli personali.
7. Richiedere verifica sul portale ufficiale per modalità, scadenze, requisiti e documentazione effettivamente applicabili.

## Verifiche

`node scripts/test_elena_amministrazione.cjs` verifica organi, principali pratiche, conservazione delle risposte storiche e disambiguazione. Il test automatico non dimostra che ogni pratica amministrativa del Comune sia stata censita o che le schede siano aggiornate in tempo reale.

## Aggiornamenti successivi

Le variazioni della composizione di Giunta e Consiglio, i dirigenti e responsabili amministrativi devono essere sottoposti a revisione periodica; la sola raggiungibilità degli URL non dimostra che il contenuto sia rimasto invariato. L'acquisizione giornaliera dei titoli delle news non aggiorna automaticamente la composizione della Giunta o le schede delle pratiche.

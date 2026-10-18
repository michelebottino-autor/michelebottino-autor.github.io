# Regola editoriale vincolante — Cervello, Elena e sito autore

**Principio:** il sito pubblico contiene esclusivamente contenuti destinati al lettore: opere, fonti, testi didattici, istruzioni d'uso utili, contatti e indicazioni necessarie su diritti, privacy e qualifiche effettive. Non ospita rapporti di sviluppo.

**NON pubblicare** nelle pagine HTML (compresi footer, banner, guide Elena, meta-description, pagine generate e card): stato dei test, esiti di regressione, versioni pilota interne, valutazioni incomplete, architettura del backend, nomi dei modelli, considerazioni su API, credenziali, revisori mancanti, roadmap tecnica, note di debug, commit o SHA di collaudo, promemoria di sviluppo.

**Separazione dei contenuti:**
- PRIVATO: rapporti tecnici, esperimenti, verifiche, attestazioni non validate, TODO di sviluppo, schede interne e registri di debug. Mantenere nella documentazione di lavoro e nel repository come documenti amministrativi, mai inserirli in sezioni pubbliche.
- EDITORIALE: presentazione chiara di opere e corsi, contenuti didattici, esempi e documenti citati, inviti alla lettura e navigazione.
- INFORMAZIONI NECESSARIE: limiti di una fonte, provenienza di un documento, consenso, riservatezza e condizioni effettive dei corsi. Presentarle in modo chiaro nel contesto opportuno, **senza** resoconti del processo interno. Non dichiarare accrediti, attestati o capacità che non esistono.

**Regola Cervello:** qualsiasi proposta automatica destinata al sito è una BOZZA NON PUBBLICABILE. Prima di un rilascio richiede controllo editoriale, verifica delle fonti e scansione automatica del testo. Il motore cognitivo locale non pubblica e non autorizza modifiche al sito.

**Regola Elena:** le risposte documentarie al pubblico trattano domande storiche e consultazione delle fonti, non comunicano stati del software, test interni o infrastruttura. In presenza di dubbi esprimono limiti documentari e non inventano fatti; non espongono appunti privati.

**Ogni pubblicazione:** revisionare la pagina visibile da smartphone, verificare menu e link, eseguire `node .github/scripts/verify-public-editorial.js` prima del commit e verificare il sito pubblico dopo la distribuzione. Se il controllo fallisce, non pubblicare.

**Limiti:** un documento di regole e un validatore NON modificano i pesi neurali e non garantiscono l'obbedienza assoluta di un modello. L'osservanza è verificata dal controllo sulla fonte destinata alla pubblicazione e dalla revisione del rilascio.

## Criteri di lingua pubblica (integrazione del controllo editoriale)

- Preferire nomi e verbi concreti. Scrivere **che cosa** si può leggere, imparare o verificare e **dove** trovare la fonte.
- Eliminare frasi generiche e ripetitive come «in un ecosistema articolato», «in tal senso», «si configura come» se non aggiungono informazioni.
- Evitare avvisi sugli strumenti interni, cicli di sviluppo, collaudi e modelli linguistici. Le istruzioni d'uso necessarie per il visitatore restano ammesse.
- Conservare gli identificativi delle fonti, la terminologia storica pertinente, i testi originali, le informazioni su diritti e privacy e le cautele su fatti non dimostrati. Non correggere l'autore di una citazione come fosse prosa redazionale.
- Controllare le pagine anche su telefono: tabelle, paragrafi, navigazione e didascalie devono essere leggibili.
- Dopo qualsiasi rigenerazione, ripetere sia il validatore dei contenuti pubblici sia la prova nel browser. Un risultato automatico non sostituisce la lettura editoriale.

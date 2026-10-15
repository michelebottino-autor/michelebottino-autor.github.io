# Elena — flusso editoriale interno

Documento di progettazione. Non è una funzionalità attiva né una pagina destinata ai visitatori.

## Ruoli

- **Elena**: ricerca nelle fonti pubbliche, segnala incertezze, organizza temi e domande ricorrenti senza attribuire verità storica ai messaggi degli utenti.
- **Servizio di analisi principale**: riceve soltanto rapporti autorizzati, valuta lacune, propone piste di ricerca e riferimenti da verificare. Non pubblica modifiche.
- **Responsabile editoriale**: approva o respinge ogni integrazione documentaria e ogni pubblicazione.

## Flusso previsto (non attivo)

1. Il visitatore interroga Elena e ottiene risposte basate sulle fonti indicizzate.
2. Solo dopo informativa adeguata e definizione di una base giuridica, il sistema può raccogliere dati strettamente necessari all'analisi delle domande. Preferire statistiche tematiche aggregate; non conservare domande integrali quando non necessario.
3. Le richieste vengono raggruppate per tema; eventuali dati identificativi e informazioni personali non pertinenti sono esclusi dai rapporti.
4. Il rapporto distingue domande frequenti, quesiti senza risposta, fonti consultate, lacune e proposte di ricerca. I conteggi devono provenire da dati effettivi, non da stime inventate.
5. Un responsabile autorizza l'inoltro del rapporto all'IA principale.
6. L'IA principale elabora una bozza, separando documentazione primaria, bibliografia, interpretazioni, ipotesi e questioni aperte.
7. Il responsabile editoriale verifica fonti e conclusioni e approva esplicitamente ogni eventuale aggiornamento del sito.
8. Elena consulta soltanto il repertorio aggiornato e pubblicato dopo l'approvazione.

## Vincoli

- Il sito pubblico non contiene chiavi API o credenziali.
- Il browser non trasmette domande a servizi terzi senza la prevista informativa e configurazione.
- I rapporti non sono pubblicati automaticamente su GitHub e non contengono trascrizioni personali per impostazione predefinita.
- L'IA principale non dispone di permessi di scrittura sulle 33 pagine ufficiali tramite Elena.
- Non attivare raccolta, conservazione o inoltro prima di aver definito destinatario, autorizzazioni, durata di conservazione, informativa privacy e procedure di cancellazione.
- In caso di assenza di prove, Elena dichiara il limite invece di formulare affermazioni non verificate.

## Stato attuale (15 ottobre 2026)

Ricerca locale e repertorio documentario attivi nel prototipo. Schema del rapporto presente, ma raccolta, aggregazione e inoltro disattivati. Nessuna connessione automatica con questa conversazione ChatGPT.

## Condizioni per il collaudo

- Configurazione di un servizio protetto lato server.
- Autenticazione e autorizzazione dei destinatari.
- Informativa e trattamento dati definiti.
- Prove su dati sintetici senza utenti reali.
- Revisione delle citazioni e dei casi senza risposta.
- Approvazione editoriale prima dell'attivazione.

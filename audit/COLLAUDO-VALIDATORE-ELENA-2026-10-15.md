# Collaudo validatore Elena — 15 ottobre 2026

Ambiente: Python locale isolato; nessuna modifica al PC Michele, ai task o al ramo `main`.

## Esiti

- Compilazione sintattica (`py_compile`): superata.
- Sei prove unitarie: **6/6 superate** (URL corretto, dominio alterato, pagina fuori indice, campo vuoto, percorso errato, percorso errato in proposta).
- Riproduzione sintetica di tre URL alterati effettivamente osservati nel rapporto del 15 ottobre (pagine 2, 4, 5): stato **REJECT** e sei rilievi (tre host alterati, tre URL di pagina non corrispondenti).

## Limiti e decisione

I test usano dati di prova e riproduzioni di estratti osservati, **non** l'esecuzione diretta del validatore sui due file originali residenti sul PC. Non attestano il funzionamento dell'automazione integrata. Il controllo del troncamento è euristico e può non riconoscere frasi interrotte senza punteggiatura sospetta. L'assenza di rilievi produce `REVIEW_REQUIRED`, mai approvazione automatica. Prima dell'integrazione: test end-to-end sui file originali, controlli sui troncamenti e preservazione degli output precedenti.

## Collaudo diretto dei file originali — seconda verifica

Letti direttamente dal PC Michele `DatiElena/SitoADC/Contesto_Sito_ADC.txt` (13 URL originali) e `Proposte_Elena_Da_Validare.md` (12 sezioni pagina). Confronto indipendente delle intestazioni `**URL:**` con l'URL del blocco corrispondente: **4 URL non corrispondenti**, pagine 2, 4, 5 e 7. Inoltre **almeno 3 terminazioni sospette** nelle proposte: pagina 4 proposta 2 (`Bayerische Staatsbib`), pagina 5 proposta 2 (`sezione 61315`) e pagina 12 proposta 2 (`archivi o sui`). Il secondo controllo è un'euristica; il numero non certifica tutte le troncature presenti.

**Esito sul rapporto reale: RESPINTO per uso editoriale automatico.** Non è stata eseguita la CLI Python sul computer Michele: il confronto è stato condotto leggendo i due file originali tramite Desktop Commander e applicando il controllo ai contenuti restituiti. Il validatore GitHub necessita ancora di un controllo per-proposta dei campi obbligatori e della terminazione, perché il semplice controllo di fine sezione non rileva proposte intermedie tronche.

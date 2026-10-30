# Elena ADC — Protocollo di provenienza e autorizzazione v1

Stato: regola di governance; non costituisce approvazione di affermazioni storiche.

## Due dimensioni indipendenti

**Evidenza**: SOURCE_IDENTIFIED (fonte individuata); EDITION_TEXT_CHECKED (testo di edizione riscontrato); IMAGE_COLLATED (immagine dell'esemplare controllata); ORIGINAL_COLLATED (originale materiale controllato); CONFLICTED (contraddizione documentaria).

**Decisione editoriale**: DRAFT; REVIEW_REQUIRED; APPROVED_FOR_PUBLICATION; WITHDRAWN.

Il livello di evidenza non autorizza automaticamente una risposta pubblica. Un'edizione a stampa può sostenere una risposta attribuita all'edizione, anche se l'originale non è stato esaminato, **solo dopo autorizzazione editoriale della formulazione esatta**.

## Campi minimi per una futura attestazione

- ID immutabile e testo preciso dell'affermazione.
- ID della fonte; natura (originale, edizione, studio, regesto), titolo, autore, anno, segnatura/pagina/foglio.
- Collegamento pubblico al dossier ADC; posizione esatta nella fonte quando accessibile; stato di controllo dell'immagine.
- Stato dell'evidenza e limiti della verifica.
- Testo della risposta approvata, revisore identificato, data, motivazione e versione.
- Collegamento derivativo tra risposta e fonte (principio W3C PROV-O); eventuale selettore di pagina/frammento (Web Annotation).

## Sicurezza della pubblicazione

La risposta storica è autorizzata solo con APPROVED_FOR_PUBLICATION e provenienza completa. SOURCE_IDENTIFIED e EDITION_TEXT_CHECKED senza approvazione sono materiali consultabili e attribuibili, ma non risposte certificate di Elena. In caso di conflitto/ritiro il sistema deve astenersi.

Non eseguire approvazioni automatiche sulla base di un test di codice, di un risultato OCR o di una semplice corrispondenza nell'indice.

## Caso 1213

Hillen (2007), documento 4, pp. 47–49: evidenza EDITION_TEXT_CHECKED per A01–A03 in base ai verbali già conservati. Controllo immagine e originale non registrati come conclusi; decisione editoriale REVIEW_REQUIRED. Nessuna promozione della voce nel registro pubblico.

## Attivazione dell'API

Separare controllo documentario, autenticazione, controllo abusi e distribuzione. L'header Origin/CORS non è autenticazione. Prevedere rate limiting e monitoraggio effettivi prima di collegare un servizio pubblico. Non esporre segreti nel client.

Riferimenti: https://www.w3.org/TR/prov-o/ ; https://www.w3.org/TR/annotation-model/ ; https://icar.cultura.gov.it/standard/standard-internazionali/record-in-context ; https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

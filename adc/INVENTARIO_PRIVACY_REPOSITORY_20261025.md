# ADC — Audit tecnico preliminare del repository pubblico
Data: 25 ottobre 2026 · **Stato: verifica tecnica, non certificazione di conformità GDPR.**

## Censimento locale effettuato sul ramo principale

- 153 pagine HTML, 165 file grafici e 1 PDF.
- 59 pagine HTML individuate nei percorsi `adc/`, `articoli/` e `biografia/`.
- In 50 di queste pagine non risulta ancora un collegamento diretto a `/rettifiche-e-diritti/`.
- In 7 pagine dell'ADC compare almeno un tag `form`: `adc/cerca/`, `adc/custode/`, `adc/elena/`, `adc/`, `adc/inventario/` e i due widget. **Da accertare se operino solo nel browser o se trasmettano dati fuori dal dispositivo.**
- Alcune pagine hanno istruzioni esplicite per i crawler. La presenza o assenza di un meta tag, da sola, non dimostra liceità del trattamento né un rischio GDPR.

Questi conteggi derivano dal contenuto del repository e **non** significano che i file fotografici o PDF contengano dati personali. La verifica sostanziale di immagini, testo degli atti e diritti di riuso non è stata svolta qui.

## Misure applicate in questa fase

1. Creato un controllo automatico ripetibile, `adc/audit-privacy-inventory.js`, che enumera i file e classifica le pagine senza esporre dati personali o effettuare classificazioni di persone.
2. Annotati i collegamenti di rettifica mancanti come lacune di navigazione, **non** come violazioni accertate.
3. Mantenuta invariata l'indicizzazione: `noindex` non è una misura di autorizzazione all'accesso. Per documenti riservati occorre non pubblicare i file nella repository pubblica.
4. Confermata la criticità prioritaria: il canale privato per le richieste formali non è ancora operativo. Non si devono invitare persone a inviare istanze sensibili tramite commenti social o issue pubbliche GitHub.

## Prossime verifiche necessarie

- Esaminare finalità e destinazioni dei sette moduli.
- Verificare caso per caso fonti, cronologie ed eventuali cambiamenti negli esiti giudiziari degli articoli di cronaca.
- Esaminare diritti d'autore, persone identificabili, metadata e necessità di diffusione delle immagini.
- Attivare un canale di contatto privato effettivo e verificarne il funzionamento prima di presentarlo come recapito per il GDPR.
- Valutare la possibilità di un collegamento comune alla pagina rettifiche per le pagine ancora prive, senza alterare indiscriminatamente contenuti o SEO.

**© 2026 Michele Bottino.**

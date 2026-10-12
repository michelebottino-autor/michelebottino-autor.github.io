# Audit integrato del sito e dell'Archivio Documentale Calatabiano

Data della ricognizione: 12 ottobre 2026.

## Ambito e metodo
Ricognizione dei file HTML principali del repository GitHub (20 file: homepage dell'autore, sitemap, homepage ADC, percorsi storici, fonti, ricerca e 14 pagine/dossier ADC), con confronto strutturale fra collegamenti relativi e identificativi delle sezioni. Confronto con l'archivio di progetto `michelebottino_site_integrato.zip` (105 elementi; nessuna pagina ADC). Il file ZIP è una fotografia precedente e non deve sostituire il repository aggiornato.

Il controllo è **statico sul codice**: non equivale a una prova di navigazione HTTP o a un collaudo visivo. Non certifica l'accuratezza archivistica delle affermazioni storiche.

## Architettura ADC attuale
- `/adc/`: pagina di accesso ai contenuti e modulo di ricerca.
- `/adc/percorsi.html`: cinque percorsi storici estesi.
- `/adc/fonti/`: fonti, aggiornamenti, criteri di prova e bibliografia.
- `/adc/cerca/`: ricerca testuale client-side su 17 pagine ADC, senza indicizzazione dei PDF e delle scansioni.
- Dossier e schede specifiche sotto `/adc/`.

## Risultati verificati
1. I quattro punti di accesso principali ADC hanno nel codice un'intestazione, un elemento `main`, un riferimento canonico e nessun frammento interno mancante.
2. La pagina `/adc/fonti/` ha ricevuto la navigazione principale mancante.
3. I collegamenti obsoleti alla sezione opere civili della vecchia homepage sono stati aggiornati nelle schede del ponte sull'Alcantara e del terremoto del 1818.
4. Il dossier `/adc/dossier-rationes/` e la pagina `/adc/gioco/` contenevano cinque riferimenti a frammenti non più presenti in `/adc/`. Sono stati aggiornati verso `/adc/fonti/` e `/adc/percorsi.html` (commit `7e698d6`, `95704be`).
5. `/adc/calatabiano-1922-1943/ricostruzione-1943.html` è stato verificato direttamente nel repository: esiste.
6. La pagina di ricerca è presente nel repository e la sitemap la include.

## Questioni editoriali e scientifiche da mantenere aperte
- Collazione con fonti originali delle attestazioni medievali, delle Rationes, delle notizie notarili e delle edizioni di Cusa e Silvestri.
- Verifica della distinzione fra processo 184 e processo 334.
- Controllo di eventuali contenuti non ancora recuperati dalla vecchia homepage, in particolare la sezione «Verifiche documentarie in corso». La sezione non deve essere dichiarata recuperata integralmente senza confronto testuale.
- Controllo dell'eventuale duplicazione fra sintesi, dossier e repertori.
- Inventario completo delle risorse scaricabili e delle immagini.

## Collaudi tecnici non ancora conclusi
- Test HTTP del sito pubblico dopo la distribuzione GitHub Pages.
- Prova della ricerca su browser reale, comprese ricerche senza risultati, caricamenti falliti e dispositivi mobili.
- Verifica automatica di tutti gli URL esterni e delle risorse statiche.
- Controllo responsive, accessibilità e navigazione da tastiera.
- Esame di tutte le pagine non incluse nel campione statico.

## Regola per gli interventi successivi
Non sostituire il repository con lo ZIP precedente. Non aggiungere nuove affermazioni storiche senza una fonte controllata. Registrare separatamente ogni problema verificato, la correzione effettuata e i limiti del controllo.

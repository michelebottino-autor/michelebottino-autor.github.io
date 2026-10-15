# Matrice iniziale di equivalenza — ADC

Verifica del 2026-10-15 sul ramo `consolidamento/2026-10-15`. Questo è un controllo statico dei riferimenti HTML, **non** un collaudo del funzionamento nel browser.

## Confronto home

- Originale: `adc/index.html` (37.452 caratteri rilevati in lettura).
- Prototipo: `adc-prototipo/index.html` (17.091 caratteri rilevati in lettura).
- L'originale espone direttamente inventario, custode, percorsi, carta, programma, gioco, contribuisci e dossier; il prototipo rinvia a varie sezioni originali anziché sostituirle.
- **Esito: equivalenza non dimostrata. Vietato sostituire o eliminare la home originale.**

## Campione dei riferimenti effettivamente letti

### `adc/index.html`

- `https://michelebottino-autor.github.io/adc/`
- `../site-uniform.css`
- `/manifest.webmanifest`
- `/images/logo.png`
- `/adc/condividi.css`
- `/adc/tipografia.css`
- `../privacy/`
- `../cookie/`
- `../contatti/`
- `../adc/carta/`
- `../`
- `../biografia/`
- `../opere/`
- `../ricerca/`
- `../adc/`
- `./inventario/`
- `./custode/`
- `./contribuisci/`
- `./incorpora/`
- `../images/logo_laboratorio_adc_640.webp`
- `./percorsi.html`
- `./dossier-rationes/`
- `./atlante/`
- `./dossier-zucchero/`
- `./fonti/`
- `./carta/`
- `./processo-334/`
- `./dossier-1213-1537/`
- `./acque-mulini-confini/`
- `./calatabiano-1922-1943/`
- `./ponte-alcantara-medievale/`
- `./infrastrutture-novecento/`
- `./opere-pubbliche-1860-1866/`
- `./terremoto-1818/`
- `./crocifisso-1502/`
- `./programma/`
- `./gioco/`
- `./scritture/`
- `../disclaimer/`
- `../analytics-consenso.js`
- `/pwa-init.js`
- `/adc/condividi.js`

### `adc-prototipo/index.html`

- `./assets/elena-presenza.css`
- `./fonti.html`
- `./atlante.html`
- `./storia.html`
- `./mediateca.html`
- `./elena.html`
- `/adc/inventario/`
- `./processo-334.html`
- `./zucchero.html`
- `./calatabiano-1213-1537.html`
- `./acque.html`
- `./rationes-decimarum.html`
- `./ponte-alcantara.html`
- `./terremoto-1818.html`
- `./crocifisso-1502.html`
- `/adc/calatabiano-1922-1943/`
- `/adc/infrastrutture-novecento/`
- `/adc/opere-pubbliche-1860-1866/`
- `/adc/scritture/`
- `./economia-storica.html`
- `/adc/carta/`
- `/adc/contribuisci/`
- `/adc/`
- `/contatti/`
- `./assets/elena-presenza.js`

### `adc-prototipo/atlante.html`

- `./assets/adc-unificato.css`
- `./assets/elena-presenza.css`
- `./index.html`
- `./fonti.html`
- `./acque.html`
- `./atlante.html`
- `./storia.html`
- `./mediateca.html`
- `./elena.html`
- `/adc/economia-storica/`
- `mortillaro-113/`
- `/adc/dossier-1213-1537/`
- `/adc/dossier-rationes/`
- `/adc/ponte-alcantara-medievale/`
- `/adc/dossier-zucchero/`
- `/adc/terremoto-1818/`
- `/adc/opere-pubbliche-1860-1866/`
- `/adc/calatabiano-1922-1943/`
- `./collazione/`
- `/adc/programma/`
- `/adc/cerca/`
- `/adc/atlante/`
- `./assets/elena-presenza.js`

### `adc/atlante/index.html`

- `https://michelebottino-autor.github.io/adc/atlante/`
- `/adc/condividi.css`
- `/adc/tipografia.css`
- `../../`
- `../`
- `../percorsi.html`
- `../fonti/`
- `../cerca/`
- `../economia-storica/`
- `mortillaro-113/`
- `../dossier-1213-1537/`
- `../dossier-rationes/`
- `../acque-mulini-confini/`
- `../ponte-alcantara-medievale/`
- `../dossier-zucchero/`
- `../terremoto-1818/`
- `../opere-pubbliche-1860-1866/`
- `../calatabiano-1922-1943/`
- `./collazione/`
- `../programma/`
- `../../privacy/`
- `/adc/condividi.js`
- `/adc/tabelle-mobile.js`

## Procedura di migrazione

1. Associare ogni pagina prototipo alla pagina originale, se esistente.
2. Classificare ogni riferimento: interno originale, interno prototipo, esterno, ancora, risorsa statica, script.
3. Verificare che i link siano raggiungibili e che le funzioni rimangano operative.
4. Documentare i contenuti originali assenti nel prototipo.
5. Non intervenire sul ramo pubblico finché la matrice non risulta completa e approvata.

## Duplicazioni binarie

Sono già note due coppie di copertine con blob Git identico (Oniro e Stige). Prima della rimozione verificare i riferimenti e mantenere compatibilità URL.

## Seconda verifica — atlante e Processo 334

Controllo statico su sei pagine: home originale/prototipo, atlante originale/prototipo, Processo 334 originale/prototipo.

| Coppia | Rilevazione | Esito |
| --- | --- | --- |
| Home ADC | Originale: 1 form, 4 tag script; prototipo: 0 form, 2 tag script | Parità funzionale non dimostrata |
| Atlante | Originale: 2 tag script; prototipo: 1 tag script. L'originale contiene collegamenti ai dettagli Mortillaro 113 e collazione | Due URL relativi errati corretti sul ramo di consolidamento |
| Processo 334 | Originale: 3 tag script; prototipo: 2 tag script; riferimenti a navigazione e risorse differenti | Richiede controllo di contenuti, apparato documentario e funzioni |

**Correzione effettuata in** `adc-prototipo/atlante.html`:

- `mortillaro-113/` → `/adc/atlante/mortillaro-113/`;
- `./collazione/` → `/adc/atlante/collazione/`.

Commit: `ea620eaeece477efd29776934d159b40277b249d`.

I conteggi dei tag script e form sono indizi di differenza, non prove di funzionalità mancanti: richiedono ispezione e test. Il controllo non è ancora esteso a tutte le 49 pagine HTML delle due aree.

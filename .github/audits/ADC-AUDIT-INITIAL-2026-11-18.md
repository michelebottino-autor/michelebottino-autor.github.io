# Audit iniziale ADC: censimento e reperibilità

**Data:** 18 novembre 2026  
**Repository:** `michelebottino-autor/michelebottino-autor.github.io`  
**Commit di base:** `63741172e99f600eab983cdbd03e83e742331269` (18 novembre 2026, 09:28 UTC)  
**Ambito:** struttura del repository, pagine ADC, sitemap, ricerca interna, inventari tecnici e percorsi di consultazione.

## Censimento tecnico

| Perimetro | Risorse rilevate |
|---|---:|
| Voci nel tree Git del repository | 1.239 |
| File sotto `adc/` | 258 |
| Pagine HTML ADC | 85 |
| Markdown ADC | 27 |
| JSON ADC | 40 |
| CSS ADC | 22 |
| JavaScript ADC | 16 |
| Immagini WebP, JPG, AVIF e PNG | 41 |
| Audio MP3 | 6 |
| CSV e XML ADC | 4 |

Il file `inventario-risorse-repository-20261118.json` registra tutti i 258 file con percorso, dimensione, SHA, tipo tecnico e, per le pagine HTML, titolo, descrizione, autore dichiarato, direttiva robots e collegamenti ADC rilevati. Argomento, periodo e verifica documentaria sono marcati come non classificati o non verificati quando non accertati.

## Criticità rilevate

1. La sitemap iniziale conteneva 185 URL complessivi, 67 nell'ADC. Il censimento JSON/CSV presente nel repository ne registrava soltanto 40: risultavano 27 rotte ADC non riportate in quel catalogo.
2. Il confronto fra le 85 pagine HTML e la sitemap ha individuato dieci pagine con direttiva esplicita `index,follow` non elencate: gli apparati `ECC-001`–`ECC-009` e `ECC-014` in `/adc/chiese/studi/`. Il branch le aggiunge alla sitemap e al censimento, senza modificarne i contenuti.
3. Sei pagine dichiarano `noindex` e le rispettive rotte dirette sono assenti dalla sitemap: `chiese-cinquecento`, `custode`, `dossier-rationes`, `offline.html` e i due widget. Le prime tre dichiarano una pagina canonica alternativa già presente nella sitemap; le altre sono pagine di servizio. La ricerca usa solo le rotte pubblicate in sitemap e scarta comunque ogni pagina che dichiara `noindex`.
4. Due pagine di servizio assenti dalla sitemap non dichiarano `robots`: `contribuisci/invia` e `installa`. La loro indicizzabilità resta da decidere.
5. La ricerca `/adc/cerca/` usava 52 percorsi statici. La correzione la alimenta dalla sitemap, deduplica le rotte ed esclude le pagine che dichiarano `noindex`. Il testo continua a provenire dalle pagine HTML; immagini e PDF non diventano ricercabili integralmente.
6. `adc/assets/elena-indice.json` contiene 42 voci introduttive. Non è un indice esaustivo. Il nuovo censimento delle 77 rotte pubblicate è distinto dall'inventario dei 258 file.
7. La stampa ha funzioni separate in `/adc/stampa/` (repertorio), `/adc/stampa/autori/` (schede nominative) e `/adc/stampa-ricerca/` (risorse per stampa e ricerca). Attribuzioni e accessi degli articoli richiedono ancora verifica puntuale.
8. La grafica utilizza CSS condivisi ADC, ma sono presenti stili locali e incorporati. Uniformità, accessibilità da tastiera e resa mobile non sono ancora collaudate su tutte le 85 pagine.

## Mappa funzionale delle sezioni esistenti

| Area | Percorsi ADC da consolidare |
|---|---|
| Storia | `/adc/storia/`, `/adc/storia-per-tutti/`, `/adc/percorsi.html` |
| Castello e fortificazioni | `/adc/castello-sopralluogo/`, `/adc/castello-murature-restauri/`, dossier e fonti correlate |
| Chiese e patrimonio religioso | `/adc/chiese/`, `/adc/chiese/schede/`, `/adc/chiese/studi/`, `/adc/crocifisso-1502/` |
| Monumenti ed edifici | `/adc/patrimonio-edilizio/`, `/adc/palazzo-abbadotto/`, `/adc/materiali-patrimonio/` |
| Archivi e documenti | `/adc/fonti/`, `/adc/inventario/`, `/adc/atlante/`, dossier e schede di fonte |
| Giornali e stampa | `/adc/stampa/` |
| Giornalisti e autori | `/adc/stampa/autori/` |
| Personaggi e famiglie | `/adc/dizionario-biografico/`, dossier feudali e schede di fonte |
| Territorio ed economia | `/adc/acque-mulini-confini/`, `/adc/economia-storica/`, `/adc/ponte-alcantara-medievale/`, `/adc/infrastrutture-novecento/` |
| Fotografie e audiovisivi | `/adc/mediateca/`, `/adc/atlante/` e raccolte in `/adc/assets/` |
| Epigrafia, araldica e archeologia | `/adc/lapicidi-epigrafi/`, `/adc/epigrafe-santissimo-crocifisso/`, `/adc/pianotta/` |
| Ricerche e pubblicazioni ADC | `/adc/ricerca/`, `/adc/ricerche/`, `/adc/programma/`; DOI e ORCID da censire |

La mappa riusa le sezioni esistenti. Non certifica la completezza di ciascuna area.

## Interventi predisposti nel branch

- Ricerca interna alimentata dalla sitemap e filtrata rispetto alle pagine `noindex`.
- Dieci pagine ECC indicizzabili aggiunte alla sitemap.
- Censimento rotte ricostruito in corrispondenza della sitemap corrente e incrociato con il repository.
- Inventario tecnico dei 258 file ADC.
- Verificatore esteso al confronto fra sitemap e pagine HTML locali.

Non sono stati riscritti fonti, trascrizioni, attribuzioni o ricostruzioni storiche.

## Verifiche ancora aperte

- Classificazione archivistica e verifica delle fonti per tutte le 85 pagine e i 258 file.
- Controllo dei link interni ed esterni, DOI, immagini, audio e allegati.
- Ricerca con filtri per persona, luogo, periodo, edificio, autore, tipologia e testata.
- Audit WCAG 2.2 AA e collaudo visuale, mobile, tastiera e lettori di schermo.
- Decisione sulle direttive robots discordanti o mancanti.
- Verifica scientifica di schede e attribuzioni nel repertorio stampa.
- Prove dei percorsi cittadini, studenti e studiosi.
- Distribuzione pubblica e controllo successivo: non eseguiti in questa fase.

## Punto di ripresa

Questo branch completa un primo intervento su censimento e reperibilità. Le fasi successive devono mantenere distinta la presenza di una pagina dalla verifica delle fonti che essa cita.

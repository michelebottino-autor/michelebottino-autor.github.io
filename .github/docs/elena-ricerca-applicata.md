# Elena ADC | Ricerca applicata

Il primo intervento estende la consultazione a passaggi identificati nei dossier pubblici. La pagina ADC è la fonte del testo e della relativa riserva. Il collegamento apre il punto preciso del dossier. Il registro delle risposte approvate mantiene la precedenza e la registrazione vocale associa il file soltanto al testo approvato corrispondente.

| Fonte consultata | Applicazione e criterio di prova |
| --- | --- |
| [Lewis et al., NeurIPS 2020, Retrieval-Augmented Generation](https://papers.nips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html) | Separare il recupero delle fonti dalla formulazione. In questa versione il testo è estratto dalla fonte pubblicata. Per una prova semantica futura, confrontare il recupero lessicale con quello ibrido usando le stesse domande e gli stessi passaggi attesi. |
| [Gao et al., EMNLP 2023, Enabling Large Language Models to Generate Text with Citations](https://aclanthology.org/2023.emnlp-main.398/) | Valutare correttezza e copertura delle fonti. La prova in browser controlla testo, riserva e collegamento al passaggio. Una prima raccolta più ampia dovrà includere domande con fonti concorrenti, varianti dei toponimi e casi senza attestazione. |
| [Cloudflare Vectorize, documentazione ufficiale](https://developers.cloudflare.com/vectorize/) | Opzione da confrontare con l'indice attuale su soli contenuti pubblici autorizzati. Misurare il tasso di recupero del passaggio atteso fra i primi cinque risultati, il tasso di risposte senza riscontro e la latenza. |
| [Cloudflare Workers AI, JSON Mode](https://developers.cloudflare.com/workers-ai/features/json-mode/) | Uno schema può rappresentare identificativi dei passaggi, riserve e astensione. Il controllo della struttura e quello della corrispondenza fra affermazione e fonte sono verifiche distinte. L'eventuale generazione va prima valutata come bozza redazionale. |

Le prime prove riguardano il rinvio archivistico del 1537 e la voce 897 delle decime. Sono inclusi casi con anno incompatibile, assenza di riferimento alla fonte e conservazione del caso vocale del 1213. I test verificano questo insieme di casi e possono essere ripetuti nella suite ADC.

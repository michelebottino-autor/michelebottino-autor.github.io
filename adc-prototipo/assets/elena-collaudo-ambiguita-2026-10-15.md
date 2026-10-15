# Elena — piano di collaudo delle ambiguità

Documento interno, 15 ottobre 2026. Le domande sono sintetiche e non provengono da visitatori.

## Casi da verificare in browser

| Domanda | Comportamento atteso | Limite attuale |
|---|---|---|
| «Che cosa sapete?» | Richiedere una precisazione | Gestito dal controllo sui termini utili |
| «Parlami di Calatabiano» | Chiedere un tema specifico | Gestito dal controllo sui termini utili |
| «Il castello è certamente l'origine dell'abitato?» | Indicare le pagine storiche senza affermare una certezza | Il motore propone pagine, non valuta l'attendibilità della premessa |
| «Il ponte era romano oppure medievale?» | Presentare il dossier sul ponte e distinguere le attestazioni dalle ipotesi | Il motore non confronta ancora le prove |
| «Chi costruì il primo mulino?» | Rimandare al dossier pertinente senza inventare un nome | Il motore non sa se la fonte risponde alla domanda specifica |
| «Il terremoto del 1818 distrusse tutte le case?» | Evitare generalizzazioni e rimandare alle fonti | Il motore non verifica ancora la quantificazione implicita |
| «Dimostrami che la mia ipotesi è vera» | Chiedere quale ipotesi e quali prove | Può restituire nessun risultato, ma non argomenta |
| «Posso inviare fotografie?» | Indicare la pagina dei contributi | Percorso presente nell'indice |
| «Cosa successe nel 1943?» | Offrire il dossier generale prima delle ricostruzioni specifiche | Ordine di pertinenza da migliorare |
| «Che tempo farà domani?» | Dichiarare assenza di fonti pertinenti | Non è un servizio meteo |

## Regole di accettazione

1. Nessuna risposta storica senza rimando a una fonte pertinente.
2. Nessuna conferma automatica di premesse non dimostrate.
3. Distinguere assenza di risultati da assenza di prove storiche.
4. Le domande ambigue devono condurre a chiarimento o percorsi di lettura, non a invenzioni.
5. Non confondere corrispondenza lessicale con prova documentaria.

## Esito

Questa è una **matrice di casi di prova**, non un rapporto di esecuzione nel browser. Il solo controllo introdotto e verificabile nel codice è la richiesta di chiarimento quando la domanda non produce termini di ricerca. Le altre capacità richiedono progettazione documentaria, verifiche sulle fonti e test ulteriori.

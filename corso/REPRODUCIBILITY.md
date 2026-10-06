# Bottino Method â€” Corso Base
## Manifest di riproducibilitÃ  didattica

Versione corso: v23
Data baseline: 2026-10-06
Autore: Michele Bottino

### Fonte metodologica
Bottino Method â€” Manuale Completo v4.1 (2026).

### Percorso canonico
Introduzione
UnitÃ  1 â€” Prima di credere, verifica
Esempio interattivo non valutato
UnitÃ  2 â€” Fatto, affermazione, fonte e interpretazione
UnitÃ  3 â€” Quanto possiamo realmente affermare?
Verifica 1 â€” 5 domande; superamento: almeno 4/5
UnitÃ  4 â€” Una fonte non vale lâ€™altra
UnitÃ  5 â€” Quando le fonti non concordano
UnitÃ  6 â€” Il Bottino Method in pratica
UnitÃ  7 â€” Intelligenza artificiale sotto controllo
Verifica 2 â€” 5 domande; superamento: almeno 4/5
UnitÃ  8 â€” Caso finale
Completamento â€” 8/8

### Stati persistenti del prototipo
bm_done = numero di unitÃ  completate, 0..8
bm_check1 = percentuale Verifica 1 superata
bm_check2 = percentuale Verifica 2 superata`r`nbm_final = percentuale Prova applicativa finale superata (soglia 4/5 = 80%)
bm_completed_at = timestamp ISO del completamento

### Regole di progressione
UnitÃ  4 bloccata finchÃ© Verifica 1 non Ã¨ superata.
UnitÃ  8 bloccata finchÃ© Verifica 2 non Ã¨ superata.
Una verifica non superata puÃ² essere ripetuta.
Il pulsante Continua deve portare alla prima dipendenza non completata.
L'avanzamento complessivo Ã¨ ponderato: 8 unitÃ  Ã— 10% = 80%; Verifica 1 = 10%; Verifica 2 = 10%. Il 100% Ã¨ quindi raggiungibile soltanto dopo entrambe le verifiche e tutte le unitÃ .

### Distinzione metodologica
La sequenza Acquisisci â†’ Classifica â†’ Verifica â†’ Confronta â†’ Concludi â†’ Traccia Ã¨ una semplificazione didattica del Corso Base.
La pipeline formale del manuale completo comprende acquisizione dellâ€™input, classificazione delle informazioni, applicazione dei vincoli, esecuzione del processo, verifica delle unitÃ , produzione dellâ€™output, validazione e FREEZE.

### Criteri minimi di riproducibilitÃ 
1. Stesso codice e stesso stato iniziale devono produrre la stessa progressione didattica.
2. Le risposte corrette delle verifiche e le relative spiegazioni sono deterministiche.
3. Il percorso deve essere testabile da stato vuoto fino a 8/8.
4. Il reset del localStorage deve riportare il prototipo allo stato iniziale.
5. La riproducibilitÃ  riguarda il comportamento del percorso, non lâ€™identitÃ  grafica o testuale dellâ€™interazione.

### Limiti attuali
Il prototipo usa localStorage: i progressi non sono sincronizzati tra dispositivi.
Google login non Ã¨ implementato.
PDF didattici non ancora prodotti.
Attestato definitivo e verifica pubblica del certificato non implementati.

### Test automatici
reproducibility-test.js verifica struttura, gate, completamento e baseline.
e2e-state-test.js verifica la macchina degli stati: nuovo studente; blocco Verifica 1; esito insufficiente; superamento; blocco Verifica 2; esito insufficiente; superamento; accesso al Caso finale; persistenza del completamento dopo ricaricamento.

Comandi di verifica:
node reproducibility-test.js
node e2e-state-test.js

Baseline attesa:
REPRODUCIBILITY_TEST_OK
E2E_STATE_TEST_OK

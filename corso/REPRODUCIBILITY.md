# Bottino Method — Corso Base
## Manifest di riproducibilità didattica

Versione corso: v18
Data baseline: 2026-10-06
Autore: Michele Bottino

### Fonte metodologica
Bottino Method — Manuale Completo v4.1 (2026).

### Percorso canonico
Introduzione
Unità 1 — Prima di credere, verifica
Esempio interattivo non valutato
Unità 2 — Fatto, affermazione, fonte e interpretazione
Unità 3 — Quanto possiamo realmente affermare?
Verifica 1 — 5 domande; superamento: almeno 4/5
Unità 4 — Una fonte non vale l’altra
Unità 5 — Quando le fonti non concordano
Unità 6 — Il Bottino Method in pratica
Unità 7 — Intelligenza artificiale sotto controllo
Verifica 2 — 5 domande; superamento: almeno 4/5
Unità 8 — Caso finale
Completamento — 8/8

### Stati persistenti del prototipo
bm_done = numero di unità completate, 0..8
bm_check1 = percentuale Verifica 1 superata
bm_check2 = percentuale Verifica 2 superata
bm_completed_at = timestamp ISO del completamento

### Regole di progressione
Unità 4 bloccata finché Verifica 1 non è superata.
Unità 8 bloccata finché Verifica 2 non è superata.
Una verifica non superata può essere ripetuta.
Il pulsante Continua deve portare alla prima dipendenza non completata.
L'avanzamento complessivo è ponderato: 8 unità × 10% = 80%; Verifica 1 = 10%; Verifica 2 = 10%. Il 100% è quindi raggiungibile soltanto dopo entrambe le verifiche e tutte le unità.

### Distinzione metodologica
La sequenza Acquisisci → Classifica → Verifica → Confronta → Concludi → Traccia è una semplificazione didattica del Corso Base.
La pipeline formale del manuale completo comprende acquisizione dell’input, classificazione delle informazioni, applicazione dei vincoli, esecuzione del processo, verifica delle unità, produzione dell’output, validazione e FREEZE.

### Criteri minimi di riproducibilità
1. Stesso codice e stesso stato iniziale devono produrre la stessa progressione didattica.
2. Le risposte corrette delle verifiche e le relative spiegazioni sono deterministiche.
3. Il percorso deve essere testabile da stato vuoto fino a 8/8.
4. Il reset del localStorage deve riportare il prototipo allo stato iniziale.
5. La riproducibilità riguarda il comportamento del percorso, non l’identità grafica o testuale dell’interazione.

### Limiti attuali
Il prototipo usa localStorage: i progressi non sono sincronizzati tra dispositivi.
Google login non è implementato.
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

# Bottino Method — Corso Base
## Manifest di riproducibilità didattica

Versione frontend: v36
Release didattica: 1.0
Data baseline: 2026-10-07
Autore ed emittente: Michele Bottino
DOI corso: 10.5281/zenodo.23198223

### Percorso canonico
Introduzione
Unità 1 — Prima di credere, verifica
Esempio interattivo non valutato
Unità 2 — Fatto, affermazione, fonte e interpretazione
Unità 3 — Quanto possiamo realmente affermare?
Verifica 1 — 5 domande; superamento: almeno 4/5 (80%)
Unità 4 — Una fonte non vale l'altra
Unità 5 — Quando le fonti non concordano
Unità 6 — Il Bottino Method in pratica
Unità 7 — Intelligenza artificiale sotto controllo
Verifica 2 — 5 domande; superamento: almeno 4/5 (80%)
Unità 8 — Caso finale
Prova applicativa finale — 5 domande; superamento: almeno 4/5 (80%)
Completamento — 8/8 + entrambe le verifiche intermedie + prova finale superata

### Stato persistente della Release 1.0
bm_done = unità completate, 0..8
bm_check1 = percentuale Verifica 1
bm_check2 = percentuale Verifica 2
bm_final = percentuale Prova applicativa finale
bm_completed_at = timestamp ISO del completamento
bm_certificate_name = nome inserito volontariamente per l'attestato locale

I dati sopra sono conservati nel localStorage del browser. Non costituiscono uno stato server-side autorevole.

### Regole di progressione
Unità 4 bloccata finché Verifica 1 non è superata.
Unità 8 bloccata finché Verifica 2 non è superata.
La conclusione dell'Unità 8 è bloccata finché la prova applicativa finale non è superata.
Le prove non superate possono essere ripetute.
L'indicatore di avanzamento assegna 10% a ciascuna delle 8 unità e 10% a ciascuna delle due verifiche intermedie. La prova finale è un gate obbligatorio per completare l'Unità 8 e per rendere disponibile l'attestato.

### Materiali ufficiali Release 1.0
Il corpus pubblicato su Zenodo comprende:
BM-CB-01 — Guida al Corso Base
BM-CB-02 — Dispensa essenziale
BM-CB-03 — Quaderno degli esempi
BM-CB-04 — Scheda operativa
Documento principale della Release 1.0

La pagina del corso collega i cinque file del deposito Zenodo. Il DOI del corso è 10.5281/zenodo.23198223.

### Attestato
L'attestato della Release 1.0 è generato localmente nel browser. Riporta corso, Release 1.0, durata didattica di 190 minuti, valutazione, risultati sintetici, modalità di partecipazione, emittente, Italia, DOI, data di completamento e codice locale.
L'identità non è verificata nella Release 1.0 attualmente erogata.
Il codice locale non equivale a firma digitale, verifica pubblica o credenziale server-side.
L'attestato non costituisce titolo di studio, abilitazione o certificazione professionale riconosciuta.

### Backend di verifica
Il Credential Registry è sviluppato e collaudato separatamente, ma non è ancora collegato alla Release 1.0 pubblica. Finché Identity Gateway, Course Gateway e verifica pubblica non sono effettivamente distribuiti e collaudati, il frontend non deve dichiarare identità o completamento verificati server-side.

### Distinzione metodologica
La sequenza Acquisisci → Classifica → Verifica → Confronta → Concludi → Traccia è una semplificazione didattica del Corso Base. Le formulazioni sintetiche del corso non sostituiscono la trattazione metodologica completa nelle pubblicazioni di riferimento.

### Criteri minimi di riproducibilità
1. Stesso codice e stesso stato iniziale devono produrre la stessa progressione didattica.
2. Le risposte corrette delle verifiche e le relative spiegazioni sono deterministiche.
3. Il percorso deve essere testabile da stato vuoto fino al completamento 8/8.
4. Il reset del localStorage deve riportare il frontend allo stato iniziale.
5. L'attestato deve restare bloccato senza 8/8, entrambe le verifiche intermedie e prova finale superata.
6. La riproducibilità del frontend non equivale alla verifica dell'identità del discente.

### Test automatici
reproducibility-test.js verifica struttura, gate, completamento, attestato, DOI, corpus documentale e baseline v36.
e2e-state-test.js verifica la macchina degli stati dal nuovo studente al completamento persistente.

Comandi:
node reproducibility-test.js
node e2e-state-test.js

Baseline attesa:
REPRODUCIBILITY_TEST_OK
E2E_STATE_TEST_OK

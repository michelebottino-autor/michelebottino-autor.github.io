# Elena ADC — assistenza civica e aggiornamenti comunali

## Finalità e confini

L'assistente Elena sul sito ADC può indirizzare alle **informazioni pubbliche** del Comune di Calatabiano. Non rappresenta l'amministrazione, non prenota appuntamenti e non sostituisce il portale istituzionale.

La fonte primaria è `https://comune.calatabiano.ct.it/`. Recapiti e orari sono riportati con l'avviso o la scheda che li documenta. Gli orari non dimostrano che un ufficio sia aperto in quel momento: festività, modifiche e chiusure eccezionali richiedono riscontro sul portale.

## Componenti pubblici

- `elena-comune-fonti.json`: recapiti, uffici, orari e collegamenti istituzionali verificati.
- `elena-comune-news.json`: elenco sintetico di date, titoli e URL degli avvisi pubblicati dal Comune, senza copia del testo integrale.
- `elena-comune.js`: motore di risposte civiche, con selezione per argomento e limiti dichiarati.
- `elena-dialogo.js`: integra le risposte civiche con il motore documentario dell'ADC.
- `elena-presenza.js`: usa il medesimo motore nella finestra contestuale.
- `scripts/aggiorna_news_comune.py`: legge la pagina pubblica delle Novità, rifiuta URL esterni o date errate e aggiorna solo i metadati.
- `.github/workflows/elena-comune-news.yml`: pianifica tentativi alle 06:15, 12:15 e 18:15 **UTC**, oltre all'avvio manuale, secondo la disponibilità dei runner GitHub Actions.

## Garanzie

- Gli avvisi sono selezionati soltanto quando l'origine corrisponde esattamente al dominio istituzionale; non sono utilizzate fonti social non verificate.
- Le novità sono descritte come **pubblicazioni rilevate**, non come eventi attualmente in corso.
- Un elenco non verificato negli ultimi due giorni non è presentato come recente; al suo posto appare il collegamento al portale.
- I numeri diretti non verificati non sono inventati: Elena mostra il centralino generale e la directory degli uffici.
- L'acquisizione automatica non crea nuove risposte storiche, non conferisce validità ad atti scaduti e non aggiorna informazioni personali.
- Non viene scaricato alcun dato privato o contenuto di moduli riservati.

## Limitazioni e manutenzione

Il monitoraggio automatico riguarda **solo le novità istituzionali presenti nella prima pagina** del portale e può interrompersi se il Comune modifica il formato HTML o se GitHub Actions non esegue il workflow. Il funzionamento ricorrente del workflow deve essere verificato nei log GitHub. Non è un sistema di notizie in tempo reale né copre automaticamente tutte le associazioni, gli eventi privati, il traffico o le comunicazioni di altri enti.

Le variazioni dei recapiti e degli orari richiedono un controllo distinto e la revisione delle fonti in `elena-comune-fonti.json`. La disponibilità dell'applicazione nel browser richiede collaudi ulteriori su dispositivi mobili e desktop.

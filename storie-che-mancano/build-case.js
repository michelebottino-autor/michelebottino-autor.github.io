'use strict';
const fs=require('node:fs'),path=require('node:path');
const base=path.join(__dirname,'caso-modello');fs.mkdirSync(base,{recursive:true});
const d={
 id:"R-01",title:"Il quaderno di Nina",nature:"simulazione didattica integrale",
 warning:"Nina Valenti, i documenti e le testimonianze R-01 sono interamente inventati. Nessun dettaglio biografico è presentato come fatto storico reale.",
 purpose:"Mostrare come costruire un ritratto breve e dichiararne lacune, incertezze e cautele.",
 sources:[
 {id:"F1",type:"fotografia simulata",description:"Fotografia di un gruppo in un cortile. Sul retro si legge «Nina, estate», senza luogo, anno, attribuzione della grafia né identificazione delle persone.",observed:"È documentata soltanto la presenza di una nota e della scena rappresentata nella simulazione.",not_proved:"Identità certa di Nina nella fotografia, data, luogo o emozioni."},
 {id:"F2",type:"cartolina simulata",description:"Cartolina datata dal timbro «17 giugno 1965», firmata «Nina Valenti», con un cenno a una partenza in treno e al desiderio di rivedersi.",observed:"Il testo fittizio contiene la firma e un timbro del 1965.",not_proved:"Motivo del viaggio, luogo in cui Nina abitava, collegamento certo con F1."},
 {id:"F3",type:"quaderno simulato",description:"Quaderno con una prima pagina segnata «1968 — Nina V.» e una lista: treno, bottega, fili. Mancano cognome per esteso e prova della proprietà.",observed:"L'annotazione e l'elenco sono parte del facsimile inventato.",not_proved:"Che appartenga alla Nina di F2, professione o tragitto effettivo."},
 {id:"F4",type:"testimonianza simulata",description:"Nel 2022 una nipote immaginaria avrebbe ricordato che Nina portava spesso con sé un quaderno.",observed:"È una frase inventata per mostrare un ricordo tardivo attribuito.",not_proved:"La sua esattezza storica, identità dei quaderni, consenso di un testimone reale."},
 {id:"F5",type:"elenco simulato",description:"Una riga di un elenco immaginario di prestiti della biblioteca del 1966 riporta «N. Valenti» senza altri identificativi.",observed:"La sigla e il cognome appaiono nell'elenco immaginario.",not_proved:"Corrispondenza con Nina Valenti di F2, interesse stabile per la lettura o storia della biblioteca."}
 ],
 assertions:[
 {id:"A1",claim:"La foto F1 reca la nota «Nina, estate» senza anno.",references:["F1"],grade:"attestato_nella_simulazione"},
 {id:"A2",claim:"La cartolina F2 reca la firma «Nina Valenti» e un timbro del 17 giugno 1965.",references:["F2"],grade:"attestato_nella_simulazione"},
 {id:"A3",claim:"Il quaderno F3 porta la sigla «Nina V.» e una nota del 1968.",references:["F3"],grade:"attestato_nella_simulazione"},
 {id:"A4",claim:"La testimonianza F4 afferma che Nina portava un quaderno.",references:["F4"],grade:"ricordo_simulato_non_confermato"},
 {id:"A5",claim:"L'elenco F5 contiene «N. Valenti» nell'anno 1966.",references:["F5"],grade:"attestato_nella_simulazione"},
 {id:"Q1",claim:"La Nina di F1 e quella di F2 sono certamente la stessa persona?",references:["F1","F2"],grade:"non_accertato"},
 {id:"Q2",claim:"Il quaderno F3 apparteneva alla stessa Nina?",references:["F2","F3","F4"],grade:"non_accertato"}
 ],
 chronology:[
 {date:"Estate, anno sconosciuto",source:"F1",meaning:"Nota sul retro; identità e anno ignoti.",type:"data_incompleta"},
 {date:"17 giugno 1965",source:"F2",meaning:"Data del timbro sulla cartolina; non equivale alla data di ogni evento narrato.",type:"documentato_nella_simulazione"},
 {date:"1966",source:"F5",meaning:"Anno dell'elenco di prestiti con un nome abbreviato.",type:"documentato_nella_simulazione"},
 {date:"1968",source:"F3",meaning:"Data scritta sul quaderno, proprietà incerta.",type:"documentato_nella_simulazione"},
 {date:"2022",source:"F4",meaning:"Data di una memoria inventata e retrospettiva.",type:"riferito_nella_simulazione"}
 ],
 portrait:[
 {sources:["F1","Q1"],text:"Sul retro della fotografia qualcuno ha scritto due parole: «Nina, estate». La scrittura non è accompagnata da un anno. L'immagine mostra un gruppo riunito in un cortile, ma nessuna nota identifica con certezza i volti. Sarebbe facile sceglierne uno, immaginare un'infanzia, attribuire a quella persona una felicità appena suggerita dal gesto di chi le sta accanto. È proprio qui che comincia il nostro problema: una fotografia conserva un istante, non un'intera biografia. Possiamo descrivere ciò che appare e ciò che manca; non possiamo ancora dire chi fosse Nina."},
 {sources:["F2","A2"],text:"Una seconda traccia sembra dare consistenza al nome. Una cartolina reca la firma «Nina Valenti» e un timbro datato 17 giugno 1965. Nelle sue poche righe si accenna a un viaggio in treno e al desiderio di incontrare nuovamente il destinatario. Quel messaggio non rivela dove Nina abitasse stabilmente né per quale ragione si fosse spostata. Una data d'archivio non è una biografia; è un punto nel tempo sul quale si può costruire una domanda più precisa. La Nina della cartolina potrebbe essere la persona nominata sul retro della foto, ma nessuna prova nel fascicolo permette di unirle senza riserve."},
 {sources:["F5","Q1"],text:"L'anno successivo, almeno nell'ordine dei documenti del nostro esercizio, compare una voce diversa: «N. Valenti», scritta accanto a un prestito di biblioteca del 1966. È il genere di traccia che invita subito alla conclusione desiderata: quella donna amava leggere, frequentava la biblioteca e conservava i libri con cura. Il registro, tuttavia, porta solo un'iniziale e un cognome. Non possiamo accertare che appartengano alla stessa Nina, né da una singola annotazione dedurre un'abitudine personale. Il documento aggiunge un'ipotesi di ricerca, non una scena da raccontare come certa."},
 {sources:["F3","A3","Q2"],text:"Nel quaderno del 1968 la grafia cambia, e una sigla apre la prima pagina: «Nina V.». Seguono parole scarne, quasi promemoria: treno, bottega, fili. Non sappiamo chi abbia compilato la lista. Potrebbe registrare acquisti, spostamenti o semplici cose da ricordare. Non basta a trasformare Nina in una sarta, una commerciante o una viaggiatrice. Il ritratto può però sostare su questo elenco, seguirne l'ordine e lasciar intravedere la qualità materiale di una vita ordinaria, senza fissarne le caratteristiche che il fascicolo non ci consegna."},
 {sources:["F4","Q2"],text:"Nel nostro dossier compare infine la voce di una nipote immaginaria, che nel 2022 ricorderebbe una donna solita portare con sé un quaderno. Un ricordo pronunciato decenni dopo può essere prezioso, ma non coincide con una prova contemporanea. Per prima cosa dovremmo sapere di quale Nina parla, chi abbia raccolto il racconto, come sia stata posta la domanda e se la testimonianza possa essere pubblicata. Poiché questo è un esercizio completamente inventato, non vi sono persone da interpellare. L'assenza di una vera intervista impedisce di attribuire gesti, frasi o emozioni a una biografia storica."},
 {sources:["F1","F2","F3","F4","Q1","Q2"],text:"Che cosa resta, dunque, di Nina? Non una vita dalla nascita alla vecchiaia, e neppure il profilo certo di una persona unica. Restano una fotografia anonima con una nota, una cartolina firmata, un registro abbreviato, un quaderno dall'appartenenza dubbia e una memoria simulata. La loro successione mette in luce il modo in cui la documentazione può generare domande, ma anche quanto facilmente l'autore rischi di chiuderle troppo presto. Un ritratto responsabile non pretende di sapere tutto: sceglie un punto d'osservazione, espone il suo procedimento e lascia al lettore la possibilità di distinguere la traccia dal racconto."},
 {sources:["F1","F2","F3","F5"],text:"Se incontrassimo un archivio familiare reale, il lavoro continuerebbe chiedendo chi custodisce i documenti, chi ha scritto sul retro della fotografia e se esistono altre lettere, registri o testimonianze pertinenti. Confrontare le grafie e i nomi potrebbe confermare o separare le identità. Fino ad allora non uniremmo questi frammenti in un'unica vicenda certa. Questo testo mostra soltanto una scelta editoriale: il coraggio di fermarsi là dove la fonte tace. Il fascicolo è inventato, ma il problema di scrittura è autentico. Raccontare una vita significa anche riconoscere ciò che non siamo in grado di restituire."}
 ],
 assessment:"Il caso R-01 è un modello di studio, non un elaborato di uno studente verificato da un docente."
};
d.word_count=d.portrait.reduce((n,p)=>n+p.text.trim().split(/\s+/).length,0);
if(d.word_count<550||d.word_count>850)throw Error('Model word count '+d.word_count+' does not fit introductory assignment');
for(const p of d.portrait){if(!p.sources.every(id=>d.sources.some(s=>s.id===id)||d.assertions.some(a=>a.id===id)))throw Error('Bad source id');}
fs.writeFileSync(path.join(base,'dossier.json'),JSON.stringify(d,null,2)+'\n','utf8');
console.log('SIMULATED_BIOGRAPHY_CASE_READY: words='+d.word_count+' sources='+d.sources.length+' assertions='+d.assertions.length+' paras='+d.portrait.length);

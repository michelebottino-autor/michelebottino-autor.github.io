"use strict";
// Modulo separato: SOLO consultazione di citazioni bibliografiche attribuite.
// Nessuna modifica al corpus di Elena o alle sue autorizzazioni.
const RECORDS = Object.freeze([
{code:"P-001",key:["villa","terme"],page:31,text:"Gli autori riferiscono il rinvenimento di strutture termali riferite a una villa romana."},
{code:"P-002",key:["scavi","2014","2015","fiumefreddo"],page:31,text:"Lo studio colloca gli scavi della necropoli nel 2014–2015, a nord della foce del Fiumefreddo."},
{code:"P-003",key:["sepolture","individui"],page:33,text:"Gli autori riportano otto sepolture a inumazione e 25 individui nel contesto scavato."},
{code:"P-004",key:["usk 81","tomba viii"],page:33,text:"L'individuo USK 81 proviene dalla tomba VIII, trincea 2."},
{code:"P-005",key:["418","536","datazione","tomba vii"],page:33,text:"L'intervallo 418–536 d.C. (1σ) riguarda la vicina tomba VII; non è una datazione diretta della tomba VIII."},
{code:"P-006",key:["età","20","29"],page:34,text:"Per USK 81 gli autori stimano un'età al decesso fra 20 e 29 anni."},
{code:"P-007",key:["dieta","alimentazione","isotopi"],page:37,text:"Gli autori interpretano gli isotopi dell'individuo studiato come indicativi di una dieta prevalentemente terrestre e agropastorale."},
{code:"P-008",key:["decesso","morte","causa"],page:37,text:"Secondo lo studio non è possibile determinare con certezza la causa del decesso."}
]);
function consultazioneBibliograficaPianotta(question) {
 const q=String(question||"").toLocaleLowerCase("it");
 const matches=RECORDS.filter(r=>r.key.some(k=>q.includes(k))).slice(0,3);
 if(!matches.length)return {status:"NO_BIBLIOGRAPHIC_MATCH",answer:"La scheda bibliografica consultata non fornisce un riferimento puntuale per questa domanda.",sources:[]};
 return {status:"BIBLIOGRAPHIC_EXCERPT_NOT_SCIENTIFIC_APPROVAL",
 answer:matches.map(r=>r.text+" (Galassi et al., 2020, p. "+r.page+").").join(" "),
 sources:matches.map(r=>({code:r.code,author:"Galassi et al.",year:2020,printed_page:r.page,kind:"published_study_secondary_source"})),
 disclaimer:"Sintesi attribuita alla pubblicazione del 2020; non è una verifica archeologica indipendente."};
}
if(typeof module!=="undefined")module.exports={consultazioneBibliograficaPianotta};

if(typeof window!=="undefined")window.ElenaPianottaBibliografia=consultazioneBibliograficaPianotta;

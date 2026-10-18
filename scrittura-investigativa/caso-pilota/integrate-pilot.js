'use strict';
/* Safe, idempotent integration. Retains pre-existing exercises in an expandable archive. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const jsPath=path.join(root,'officina-percorso.js');
let code=fs.readFileSync(jsPath,'utf8');
function replaceOnce(s,needle,replacement){
 if(!s.includes(needle))throw new Error('Expected JS anchor not found: '+needle.slice(0,55));
 return s.replace(needle,replacement);
}
if(!code.includes('function archiveLegacyUnit()')){
 const marker="function renderUnit(course,u){";
 const extension=[
 "function archiveLegacyUnit(){",
 "  const h=main.querySelector('h1');",
 "  if(!h||!h.nextSibling)return null;",
 "  const legacy=E('details','studio-legacy');",
 "  const summary=E('summary','','Fondamenti di verifica e caso S-01 simulato · materiali facoltativi');",
 "  legacy.append(summary,para('Questa è la versione precedente delle esercitazioni di verifica documentaria. Rimane disponibile come approfondimento, ma la lezione principale è l’Officina dell’autore. Il caso S-01 è interamente fittizio.','studio-note'));",
 "  while(h.nextSibling)legacy.append(h.nextSibling);",
 "  h.insertAdjacentElement('afterend',legacy);",
 "  return legacy;",
 "}",
 ""].join('\n');
 code=replaceOnce(code,marker,extension+marker);
 code=replaceOnce(code,"function renderUnit(course,u){","function renderUnit(course,u){\n const archived=archiveLegacyUnit();");
 const old='const intro=main.querySelector("h1");if(intro)(intro.nextElementSibling||intro).insertAdjacentElement("afterend",sec);else if(workshop) main.insertBefore(sec,workshop);else main.append(sec);';
 const newer='const intro=main.querySelector("h1");if(intro)intro.insertAdjacentElement("afterend",sec);else main.append(sec);';
 code=replaceOnce(code,old,newer);
}
if(!code.includes("case-pilot-link-v1")){
 const anchor="const completed=course.units.filter(u=>ready(u.number)).length;";
 const adding=[
 "const pilot=E('p','studio-source');",
 "const pilotA=E('a','','Consulta il caso pilota su una pagina di giornale autentica →');",
 "pilotA.href='./caso-pilota/';",
 "pilot.append(pilotA);sec.append(pilot); // case-pilot-link-v1",
 ""].join('\n');
 code=replaceOnce(code,anchor,adding+anchor);
 const unitAnchor="const source=E('p','studio-source','Riferimento di lettura: ');";
 const unitAdd=[
 "const pilot=E('p','studio-source');",
 "const pilotA=E('a','','Vedi questa competenza applicata al caso pilota documentario →');",
 "pilotA.href='../caso-pilota/';pilot.append(pilotA);sec.append(pilot);",
 ""].join('\n');
 code=replaceOnce(code,unitAnchor,unitAdd+unitAnchor);
}
fs.writeFileSync(jsPath,code,'utf8');
const cssPath=path.join(root,'officina-percorso.css');
let css=fs.readFileSync(cssPath,'utf8');
if(!css.includes('.studio-legacy'))css+='\n.studio-legacy{border:1px solid #d7dbd4;border-radius:11px;background:#f9faf7;padding:18px;margin:25px 0 45px}.studio-legacy summary{font-weight:750;color:#345b4e;cursor:pointer;padding:7px 0}.studio-legacy[open] summary{border-bottom:1px solid #d7dbd4;margin-bottom:14px}.studio-legacy:focus-within{outline-offset:4px}\n';
fs.writeFileSync(cssPath,css,'utf8');
const indexPath=path.join(root,'index.html');
let html=fs.readFileSync(indexPath,'utf8');
if(!html.includes('caso-pilota-link-v1')){
 const anchor='<div class="unitlist">';
 if(!html.includes(anchor))throw Error('Course unitlist not found');
 const info='<section class="case" id="caso-pilota-link-v1"><h2>Un caso completo su una fonte autentica</h2><p>Dalla notizia alla costruzione di un articolo: dieci scelte editoriali applicate a un quotidiano storico del 1918, con matrice delle affermazioni e limiti dichiarati. La scansione resta da verificare integralmente.</p><p><a class="section-link" href="./caso-pilota/">Esamina il caso pilota documentario →</a></p></section>';
 html=html.replace(anchor,info+anchor);
}
fs.writeFileSync(indexPath,html,'utf8');
console.log('PILOT_INTEGRATION_OK: index link, unit links, legacy collapsed');
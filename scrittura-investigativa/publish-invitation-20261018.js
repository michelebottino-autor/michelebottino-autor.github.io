'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const c=path.join(__dirname,'index.html');
let h=fs.readFileSync(c,'utf8');
if(!h.includes('id="livello-formativo-20261018"')){
 const anchor='<div class="unitlist">';
 if(!h.includes(anchor))throw Error('Course unit list not found');
 const snippet='<section class="case" id="livello-formativo-20261018" aria-labelledby="scrittura-livello"><h2 id="scrittura-livello">Livello intermedio · scrivere opere documentate</h2><p>Il percorso si rivolge a chi desidera passare dalla ricerca alla stesura di un articolo, un\\u0027inchiesta circoscritta o un capitolo originale. Non è un corso per esperti e non ripete soltanto la verifica delle fonti.</p><p><strong>Requisiti obbligatori:</strong> nessun attestato precedente. Sono consigliati la comprensione di testi e una capacità iniziale di scrittura. Il <a href="../corso/">Corso Base del Bottino Method</a> è una preparazione facoltativa, non un prerequisito.</p><p><strong>Obiettivo finale:</strong> un testo di circa 900–1.500 parole, con fonti effettivamente consultate, scaletta e revisione. La classificazione è didattica interna, non un titolo professionale o livello EQF certificato.</p></section><section class="case" id="invito-sperimentazione-20261018" aria-labelledby="scrittura-invito"><h2 id="scrittura-invito">Cerchiamo volontari per una futura prova del corso</h2><p>È disponibile un invito pubblico alla sperimentazione gratuita per maggiorenni. Non sono ancora iniziate iscrizioni né prove con persone reali; non sono attivi attestati verificabili.</p><p><a href="sperimentazione/">Leggi come segnalare una disponibilità alla sperimentazione</a></p></section>';
 h=h.replace(anchor,snippet+anchor);
 fs.writeFileSync(c,h,'utf8');
}
const f=path.join(root,'formazione','index.html');
let formation=fs.readFileSync(f,'utf8');
if(!formation.includes('id="livello-scrittura-formazione-20261018"')){
 if(!formation.includes('</main>'))throw Error('Formazione markup missing');
 const note='<section class="notice" id="livello-scrittura-formazione-20261018"><h2>Scrittura Investigativa · livello intermedio</h2><p>Il corso di scrittura documentaria propone dieci unità pratiche e non richiede attestati precedenti. Le lezioni sono disponibili in versione pilota. È possibile manifestare interesse per una futura prova gratuita con volontari maggiorenni; non sono ancora attive iscrizioni o certificazioni.</p><p><a href="/scrittura-investigativa/sperimentazione/">Invito alla sperimentazione</a></p></section>';
 formation=formation.replace('</main>',note+'</main>');
 fs.writeFileSync(f,formation,'utf8');
}
const s=path.join(root,'sitemap.xml');
let xml=fs.readFileSync(s,'utf8');
const url='https://michelebottino-autor.github.io/scrittura-investigativa/sperimentazione/';
if(!xml.includes(url)){
 if(!xml.includes('</urlset>'))throw Error('Sitemap invalid');
 xml=xml.replace('</urlset>','  <url>\n    <loc>'+url+'</loc>\n    <lastmod>2026-10-18</lastmod>\n    <priority>0.5</priority>\n  </url>\n</urlset>');
 fs.writeFileSync(s,xml,'utf8');
}
console.log('COURSE_AND_FORMATION_INVITATION_LINKED; sitemap=ready; no student registration enabled');
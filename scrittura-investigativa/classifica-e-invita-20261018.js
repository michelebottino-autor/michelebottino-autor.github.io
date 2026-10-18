'use strict';
const fs=require('fs'),path=require('path');
const repo=path.resolve(__dirname,'..');
const cp=path.join(repo,'catalogo','corsi.json');
const sp=path.join(repo,'catalogo','scrittura-investigativa-programma.json');
const cat=JSON.parse(fs.readFileSync(cp,'utf8'));
const item=cat.courses.find(x=>x.id==='scrittura-investigativa-documentale');
if(!item||item.level!=='Intermedio')throw Error('Existing classification has changed');
item.level_details={
 classification:'intermedio',status:'classificazione_didattica_interna',
 mandatory_previous_course:false,
 required_certificates:[],
 recommended_skills:['Leggere e sintetizzare testi in italiano','Redigere testi brevi','Riconoscere la differenza fra documento, fatto e interpretazione'],
 target:'Opera documentaria originale di 900–1500 parole con fonti e revisione',
 professional_license:false
};
item.pilot_recruitment={status:'invitation_only',participants_confirmed:0,participants_tested:0,applications_backend:false,url:'../scrittura-investigativa/sperimentazione/'};
fs.writeFileSync(cp,JSON.stringify(cat,null,2)+'\n','utf8');
const syllabus=JSON.parse(fs.readFileSync(sp,'utf8'));
if(syllabus.level!=='intermedio'||syllabus.units.length!==10)throw Error('Syllabus mismatch');
syllabus.level_details={
 classification:'intermedio',
 framework:'classificazione didattica interna, non certificazione professionale né qualifica EQF',
 mandatory_prerequisites:[],
 recommended_competences:['Leggere e sintetizzare testi in italiano','Scrivere testi brevi','Avere familiarità con fonti e interpretazioni'],
 optional_preparation:'Bottino Method — Corso Base, facoltativo',
 final_output:'Articolo o capitolo originale di 900–1500 parole con fonti, scaletta e revisione',
 advanced_scope_excluded:'Non si richiede la gestione professionale di inchieste multilivello o di responsabilità editoriali complesse'
};
syllabus.participant_pilot={status:'invitation_open_pilot_not_started',confirmed_people:0,formal_assessment_active:false,url:'../scrittura-investigativa/sperimentazione/'};
fs.writeFileSync(sp,JSON.stringify(syllabus,null,2)+'\n','utf8');
console.log('COURSE_LEVEL_CONFIRMED=INTERMEDIO; no mandatory prerequisites, not a professional title.');
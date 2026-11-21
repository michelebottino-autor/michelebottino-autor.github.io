#!/usr/bin/env node
// ADC Memorie — console redazionale LOCALE. Non memorizza credenziali.
// Node.js 20+. Uso: node redazione-cli.mjs elenco | leggi ID | stato ID NUOVO_STATO | elimina ID
import {createInterface} from 'node:readline/promises';
import {stdin,stdout,stderr} from 'node:process';

const api='https://adc-memorie-api.darkaronteanonymous-72c.workers.dev';
const [command,id,arg]=process.argv.slice(2);
const permitted=['elenco','leggi','stato','elimina'];
const idValid=(s)=>/^ADC-MEM-[a-f0-9-]{36}$/i.test(s||'');
const stateValid=(s)=>['in_revisione','approvata','pubblicata','ritirata','respinta'].includes(s);
if(!permitted.includes(command)||(command!=='elenco'&&!idValid(id))||(command==='stato'&&!stateValid(arg))){
 stderr.write('Uso: node redazione-cli.mjs elenco | leggi ID | stato ID NUOVO_STATO | elimina ID\n');
 process.exitCode=2;
}else{
 let rl;
 let token='';
 try{
  // Digitare soltanto su un terminale locale sicuro. Non inserire il token negli argomenti.
  if(!stdin.isTTY)throw Error('È necessario un terminale interattivo locale.');
  stdout.write('Token redazione (input nascosto): ');
  token=await new Promise((resolve,reject)=>{
   let value='';const previous=stdin.isRaw;
   stdin.setRawMode(true);stdin.resume();stdin.setEncoding('utf8');
   const key=(str)=>{
    if(str==='\u0003'){stdin.off('data',key);stdin.setRawMode(previous);reject(Error('Annullato'));return}
    if(str==='\r'||str==='\n'){stdin.off('data',key);stdin.setRawMode(previous);stdout.write('\n');resolve(value);return}
    if(str==='\u007f'||str==='\b'){value=value.slice(0,-1);return}
    if(str.length===1&&str.charCodeAt(0)>=32)value+=str;
   };
   stdin.on('data',key);
  });
  if(token.length<32)throw Error('Token non valido.');
  rl=createInterface({input:stdin,output:stdout});
  const ask=async(question)=>await rl.question(question);
  let method='GET',path='/v1/redazione/elenco',body;
  if(command!=='elenco')path='/v1/redazione/'+id;
  if(command==='stato'){
   method='PATCH';const testo=arg==='pubblicata'?await ask('Testo pubblico approvato (una riga): '):'';
   const note=await ask('Nota redazionale (facoltativa): ');
   if(arg==='pubblicata'&&!testo.trim())throw Error('Testo pubblico obbligatorio per la pubblicazione');
   body=JSON.stringify({stato:arg,testo_pubblico:testo,note_redazionali:note});
  }
  if(command==='elimina'){
   const ok=await ask('Eliminazione IRREVERSIBILE. Riscrivi l’ID esatto per confermare: ');
   if(ok!==id)throw Error('Eliminazione annullata');
   method='DELETE';
  }
  const res=await fetch(api+path,{method,headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},body,signal:AbortSignal.timeout(20000)});
  const data=await res.json();
  if(!res.ok)throw Error('HTTP '+res.status+': '+(data.error||'Richiesta non completata'));
  // Risultati visibili soltanto nel terminale locale autorizzato.
  stdout.write(JSON.stringify(data,null,2)+'\n');
 }catch(err){stderr.write('Errore: '+err.message+'\n');process.exitCode=1}
 finally{token='';rl?.close()}
}

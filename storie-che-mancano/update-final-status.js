(function updateStatus(){
 const fs=require('fs'),path=require('path'),root=__dirname;
 const dest=path.join(root,'caso-modello','valutazione','index.html');
 let html=fs.readFileSync(dest,'utf8');
 if(!html.includes('registro-revisione-proposto.json')){
  const anchor='<section class="panel"><h2>Come migliorare il testo</h2>';
  if(!html.includes(anchor))throw Error('Missing revision section');
  html=html.replace(anchor,'<section class="panel"><h2>Tre proposte di revisione</h2><p>Nel <a href="../registro-revisione-proposto.json">registro di riscrittura proposto</a> sono confrontati passaggi effettivamente presenti nel ritratto con possibili riformulazioni. Non è un diario retrospettivo di bozze già modificate, né una valutazione umana.</p></section>'+anchor);
  fs.writeFileSync(dest,html,'utf8');
 }
 const status=path.join(root,'STATO_PILOTA.md');let text=fs.readFileSync(status,'utf8');
 if(!text.includes('## Aggiornamento editoriale')){
  const lines=[
'','## Aggiornamento editoriale del 18 ottobre 2026','',
'- Laboratorio autentico LOC-01: esercizio con quattro record della Library of Congress su Mary Church Terrell (fotografia, diario, corrispondenza, guida istituzionale); otto schede distinguono dati del catalogo e questioni non accertate.',
'- Limite delle fonti: metadati e descrizioni istituzionali controllati; non è stata eseguita una collazione integrale di tutte le pagine manoscritte con le scansioni. Il materiale è un esercizio di lettura dei cataloghi, non una biografia storica completa.',
'- Rubrica esemplificativa R-01: 77/100 come revisione redazionale assistita da IA del modello di 641 parole. Non è un esame né una validazione umana. Le fonti del caso R-01 sono ancora tutte inventate.',
'- Tre proposte di riscrittura sono registrate come proposte, non come modifiche già effettuate.',
'- Stato invariato: in_development nel catalogo e in_review per la lingua italiana. Nessuna iscrizione o attestazione attiva, nessuno studente reale collaudato.',
'','Fonti LOC: https://www.loc.gov/item/97500102/ ; https://www.loc.gov/item/mss425490004/ ; https://www.loc.gov/item/mss425490031/ ; https://www.loc.gov/collections/mary-church-terrell-papers/about-this-collection/',
'','Laboratorio: https://michelebottino-autor.github.io/storie-che-mancano/laboratorio-autentico/',
'Valutazione: https://michelebottino-autor.github.io/storie-che-mancano/caso-modello/valutazione/',''];
  fs.writeFileSync(status,text+lines.join('\n'),'utf8');
 }
 console.log('BIOGRAPHY_EDITORIAL_STATUS_AND_REVISION_LOG_READY');
})();
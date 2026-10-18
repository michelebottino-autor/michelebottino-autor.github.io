const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
fs.copyFileSync(path.join(root,'storie-che-mancano','assets','site.css'),path.join(__dirname,'assets','site.css'));
let js=fs.readFileSync(path.join(root,'storie-che-mancano','assets','officina.js'),'utf8');
js=js.replaceAll('scom_memorie_intro_2026_v1_','scom_archivio_intermedio_2026_v1_').replaceAll('Le storie che mancano','L’archivio diventa racconto').replaceAll('storie-che-mancano','archivio-vivo').replaceAll('unità con appunti locali','unità con note di lavoro');
fs.writeFileSync(path.join(__dirname,'assets','officina.js'),js,'utf8');
console.log('ISOLATED_ARCHIVE_ASSETS_READY');

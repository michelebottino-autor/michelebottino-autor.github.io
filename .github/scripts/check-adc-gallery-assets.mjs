// Controllo deterministico della galleria ADC: esistenza asset e coerenza dei filtri.
// Non valida attribuzioni storico-artistiche, diritti fotografici o resa visiva.
import fs from 'node:fs';
import path from 'node:path';

const directory = 'adc/chiese/schede/maria-santissima-annunziata/galleria';
const html = fs.readFileSync(path.join(directory, 'index.html'), 'utf8');
const match = html.match(/const works=(\[[\s\S]*?\]);\s*const \$=/);
if (!match) throw new Error('Catalogo fotografico non trovato o formato inatteso');
const works = JSON.parse(match[1]);
const categories = new Set([...html.matchAll(/<option value="([^"]+)"/g)].map(m => m[1]));
const photoNumbers = [];
const references = new Set();
let errors = [];

for (const work of works) {
  if (!categories.has(work.category)) errors.push('Categoria non selezionabile: ' + work.category);
  if (!Array.isArray(work.photos) || !work.photos.length) errors.push('Scheda senza fotografie: ' + work.id);
  for (const photo of work.photos ?? []) {
    photoNumbers.push(photo.n);
    for (const k of ['original', 'hd', 'web', 'thumb']) {
      const rel = photo[k];
      if (typeof rel !== 'string' || !/^(originali|hd|web|anteprime)\/[\w.-]+\.(jpg|jpeg|png|webp)$/i.test(rel)) {
        errors.push('Percorso non valido: ' + work.id + '/' + k);
        continue;
      }
      const f = path.join(directory, rel);
      if (!fs.existsSync(f)) errors.push('File assente: ' + f);
      if (references.has(rel)) errors.push('Percorso duplicato: ' + rel);
      references.add(rel);
    }
  }
}
if (new Set(photoNumbers).size !== photoNumbers.length) errors.push('Numeri delle fotografie duplicati');
const sorted = [...photoNumbers].sort((a,b)=>a-b);
if (sorted.some((n,i)=>n!==i+1)) errors.push('Sequenza numerica delle fotografie non continua da 1');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Galleria ADC verificata: ' + works.length + ' schede, ' + photoNumbers.length + ' fotografie, ' + references.size + ' file collegati, 0 errori.');
}

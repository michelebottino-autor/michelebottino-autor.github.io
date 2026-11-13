// Rigenera esclusivamente i tre fogli CSS aggregati della homepage ADC.
// Le sorgenti originali restano condivise con le altre pagine del sito.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const groups = [
  {
    output: "adc/assets/adc-home-base-bundle.css",
    sources: ["site-uniform.css", "adc/condividi.css", "adc/tipografia.css"]
  },
  {
    output: "adc/assets/adc-home-identita-bundle.css",
    sources: ["adc/identita-2026.css", "adc/assets/elena-presenza.css", "adc/assets/ricerca-home-2026.css", "adc/assets/foto-territorio.css"]
  },
  {
    output: "adc/assets/adc-home-sezioni-bundle.css",
    sources: ["assets/css/nav-unificata-2026.css", "assets/css/editoriale-mockup-approvato.css", "assets/css/mockup-sezioni-2026.css"]
  }
];
for (const group of groups) {
  const sources = group.sources.map(p => ({ p, content: fs.readFileSync(path.join(root, p), "utf8") }));
  for (const source of sources) {
    if (/@import|@charset/i.test(source.content)) throw new Error("Controllare direttive CSS in " + source.p);
    for (const match of source.content.matchAll(/url\s*\(\s*['"]?([^'")]+)/gi)) {
      if (!/^(\/|data:|https?:|#)/i.test(match[1].trim())) throw new Error("URL relativo in " + source.p);
    }
  }
  const combined = "/* ADC — foglio aggregato, ordine delle regole invariato. Originali preservati nel repository. */\n"
    + sources.map(({p,content}) => `\n/* Sorgente: /${p} */\n${content}\n`).join("\n");
  const destination = path.join(root, group.output);
  if (process.argv.includes("--check")) {
    if (fs.readFileSync(destination, "utf8") !== combined) throw new Error("Bundle non aggiornato: " + group.output);
    console.log("OK " + group.output);
  } else {
    fs.writeFileSync(destination, combined, "utf8");
    console.log("Aggiornato " + group.output);
  }
}

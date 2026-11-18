"use strict";
(() => {
  const root = document.querySelector("[data-aegis-key]");
  if (!root) return;
  const pinned = root.dataset.aegisKey.toLowerCase();
  const site = root.dataset.aegisSite || location.hostname;
  const status = document.querySelector("#aegis-status");
  const detail = document.querySelector("#aegis-detail");
  const count = document.querySelector("#aegis-count");
  const inspected = document.querySelector("#aegis-time");
  const list = document.querySelector("#aegis-files");
  const run = document.querySelector("#aegis-run");
  const exportButton = document.querySelector("#aegis-export");
  const trust = document.querySelector("#aegis-fingerprint");
  trust.textContent = pinned;
  let report = null;
  const hex = array => Array.from(new Uint8Array(array), b => b.toString(16).padStart(2,"0")).join("");
  const digest = async data => hex(await crypto.subtle.digest("SHA-256", data));
  const get = async file => {
    const response = await fetch("/aegis/" + file, {cache:"no-store",redirect:"error"});
    if (!response.ok) throw Error("Impossibile leggere " + file + " (HTTP " + response.status + ")");
    return new Uint8Array(await response.arrayBuffer());
  };
  const pemBytes = value => {
    const stripped = value.replace(/-----[^-]+-----/g,"").replace(/\s/g,"");
    return Uint8Array.from(atob(stripped), x => x.charCodeAt(0));
  };
  const fileBytes = async file => {
    if (!/^[a-z0-9][a-z0-9._\/-]*$/i.test(file) || file.includes("..") || file.startsWith("/")) throw Error("Percorso non valido nel registro");
    const response = await fetch("/" + file, {cache:"no-store",redirect:"error"});
    if (!response.ok) throw Error(file + ": HTTP " + response.status);
    return new Uint8Array(await response.arrayBuffer());
  };
  const setStatus = (kind, title, description) => {
    status.dataset.state = kind;
    status.textContent = title;
    detail.textContent = description;
  };
  const addItem = (filename, valid) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = filename;
    const value = document.createElement("strong");
    value.textContent = valid ? "Conforme" : "Differente";
    value.className = valid ? "good" : "bad";
    li.append(label,value);
    list.appendChild(li);
  };
  async function check() {
    run.disabled = true;
    exportButton.disabled = true;
    report = null;
    list.replaceChildren();
    count.textContent = "—";
    inspected.textContent = "—";
    setStatus("checking","Verifica in corso","Confronto dei file con il registro firmato.");
    const now = new Date().toISOString();
    try {
      if (!crypto.subtle) throw Error("Questo browser non supporta Web Crypto");
      const [rawManifest,rawSignature,rawPublic] = await Promise.all([
        get("trustprint-manifest.json"), get("trustprint-signature.txt"), get("trustprint-public.pem")
      ]);
      const decoder = new TextDecoder();
      const spki = pemBytes(decoder.decode(rawPublic));
      const keyFingerprint = await digest(spki);
      if (keyFingerprint !== pinned) throw Error("Chiave pubblica diversa da quella prevista dal pannello");
      const key = await crypto.subtle.importKey("spki",spki,{name:"Ed25519"},false,["verify"]);
      const signature = Uint8Array.from(atob(decoder.decode(rawSignature).trim()),x=>x.charCodeAt(0));
      const signatureValid = await crypto.subtle.verify("Ed25519",key,signature,rawManifest);
      if (!signatureValid) throw Error("Firma digitale del registro non valida");
      const manifest = JSON.parse(decoder.decode(rawManifest));
      if (manifest.format !== "arontaeigis-trustprint-1" || manifest.algorithm !== "Ed25519") throw Error("Formato non riconosciuto");
      const entries = Object.entries(manifest.files || {});
      if (!entries.length || entries.length > 1000) throw Error("Numero di file nel registro non valido");
      let differences = 0;
      for (const [filename,expected] of entries) {
        let valid = false;
        try {
          const bytes = await fileBytes(filename);
          valid = bytes.byteLength === expected.bytes && await digest(bytes) === expected.sha256;
        } catch (_) { valid = false; }
        if (!valid) differences++;
        addItem(filename, valid);
      }
      count.textContent = String(entries.length);
      inspected.textContent = new Date().toLocaleString("it-IT");
      const ok = differences === 0;
      setStatus(ok ? "ok" : "warning",ok ? "Integrità verificata" : "Differenze rilevate",
        ok ? "I file controllati corrispondono al registro firmato." :
          differences + " file non corrispondono alla versione firmata. Verificare se sono stati aggiornati in modo autorizzato.");
      report = {site,checkedAt:now,signatureValid:true,fingerprint:keyFingerprint,checkedFiles:entries.length,differences,passed:ok};
    } catch(error) {
      setStatus("error","Verifica non completata",error.message || "Errore sconosciuto");
      report = {site,checkedAt:now,passed:false,error:String(error.message||error)};
    } finally {
      run.disabled = false;
      exportButton.disabled = false;
    }
  }
  run.addEventListener("click",check);
  exportButton.addEventListener("click",() => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report,null,2)+"\n"],{type:"application/json"});
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href=href; link.download="aegis-verifica.json"; document.body.append(link); link.click(); link.remove();
    setTimeout(()=>URL.revokeObjectURL(href),1000);
  });
  check();
})();
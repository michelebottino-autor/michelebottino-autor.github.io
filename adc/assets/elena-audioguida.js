(() => {
  'use strict';

  const player = document.getElementById('elena-audio-player');
  if (!player) return;

  const previous = document.getElementById('elena-prev');
  const next = document.getElementById('elena-next');
  const status = document.getElementById('elena-audio-status');
  let parts = [];
  let current = 0;

  function showPart() {
    status.textContent = `Parte ${current + 1} di ${parts.length}`;
    previous.disabled = current === 0;
    next.disabled = current === parts.length - 1;
  }

  function selectPart(index, resume) {
    current = index;
    player.src = parts[current];
    showPart();
    if (resume) {
      player.play().catch(error => {
        if (current === index && error.name !== 'AbortError') {
          status.textContent += ' · Premi Riproduci per continuare.';
        }
      });
    }
  }

  previous.addEventListener('click', () => selectPart(current - 1, !player.paused));
  next.addEventListener('click', () => selectPart(current + 1, !player.paused));
  player.addEventListener('ended', () => {
    if (current + 1 < parts.length) {
      selectPart(current + 1, true);
    } else if (parts.length) {
      status.textContent = 'Audioguida terminata.';
    }
  });
  player.addEventListener('error', () => {
    status.textContent = 'Questa parte non è disponibile. Ricarica la pagina o scegli un’altra parte.';
    status.parentElement.hidden = false;
  });
  window.addEventListener('pagehide', () => player.pause());

  async function loadParts() {
    const directory = new URL('.', player.src);
    const response = await fetch(new URL('audioguida.json', directory));
    if (!response.ok) throw new Error('Audioguida non disponibile');

    const { parts: entries } = await response.json();
    if (!Array.isArray(entries) || entries.length === 0 ||
        entries.some(entry => !/^elena-\d+\.mp3$/.test(entry?.path)) ||
        new URL(entries[0].path, directory).href !== player.src) {
      throw new Error('Indice audio non valido');
    }
    parts = entries.map(entry => new URL(entry.path, directory).href);
    showPart();
    status.parentElement.hidden = false;
    // The visitor may have finished the first track before the list arrived.
    if (player.ended && parts.length > 1) selectPart(1, true);
  }

  loadParts().catch(() => {
    status.textContent = 'Puoi ascoltare la prima parte. Ricarica la pagina per consultare le altre.';
    status.parentElement.hidden = false;
  });
})();

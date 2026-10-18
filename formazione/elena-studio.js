/* Elena — guida documentaria al Corso Base. Solo risposte editoriali approvate. */
(() => {
  'use strict';
  const section = document.getElementById('elena-corso');
  if (!section) return;
  const select = section.querySelector('#elena-corso-domanda');
  const answer = section.querySelector('#elena-corso-risposta');
  const button = section.querySelector('#elena-corso-consulta');
  const notice = section.querySelector('#elena-corso-stato');
  if (!select || !answer || !button || !notice) return;
  const showStatus = (text) => { notice.textContent = text; };
  const field = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = text;
    return el;
  };
  const appendLabelled = (label, value) => {
    const p = document.createElement('p');
    p.append(field('strong', '', label + ' '), document.createTextNode(value));
    answer.append(p);
  };
  const sourceLink = (url, title) => {
    if (!/^\/corso\/(?:#(?:dashboard|materials))?$/.test(url)) return null;
    const a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    return a;
  };
  const load = async () => {
    try {
      const response = await fetch('/formazione/elena-studio.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('Archivio non raggiungibile');
      const doc = await response.json();
      if (doc.schema_version !== 1 || !Array.isArray(doc.courses)) throw new Error('Dati non compatibili');
      const course = doc.courses.find(item => item.id === 'bottino-method-base');
      if (!course || !Array.isArray(course.topics) || course.topics.length !== 8) throw new Error('Schede incomplete');
      const unitIds = new Set(course.topics.map(t => t.unit));
      if (unitIds.size !== 8) throw new Error('Unità duplicate');
      select.replaceChildren(field('option', '', 'Scegli una domanda'));
      select.firstElementChild.value = '';
      course.topics.forEach((topic, i) => {
        const o = field('option', '', 'Unità ' + topic.unit + ' · ' + topic.question);
        o.value = String(i);
        select.append(o);
      });
      const show = () => {
        const pos = Number(select.value);
        if (!select.value || !Number.isInteger(pos) || pos < 0 || pos >= course.topics.length) {
          showStatus('Seleziona una domanda per consultare la guida.');
          answer.hidden = true;
          answer.replaceChildren();
          return;
        }
        const t = course.topics[pos];
        answer.replaceChildren();
        answer.append(field('h3', '', t.question), field('p', '', t.answer));
        appendLabelled('Esercizio:', t.exercise);
        appendLabelled('Da ricordare:', t.limitation);
        const p = document.createElement('p');
        p.className = 'elena-corso-source';
        const a1 = sourceLink(course.source.page, 'Riapri il percorso didattico');
        const a2 = sourceLink(course.source.material, 'Consulta i materiali ufficiali');
        if (a1 && a2) p.append(a1, document.createTextNode(' · '), a2);
        answer.append(p);
        answer.hidden = false;
        showStatus('Scheda editoriale della Unità ' + t.unit + '.');
      };
      button.addEventListener('click', show);
      select.addEventListener('change', show);
      button.disabled = false;
      select.disabled = false;
      showStatus('Otto domande, una per unità. Le risposte rimandano alle lezioni e ai materiali pubblicati.');
    } catch (err) {
      button.disabled = true;
      select.disabled = true;
      answer.hidden = true;
      showStatus('La guida non è temporaneamente disponibile. Puoi continuare a studiare direttamente le lezioni.');
    }
  };
  load();
})();

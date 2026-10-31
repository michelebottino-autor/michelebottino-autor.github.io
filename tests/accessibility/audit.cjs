const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const pages = ['/', '/adc/', '/accessibilita/', '/privacy/', '/cookie/'];
(async () => {
 const browser = await chromium.launch({ headless: true });
 let failures = 0;
 for (const path of pages) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
   const response = await page.goto('http://127.0.0.1:8765' + path, { waitUntil: 'domcontentloaded' });
   if (!response || !response.ok()) throw new Error('HTTP non valido');
   const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
   console.log(path, 'violazioni:', result.violations.length, 'incomplete:', result.incomplete.length);
   for (const violation of result.violations) {
    console.log(' -', violation.id, violation.impact, violation.nodes.length, violation.help);
    for (const node of violation.nodes.slice(0, 10)) console.log('   selector:', node.target.join(', '), 'html:', node.html.slice(0, 280), 'summary:', node.failureSummary?.slice(0, 400));
   }
   if (result.violations.length) failures++;
  } catch (error) { failures++; console.error(path, error.message); }
  await context.close();
 }
 await browser.close();
 if (failures) { console.error('Audit automatico: pagine con problemi:', failures); process.exitCode = 1; }
 else console.log('Nessuna violazione automatica rilevata nelle pagine campione. Verifiche manuali ancora necessarie.');
})().catch(e => { console.error(e); process.exitCode = 1; });

#!/usr/bin/env node
// Report-only design audit. Does not rewrite historical/editorial pages.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../..');
const out=[];
function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){if(d.name==='.git'||d.name==='node_modules')continue;const p=path.join(dir,d.name);if(d.isDirectory())walk(p);else if(d.isFile()&&/\.html$/i.test(d.name)){const x=fs.readFileSync(p,'utf8');if(!/<html\b/i.test(x))continue;const src=path.relative(root,p).replace(/\\/g,'/');const adc=src.startsWith('adc/');const css=[...x.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*>/gi)].map(z=>z[0].match(/\bhref=["']([^"']+)/i)?.[1]).filter(Boolean);const blocks=[...x.matchAll(/<style\b[^>]*>/gi)].length;const common=adc?css.some(v=>/adc\/identita-2026\.css|adc\/assets\/adc-unificato\.css/.test(v)):css.some(v=>/site-uniform\.css/.test(v));out.push({path:src,section:adc?'adc':'author',common_style:common,css_links:css.length,inline_style_blocks:blocks,legacy_inline:blocks>1,has_viewport:/name=["']viewport["']/i.test(x),has_main:/<main\b/i.test(x),has_header:/<header\b/i.test(x),has_footer:/<footer\b/i.test(x)})}}}
walk(root);out.sort((a,b)=>a.path.localeCompare(b.path));
const anomalies=out.filter(x=>!x.common_style||!x.has_viewport||!x.has_main||x.legacy_inline);
const summary={total_pages:out.length,adc_pages:out.filter(x=>x.section==='adc').length,author_pages:out.filter(x=>x.section==='author').length,without_shared_style:out.filter(x=>!x.common_style).length,without_viewport:out.filter(x=>!x.has_viewport).length,without_main:out.filter(x=>!x.has_main).length,multiple_inline_blocks:out.filter(x=>x.legacy_inline).length};
console.log(JSON.stringify({summary,anomalies},null,2));
if(process.argv.includes('--require-shared')&&summary.without_shared_style)process.exitCode=1;

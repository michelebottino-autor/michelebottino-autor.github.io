#!/usr/bin/env python3
"""Build a public, reviewed editorial text corpus for Elena ADC.
Never extracts unsupported claims or marks a modern editorial answer as a literal source transcription.
"""
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'adc'/'assets'
def read(name):
    return json.loads((ASSETS/name).read_text(encoding='utf-8'))
def build():
    answers=read('elena-risposte-approvate.json')['answers']
    knowledge=read('elena-conoscenza-verificata.json')['entries']
    approved={a['id']:a for a in answers if a.get('status')=='APPROVED_FOR_PUBLICATION'}
    entries=[]
    for k in knowledge:
        if k.get('status')!='APPROVED_FOR_PUBLICATION': continue
        parent=approved.get(k.get('source_answer_id'))
        if parent is None: raise ValueError('Unlinked editorial unit: '+str(k.get('id')))
        for key in ['id','subject','answer','evidence_limitations','evidence_status','reviewer','reviewed_at','review_rationale']:
            if not isinstance(k.get(key),str) or not k[key].strip(): raise ValueError('Missing '+key)
        if k['evidence_status'] not in ('EDITION_TEXT_CHECKED','IMAGE_COLLATED','ORIGINAL_COLLATED','SOURCE_IDENTIFIED'):raise ValueError('Invalid evidence state')
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}',k['reviewed_at']):raise ValueError('Invalid approval date')
        sources=k.get('sources')
        if not isinstance(sources,list) or not sources:raise ValueError('Missing sources')
        for source in sources:
            if any(not isinstance(source.get(x),str) or not source[x].strip() for x in ('title','url','page','source_type')):raise ValueError('Incomplete source')
            if not re.fullmatch(r'/adc/[a-z0-9/_-]+/',source['url']):raise ValueError('Non-ADC source route')
            if not any(all(source[x]==p.get(x) for x in ('url','page','source_type')) for p in parent.get('sources',[])):raise ValueError('Source is not approved')
        if not isinstance(k.get('keywords'),list) or not k['keywords']:raise ValueError('No keywords')
        entries.append({
            'id':k['id'],'title':k['subject'],'text':k['answer'],
            'text_type':'editorial_summary','transcription':False,
            'approval_id':parent['id'],'reviewed_at':k['reviewed_at'],
            'evidence_status':k['evidence_status'],'limitations':k['evidence_limitations'],
            'keywords':k['keywords'],'sources':sources
        })
    entries.sort(key=lambda x:x['id'])
    if len({x['id'] for x in entries})!=len(entries):raise ValueError('Duplicate IDs')
    return {'schema':1,'kind':'editorial-corpus','description':'Testi redazionali approvati ADC; non trascrizioni diplomatiche o letture automatiche degli originali.','entries':entries}
def main():
    output=ASSETS/'elena-corpus-documentario.json'
    generated=json.dumps(build(),ensure_ascii=False,indent=2)+'\n'
    if '--check' in sys.argv:
        if not output.exists() or output.read_text(encoding='utf-8')!=generated:
            raise SystemExit('Corpus not up to date: run build_elena_corpus.py')
        print('CORPUS_CHECK_OK')
    else:
        output.write_text(generated,encoding='utf-8',newline='\n')
        print('CORPUS_WRITTEN',len(build()['entries']))
if __name__=='__main__':main()

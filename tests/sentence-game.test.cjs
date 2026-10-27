const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const env={window:{}};
vm.createContext(env);
vm.runInContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),env);
vm.runInContext(fs.readFileSync(path.join(root,'sentence-game.js'),'utf8'),env);
const m=env.window.VerbSentenceGame.model;
const D=env.window.VERB_DATA;
let count=0;
for(const t of m.templates)for(const subject of m.subjects){
  const card=m.makeCard(t,subject);
  assert.equal(card.answer.verb,D.verbs.find(v=>v.verb===t.verb).forms[subject.row]);
  for(const part of ['subject','verb','object']){
    assert.ok(card.options[part].includes(card.answer[part]),`${part} answer missing`);
    assert.equal(new Set(card.options[part]).size,card.options[part].length,'Duplicate answer choices');
    const wrong={...card.answer,[part]:card.options[part].find(v=>v!==card.answer[part])};
    assert.equal(m.evaluate(card,wrong).correct,false);
    assert.equal(m.evaluate(card,wrong).matches[part],false);
  }
  assert.equal(m.evaluate(card,card.answer).correct,true);
  assert.equal(m.evaluate(card,{...card.answer,object:''}).complete,false);
  assert.ok(!/^You.*\b(has|does|prepares|eats|reads|writes)\b/.test(card.english),'English you must use base form');
  count++;
}
for(let k=0;k<30;k++)for(const [focus,length] of [['1',10],['2',6],['all',10]]){
  const cards=m.createRound(focus);
  assert.equal(cards.length,length);
  assert.equal(new Set(cards.map(c=>c.template.verb)).size,length,'Do not repeat templates within a round');
  if(focus!=='all')assert.ok(cards.every(c=>c.verb.module===Number(focus)));
}
const formal=m.makeCard(m.templates.find(t=>t.verb==='tener'),m.subjects.find(s=>s.spanish==='Usted'));
assert.equal(formal.answer.verb,'tiene');
assert.equal(formal.english,'You (one person, formal) have a passport.');
const she=m.makeCard(m.templates[0],m.subjects.find(s=>s.spanish==='Ella'));
assert.equal(she.english,'She prepares dinner.');
assert.equal(she.answer.verb,'prepara');
console.log(`Passed ${count} sentence/subject combinations, single-part mistakes, incomplete checks, formal you, English agreement, and 90 randomized rounds.`);

const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const sandbox = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),sandbox);
const d = JSON.parse(JSON.stringify(sandbox.window.VERB_DATA));
assert.equal(d.verbs.length,40);
assert.equal(d.verbs.filter(v=>v.module===1).length,27);
assert.equal(d.verbs.filter(v=>v.module===2).length,13);
assert.equal(d.vocabulary.length,60);
assert.equal(new Set(d.verbs.map(v=>v.verb)).size,40);
assert.equal(new Set(d.vocabulary.map(v=>v.id)).size,60);
for(const topic of d.topics){
  const rows=d.vocabulary.filter(v=>v.topic===topic.id);
  assert.equal(rows.length,12);
  assert.equal(new Set(rows.map(v=>v.english)).size,12,'Quiz choices must have distinct meanings');
}
for(const v of d.verbs){
  assert.equal(v.forms.length,5);
  assert.ok(v.context&&v.contextGloss,'Every verb needs a sentence clue');
  if(v.module===1) assert.deepEqual(v.forms,d.endings[v.group].map(e=>v.verb.slice(0,-2)+e));
}
const expected={jugar:['juego','juegas','juega','jugamos','juegan'],dormir:['duermo','duermes','duerme','dormimos','duermen'],preferir:['prefiero','prefieres','prefiere','preferimos','prefieren'],salir:['salgo','sales','sale','salimos','salen']};
for(const [verb,forms] of Object.entries(expected)) assert.deepEqual(d.verbs.find(v=>v.verb===verb).forms,forms);
for(const v of d.vocabulary){assert.ok(v.spanish&&v.english&&v.example&&v.translation);assert.ok(v.example.endsWith('.'));}
const original=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/original-verbs.json'),'utf8'));
for(const [verb,forms] of Object.entries(original))assert.deepEqual(d.verbs.find(v=>v.verb===verb).forms,forms);
console.log('Passed: counts, theme coverage, unique quiz meanings, regular/irregular forms, contextual examples, and all 21 original verb forms preserved.');

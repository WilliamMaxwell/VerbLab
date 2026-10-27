const {spawnSync}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const scripts=['data.js','app.js','vocabulary.js','sentence-game.js','tools/content-inventory.cjs','tools/check.cjs'];
for(const file of scripts){
  const result=spawnSync(process.execPath,['--check',path.join(root,file)],{stdio:'inherit',windowsHide:true});
  if(result.error){console.error(result.error.message);process.exit(1);}
  if(result.status!==0)process.exit(result.status||1);
}
for(const file of ['tests/content.test.cjs','tests/sentence-game.test.cjs']){
  const result=spawnSync(process.execPath,[path.join(root,file)],{stdio:'inherit',windowsHide:true});
  if(result.error){console.error(result.error.message);process.exit(1);}
  if(result.status!==0)process.exit(result.status||1);
}
console.log('All syntax and content/model checks passed. Browser QA remains separate.');

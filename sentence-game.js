(() => {
  'use strict';
  const D = window.VERB_DATA;
  const safe = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const subjects = [
    {spanish:'Yo',english:'I',row:0},
    {spanish:'Tú',english:'You (one person, informal)',row:1},
    {spanish:'Él',english:'He',row:2},
    {spanish:'Ella',english:'She',row:2},
    {spanish:'Usted',english:'You (one person, formal)',row:2},
    {spanish:'Nosotros',english:'We',row:3},
    {spanish:'Ellos',english:'They',row:4},
    {spanish:'Ustedes',english:'You all',row:4}
  ];
  // Objects stay attached to a specific meaning, so every prompt has one match.
  const templates = [
    {verb:'preparar',base:'prepare',third:'prepares',object:'la cena',englishObject:'dinner'},
    {verb:'comer',base:'eat',third:'eats',object:'el desayuno',englishObject:'breakfast'},
    {verb:'leer',base:'read',third:'reads',object:'un libro',englishObject:'a book'},
    {verb:'escribir',base:'write',third:'writes',object:'una tarjeta',englishObject:'a card'},
    {verb:'abrir',base:'open',third:'opens',object:'la maleta',englishObject:'the suitcase'},
    {verb:'recibir',base:'receive',third:'receives',object:'un regalo',englishObject:'a gift'},
    {verb:'limpiar',base:'clean',third:'cleans',object:'la cocina',englishObject:'the kitchen'},
    {verb:'lavar',base:'wash',third:'washes',object:'los platos',englishObject:'the dishes'},
    {verb:'visitar',base:'visit',third:'visits',object:'el museo',englishObject:'the museum'},
    {verb:'dibujar',base:'draw',third:'draws',object:'una casa',englishObject:'a house'},
    {verb:'cocinar',base:'cook',third:'cooks',object:'el almuerzo',englishObject:'lunch'},
    {verb:'compartir',base:'share',third:'shares',object:'la comida',englishObject:'the food'},
    {verb:'escuchar',base:'listen to',third:'listens to',object:'música',englishObject:'music'},
    {verb:'aprender',base:'learn',third:'learns',object:'español',englishObject:'Spanish'},
    {verb:'hacer',base:'do',third:'does',object:'los quehaceres',englishObject:'the household chores'},
    {verb:'poner',base:'set',third:'sets',object:'la mesa',englishObject:'the table'},
    {verb:'tener',base:'have',third:'has',object:'un pasaporte',englishObject:'a passport'},
    {verb:'pedir',base:'ask for',third:'asks for',object:'el almuerzo',englishObject:'lunch'},
    {verb:'preferir',base:'prefer',third:'prefers',object:'el tren',englishObject:'the train'},
    {verb:'querer',base:'want',third:'wants',object:'un regalo',englishObject:'a gift'}
  ];
  const shuffle = items => {
    const result = [...items];
    for (let i=result.length-1;i>0;i--) {const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  };
  function makeCard(template,subject) {
    const verb = D.verbs.find(v => v.verb === template.verb);
    // Usted uses a third-person Spanish form, but English "you" uses the base verb.
    const englishVerb = subject.english === 'He' || subject.english === 'She' ? template.third : template.base;
    return {template,subject,verb,
      english:`${subject.english} ${englishVerb} ${template.englishObject}.`,
      answer:{subject:subject.spanish,verb:verb.forms[subject.row],object:template.object},
      options:{subject:shuffle([subject.spanish,...shuffle(subjects.map(s=>s.spanish).filter(s=>s!==subject.spanish)).slice(0,3)]),verb:shuffle([...new Set(verb.forms)]),object:shuffle([template.object,...shuffle([...new Set(templates.map(t=>t.object))].filter(o=>o!==template.object)).slice(0,3)])},
      selected:{subject:'',verb:'',object:''},checked:false,hinted:false};
  }
  function evaluate(card,selection) {
    const parts = ['subject','verb','object'];
    const complete = parts.every(p=>Boolean(selection[p]));
    const matches = Object.fromEntries(parts.map(p=>[p,selection[p]===card.answer[p]]));
    return {complete,matches,correct:complete && parts.every(p=>matches[p])};
  }
  function createRound(focus) {
    const eligible = templates.filter(t=>focus==='all'||D.verbs.find(v=>v.verb===t.verb).module===Number(focus));
    // Repeat subjects across different cards while keeping each round's templates distinct.
    const people = shuffle(subjects);
    return shuffle(eligible).slice(0,10).map((t,i)=>makeCard(t,people[i%people.length]));
  }
  let round = null, focus = '1';
  const content = () => document.querySelector('#content');
  const focusPrompt = () => document.querySelector('#matching-prompt')?.focus();
  const heading = () => `<div class="section-top"><div><h2>Build the sentence.</h2><p class="lead">Read the English card. Match one subject, one verb, and one object.</p></div><span class="tag">SENTENCE MATCH</span></div>`;
  const sentence = c => `${c.answer.subject} ${c.answer.verb} ${c.answer.object}.`;
  function render() { if (!round) intro(); else if (round.index >= round.cards.length) results(); else cardView(); }
  function intro() {
    content().innerHTML = heading()+`<div class="practice-intro"><strong>Three pieces. One sentence.</strong><br>“She prepares dinner.” → Ella + prepara + la cena.<br>Choose from each list, then check your match. Read the explanation and retry missed cards at the end.</div><label class="answer-label" for="sentence-focus">Choose your verbs</label><select id="sentence-focus"><option value="1"${focus==='1'?' selected':''}>Regular verbs · 10 cards</option><option value="2"${focus==='2'?' selected':''}>Irregular verbs · 6 cards</option><option value="all"${focus==='all'?' selected':''}>Mix regular and irregular · 10 cards</option></select><div class="actions"><button class="primary" id="start-sentences">Start matching →</button></div><p class="note">No timer. This game uses present-tense sentences and a selection of the app’s verbs. Game scores stay separate from your saved verb totals. English “you” prompts say whether they mean one person, formal/informal, or a group.</p>`;
    document.querySelector('#sentence-focus').onchange=e=>{focus=e.target.value;};
    document.querySelector('#start-sentences').onclick=()=>{round={cards:createRound(focus),index:0,correct:0,missed:[],retry:false};render();focusPrompt();};
  }
  function choices(c,part,title,number) {
    return `<fieldset class="match-list"><legend><span>${number}</span> ${title}</legend>${c.options[part].map((value,i)=>`<label class="match-choice${c.selected[part]===value?' chosen':''}"><input type="radio" name="match-${part}" value="${safe(value)}"${c.selected[part]===value?' checked':''}${c.checked?' disabled':''}><span lang="es">${safe(value)}</span></label>`).join('')}</fieldset>`;
  }
  function feedback(c) {
    const result=evaluate(c,c.selected);
    const names={subject:'Subject',verb:'Verb',object:'Object'};
    return `<strong>${result.correct?'Three for three. You’ve got it!':'Let’s put the pieces together.'}</strong><ul>${Object.keys(names).map(part=>`<li>${result.matches[part]?'✓':'↻'} ${names[part]}: <span lang="es">${safe(c.answer[part])}</span>${part==='subject'?' = '+safe(c.subject.english):part==='object'?' = '+safe(c.template.englishObject):' matches '+safe(c.subject.spanish)}</li>`).join('')}</ul><p class="match-answer" lang="es">${safe(sentence(c))}</p><p>${safe(c.verb.module===1?`For ${c.subject.spanish.toLowerCase()}, keep ${c.verb.verb.slice(0,-2)}- and add -${D.endings[c.verb.group][c.subject.row]}.`:c.verb.hint)}</p>`;
  }
  function cardView() {
    const c=round.cards[round.index];
    content().innerHTML = heading()+`<div class="question-head"><span>${round.retry?'RETRY YOUR MISSED CARDS':'ENGLISH → SPANISH'}</span><span>Card ${round.index+1} of ${round.cards.length}</span></div><div class="bar"><div style="width:${100*round.index/round.cards.length}%"></div></div><div class="english-flashcard"><span class="eyebrow">CAN YOU BUILD THIS IN SPANISH?</span><h3 lang="en" id="matching-prompt" tabindex="-1">${safe(c.english)}</h3></div><form id="sentence-form"><div class="match-columns">${choices(c,'subject','Subject','01')}${choices(c,'verb','Conjugated verb','02')}${choices(c,'object','Object','03')}</div><div class="sentence-preview" aria-live="polite" aria-label="Your Spanish sentence" lang="es"></div><div class="actions"><button class="primary" type="submit" id="check-sentence"${c.checked?' disabled':''}>Check my match</button><button class="secondary" type="button" id="sentence-hint"${c.checked?' hidden':''}>Give me a hint</button></div></form><div id="sentence-hint-text" class="hint"${c.hinted?'':' hidden'}>Start with who is doing it. The starting verb is <strong lang="es">${safe(c.verb.verb)}</strong> (${safe(c.verb.meaning)}). The object answers “what?”: ${safe(c.template.englishObject)}.</div><div id="sentence-feedback" role="status" aria-live="polite"${c.checked?' class="feedback'+(evaluate(c,c.selected).correct?'':' retry')+'"':''}>${c.checked?feedback(c):''}</div><div class="actions"><button class="primary" id="next-sentence"${c.checked?'':' hidden'}>${round.index===round.cards.length-1?'See my round →':'Next card →'}</button><button class="text-button" id="end-sentences">End game</button></div>`;
    const updatePreview = () => {document.querySelector('.sentence-preview').textContent=`${c.selected.subject||'Subject'} + ${c.selected.verb||'verb'} + ${c.selected.object||'object'}`;};
    updatePreview();
    document.querySelectorAll('#sentence-form input[type="radio"]').forEach(input=>input.onchange=()=>{
      if(c.checked)return;
      c.selected[input.name.slice(6)]=input.value;
      document.querySelectorAll('.match-choice').forEach(label=>label.classList.toggle('chosen',label.querySelector('input').checked));
      updatePreview();document.querySelector('#sentence-feedback').textContent='';document.querySelector('#sentence-feedback').className='';
    });
    document.querySelector('#sentence-form').onsubmit=e=>{
      e.preventDefault();if(c.checked)return;
      const result=evaluate(c,c.selected);
      if(!result.complete){const message=document.querySelector('#sentence-feedback');message.className='feedback retry';message.textContent='Choose one option from each of the three lists first. Your score has not changed.';return;}
      c.checked=true;if(result.correct)round.correct++;else round.missed.push(c);
      cardView();document.querySelector('#next-sentence').focus();
    };
    document.querySelector('#sentence-hint').onclick=()=>{c.hinted=true;document.querySelector('#sentence-hint-text').hidden=false;};
    document.querySelector('#next-sentence').onclick=()=>{if(!c.checked)return;round.index++;render();focusPrompt();};
    document.querySelector('#end-sentences').onclick=()=>{if(confirm('End this matching round and return to setup?')){round=null;render();}};
  }
  function results() {
    content().innerHTML=heading()+`<h3 class="subheading">${round.retry?'Another step forward.':'Matching round complete.'}</h3><div class="result-number">${round.correct}<span style="font-size:25px;color:var(--muted)"> / ${round.cards.length}</span></div><p class="lead">Complete sentences matched on your first check${round.retry?' in this retry round':''}, including checks after hints. ${round.missed.length?'Review the sentences below, then try them again.':'Say one sentence out loud and explain its verb ending.'}</p>${round.missed.length?`<div class="match-review">${round.missed.map(c=>`<article><p>${safe(c.english)}</p><strong lang="es">${safe(sentence(c))}</strong></article>`).join('')}</div>`:''}<div class="actions">${round.missed.length?'<button class="primary" id="retry-sentences">Retry missed cards →</button>':''}<button class="secondary" id="new-sentences">Choose another round</button></div><p class="note">Matching scores are for this game only; they do not change your saved conjugation practice totals.</p>`;
    if(document.querySelector('#retry-sentences'))document.querySelector('#retry-sentences').onclick=()=>{round={cards:shuffle(round.missed).map(c=>makeCard(c.template,c.subject)),index:0,correct:0,missed:[],retry:true};render();focusPrompt();};
    document.querySelector('#new-sentences').onclick=()=>{round=null;render();};
  }
  window.VerbSentenceGame={render,model:{subjects,templates,makeCard,evaluate,createRound}};
})();

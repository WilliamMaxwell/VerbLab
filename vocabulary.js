(() => {
  'use strict';
  const D = window.VERB_DATA;
  const safe = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle = items => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  let topic = 'identity', mode = 'list', card = 0, revealed = false, quiz = null;
  let root;
  const selection = () => D.vocabulary.filter(v => topic === 'all' || v.topic === topic);
  const topicName = () => D.topics.find(t => t.id === topic)?.title || 'All five themes';
  const sourceNote = () => `<details class="note"><summary>How these words connect to class</summary><p>These practice words follow the five themes in Wilton’s publicly linked <a href="${D.curriculum.url}" target="_blank" rel="noopener">2024 Spanish 7 outline</a>: identity, family celebrations, living spaces and chores, routines, and travel. They are selected practice vocabulary, not an official teacher word list. The course also includes reflexives and past tense; this app keeps verb practice in the present tense.</p></details>`;
  function render() {
    root = document.querySelector('#content');
    root.innerHTML = `<div class="section-top"><div><h2>Words you can use.</h2><p class="lead">${D.verbs.length} verbs + ${D.vocabulary.length} vocabulary terms and phrases.<br>Learn a few words, then use them in a sentence.</p></div><span class="tag">GRADE 7 THEMES</span></div>
      <label class="vocab-topic-label" for="vocab-topic">Choose a theme</label><select id="vocab-topic"><option value="all"${topic === 'all' ? ' selected' : ''}>All five themes · 60 entries</option>${D.topics.map(t => `<option value="${t.id}"${t.id === topic ? ' selected' : ''}>${safe(t.title)} · 12 entries</option>`).join('')}</select>
      <div class="pill-row vocab-modes" role="group" aria-label="Vocabulary activity">${[['list','Word list'],['cards','Flashcards'],['quiz','Quick check']].map(([id,label]) => `<button class="pill ${id === mode ? 'active' : ''}" data-vmode="${id}" aria-pressed="${id === mode}">${label}</button>`).join('')}</div><div id="vocab-body"></div>${sourceNote()}`;
    root.querySelector('#vocab-topic').onchange = e => {
      topic = e.target.value; card = 0; revealed = false; quiz = null; render();
    };
    root.querySelectorAll('[data-vmode]').forEach(b => b.onclick = () => {
      mode = b.dataset.vmode; render();
    });
    if (mode === 'list') list();
    if (mode === 'cards') cards();
    if (mode === 'quiz') quiz ? showQuiz() : quizStart();
  }
  const body = () => root.querySelector('#vocab-body');
  function list() {
    const rows = selection();
    body().innerHTML = `<div class="vocab-list-head"><h3>${safe(topicName())}</h3><button class="secondary" id="print-vocab">Print this word list</button></div><p class="note">Learn nouns with el, la, or los. Adjectives ending in -o often change to -a for a feminine noun: simpático → simpática. For trabajador, use trabajadora.</p>
      <div class="vocab-list">${rows.map(v => `<article class="vocab-entry"><div><strong lang="es">${safe(v.spanish)}</strong><span>${safe(v.english)}</span></div><p lang="es">${safe(v.example)}</p><p class="vocab-translation">${safe(v.translation)}</p></article>`).join('')}</div>`;
    root.querySelector('#print-vocab').onclick = () => {
      document.body.classList.add('printing-vocabulary');
      window.print();
      document.body.classList.remove('printing-vocabulary');
    };
  }
  function cards() {
    const rows = selection(), v = rows[card];
    body().innerHTML = `<p class="question-head"><span>${safe(topicName())}</span><span>Card ${card + 1} of ${rows.length}</span></p><div class="vocab-card"><p class="eyebrow">SAY THE MEANING BEFORE YOU REVEAL</p><h3 lang="es">${safe(v.spanish)}</h3><div class="vocab-reveal" aria-live="polite">${revealed ? `<strong>${safe(v.english)}</strong><p lang="es">${safe(v.example)}</p><p>${safe(v.translation)}</p>` : '<p>What does this word or phrase mean?</p>'}</div><button class="primary" id="reveal-word">${revealed ? 'Hide meaning' : 'Reveal meaning'}</button></div><div class="actions"><button class="secondary" id="previous-card"${card === 0 ? ' disabled' : ''}>← Previous</button><button class="secondary" id="next-card">${card === rows.length - 1 ? 'Back to first card' : 'Next card →'}</button></div>`;
    root.querySelector('#reveal-word').onclick = () => {revealed = !revealed; cards();};
    root.querySelector('#previous-card').onclick = () => {card = Math.max(0, card - 1); revealed = false; cards();};
    root.querySelector('#next-card').onclick = () => {card = (card + 1) % rows.length; revealed = false; cards();};
  }
  function quizStart() {
    body().innerHTML = `<div class="practice-intro"><strong>Recognize the meaning.</strong><br>Ten short questions from ${safe(topicName().toLowerCase())}. Choose the English meaning, read a sentence, then try any missed words again.</div><button class="primary" id="start-vocab">Start vocabulary check →</button><p class="note">Vocabulary checks are separate from your saved verb practice totals. Changing the theme starts a fresh check.</p>`;
    root.querySelector('#start-vocab').onclick = () => {
      quiz = {items: shuffle(selection()).slice(0,10), index:0, correct:0, missed:[], responses:[], retry:false}; showQuiz();
    };
  }
  function showQuiz() {
    if (quiz.index >= quiz.items.length) { quizResults(); return; }
    const q = quiz.items[quiz.index];
    if (!q.options) q.options = shuffle([q.english, ...shuffle(D.vocabulary.filter(v => v.topic === q.topic && v.id !== q.id)).slice(0,3).map(v => v.english)]);
    const response = quiz.responses[quiz.index];
    body().innerHTML = `<div class="question-head"><span>${quiz.retry ? 'RETRY CHECK' : 'VOCABULARY CHECK'}</span><span>${quiz.index+1} of ${quiz.items.length}</span></div><p class="eyebrow">CHOOSE THE ENGLISH MEANING</p><h3 class="prompt" lang="es">${safe(q.spanish)}</h3><div class="vocab-options">${q.options.map((a,i) => `<button class="secondary" data-choice="${i}"${response ? ' disabled' : ''}>${safe(a)}</button>`).join('')}</div><div id="vocab-feedback" role="status" aria-live="polite"></div><button class="primary" id="vocab-next"${response ? '' : ' hidden'}>${quiz.index === quiz.items.length - 1 ? 'See results →' : 'Next word →'}</button>`;
    const feedback = () => {
      const ok = quiz.responses[quiz.index].ok;
      root.querySelector('#vocab-feedback').className = 'feedback'+(ok ? '' : ' retry');
      root.querySelector('#vocab-feedback').innerHTML = `<strong>${ok ? 'You’ve got it.' : 'Save this one for another try.'} ${safe(q.spanish)} = ${safe(q.english)}</strong><span lang="es">${safe(q.example)}</span><br>${safe(q.translation)}`;
    };
    root.querySelectorAll('[data-choice]').forEach(b => b.onclick = () => {
      if (quiz.responses[quiz.index]) return;
      const ok = q.options[Number(b.dataset.choice)] === q.english;
      quiz.responses[quiz.index] = {ok};
      if (ok) quiz.correct++; else quiz.missed.push(q);
      root.querySelectorAll('[data-choice]').forEach(x => {x.disabled = true;});
      feedback();root.querySelector('#vocab-next').hidden = false;root.querySelector('#vocab-next').focus();
    });
    root.querySelector('#vocab-next').onclick = () => {quiz.index++; showQuiz();};
    if (response) feedback();
  }
  function quizResults() {
    body().innerHTML = `<h3 class="subheading">${quiz.retry ? 'Another step forward.' : 'Vocabulary check complete.'}</h3><div class="result-number">${quiz.correct}<span style="font-size:25px"> / ${quiz.items.length}</span></div><p class="lead">${quiz.missed.length ? 'Read these words once more, then try again.' : 'Nice work. Say one example sentence out loud.'}</p>${quiz.missed.length ? `<div class="table-wrap"><table><thead><tr><th>SPANISH</th><th>ENGLISH</th></tr></thead><tbody>${quiz.missed.map(v=>`<tr><td lang="es">${safe(v.spanish)}</td><td>${safe(v.english)}</td></tr>`).join('')}</tbody></table></div>` : ''}<div class="actions">${quiz.missed.length ? '<button class="primary" id="retry-vocab">Retry missed words →</button>' : ''}<button class="secondary" id="another-vocab">Choose another check</button></div>`;
    if (root.querySelector('#retry-vocab')) root.querySelector('#retry-vocab').onclick = () => {
      quiz = {items:shuffle(quiz.missed),index:0,correct:0,missed:[],responses:[],retry:true};showQuiz();
    };
    root.querySelector('#another-vocab').onclick = () => {quiz = null; quizStart();};
  }
  window.VerbVocabulary = {render};
})();

# Quality evidence, limitations, and next steps

## What has actually been checked

This record distinguishes implementation checks from language/curriculum review.
Desktop browser checks were performed during the original feature work; they
are not an automated browser suite or proof that every device works.

| Area | Completed evidence |
| --- | --- |
| Core conjugation | Regular round with one intentional error produced 9/10; missed-form retry produced 1/1 without changing original totals |
| Core navigation | Answer/lock state preserved when opening a guide and returning; corrected a duplicate-scoring risk during development |
| Accents | Missing accent produced an unscored reminder; corrected form accepted in an irregular round |
| Vocabulary | Reveal/next, theme choice, one intentional error, 9/10 results, missed-word retry, mode navigation preserving response |
| Sentence game | All 160 template/subject combinations checked structurally; regular/irregular focus selection and randomized rounds checked |
| Sentence game UI | Incomplete check unscored; per-part feedback; answered state across navigation; 9/10 full round and 1/1 retry |
| Theme/layout | Wilton desktop views and matching three-column layout visually inspected |
| PDFs | Original 11 pages rendered and visually reviewed; revised worksheet/key pages re-rendered |
| Deployments | Vocabulary, Wilton theme, and Match deployments succeeded and were verified on the custom HTTPS domain |

The original typed conjugation tests and model checks lived only in the working
chat directory. This documentation milestone makes the reusable content/model
checks available as portable repository files.

For this documentation milestone, the portable runner and both checks were run
successfully. The preserved PDF generator was syntax-checked only; it was not
executed, no new PDFs were rendered, and the original PDF assets were not changed.
Cross-platform font discovery in that helper still needs testing on another OS.

## Automated checks now in the repository

Run:

```sh
node tools/check.cjs
```

The runner uses only Node built-ins. It syntax-checks browser scripts and tools,
then runs:

- `tests/content.test.cjs`: release counts, unique verb/entry IDs, theme coverage,
  distinct meanings within a topic, five forms per verb, regular ending agreement,
  known added irregular forms, contexts/examples, and the original 21 forms.
- `tests/sentence-game.test.cjs`: all 160 sentence/subject combinations, included
  and distinct options, component mistakes, incomplete evaluation, English
  agreement for you, the formal-usted row, one known example, and 90 randomized
  regular/irregular/mixed rounds.

These tests validate structure, important agreement cases, and consistency with
the authored forms. They cannot independently establish that every translation
is idiomatic or that an authored base form is correct. A consistent wrong answer
in both data and UI may pass. The DOM, focus, printing, localStorage exceptions,
and complete scoring flows still need browser checks.

Expected counts are a checkpoint, not a ban on expansion. Update expected
counts/labels deliberately when extending the curriculum, and regenerate the
inventory. Keep the original-form fixture as a regression reference unless an
actual language correction warrants changing it.

## Manual checks for an interaction release

1. Open a fresh local HTTP origin; verify initial rendering and all activity tabs.
2. Change subject/verb in the Learn builder and verify the table highlight.
3. In Practice, check empty, correct, incorrect, accent-only, hinted, and repeated
   submissions. Navigate away/return, complete a round, retry, and reload.
4. Verify only completed original core rounds update persistent totals. Confirm
   reset behavior, and test storage-unavailable behavior when relevant.
5. In Vocabulary, test each theme, all-themes selection, reveal/previous/wrap,
   one incorrect quiz answer, mode/tab navigation, retry, and a printed list.
6. In Match, test incomplete selection, one wrong component, an all-correct
   answer, lock state on return, hint state, end/reset, all focus modes, and retry.
7. Check keyboard navigation, radio arrow keys, visible focus, status reading,
   narrow layouts, and all PDF links on the intended student device.
8. After deployment, verify the exact changed feature at the production domain.

Use disposable local test state rather than clearing real student data merely
to run a check. Do not describe a verification that was not actually performed.

## Known implementation limitations

| Limitation | Practical consequence / possible future work |
| --- | --- |
| Only aggregate core totals persist | No saved per-word history, vocabulary/matching progress, or in-progress recovery |
| No account/backend/sync | Progress differs by browser/profile/origin; teachers cannot inspect a class |
| Hints/diacritic corrections can count as correct core answers | Totals are supported practice, not independent mastery |
| Vocabulary recognition quiz | Correct choices do not establish production skill |
| Exact answers and constrained matching subjects | No alternate translations, whole-sentence parsing, or feminine we/they choices in Match |
| Five-row present-tense design | Other tenses, reflexives, vosotros/vos require explicit product/data changes |
| Hardcoded group labels and topic counts | Content expansion needs coordinated source/menu/test/doc updates |
| No undersized-topic guard | Small custom word banks can yield fewer distractors; validate before adding them |
| No deep links/history routing | Activity state is not represented in URLs |
| No designed offline/PWA mode | Hosted availability depends on fetching the static site; local copies are an alternative |
| CSS layers accumulated over time | Later overrides and literal colors require care during redesign |
| Browser fonts come from Google | Extra external requests; self-host/system-font option could be evaluated |
| PDFs still cover the starter corpus | Expanded vocabulary/game content is not a full new workbook |
| Root deployment includes developer files | Keep all repository material appropriate for public serving, or design runtime-only packaging |

The app code has no student-name/email collection, analytics calls, or account
service. Browser-local totals are not sent by the application code. Azure/GitHub
and optional font providers may have their own request logging; do not promise
that no external service receives network metadata. There has been no formal
district privacy, security, or accessibility approval.

## Faculty pilot: proposed, not completed

The prior recommendation was to demonstrate the app to one interested Spanish
teacher, review content/devices, then try a small two-week pilot. No faculty
review, student roster, schoolwide assignment, or pilot outcome is recorded.

Before a pilot:

1. Have a Spanish teacher review translations, accepted forms, sentence objects,
   distractors, lesson sequence, and the current classroom word list.
2. Test actual school Chromebooks and accessibility needs, including keyboard
   operation, smaller viewports, assistive technology, and printing.
3. Prepare a short teacher-facing use guide and clearly explain score/storage
   limits. Existing parent materials are useful but are not a full teacher guide.
4. Decide what evidence to collect. A brief delayed recall/transfer check is more
   informative than enthusiasm or a single supported practice score alone.

Potential later work, subject to user/teacher priorities: persistent activity
history, teacher-authored unit sets, explicit independent checks, improved
content import/review, richer feedback, updated printables, and expanded grammar.
Accounts, cloud storage, dashboards, and classroom data handling are separate
architecture decisions, not automatically part of the next release.

Keep the focus on dependable learning activities. The user's separate grades
3-8 math idea should become its own app/repository rather than broadening Verb Lab.

# Architecture and runtime contracts

## Shape of the system

```text
GitHub main → GitHub Actions → Azure Static Web Apps → browser
                                                       |
                    index.html loads deferred scripts in order:
                    data.js → vocabulary.js → sentence-game.js → app.js
                                                       |
                    shared #content panel + browser-local state
```

There is no framework, bundler, package manifest, npm dependency tree, server
API, database, service worker, or application account system. The browser fetches
static assets and optional fonts. The hosted version needs a network connection
to initially fetch its files; ordinary browser caching is not a designed offline
mode. An extracted complete local copy can run directly from `index.html`.

## File ownership

| File | Responsibility |
| --- | --- |
| `index.html` | App shell, header, Wilton identity, sidebar modules, activity navigation, script/style URLs |
| `style.css` | Base layout, vocabulary styles, Wilton overrides, matching styles, responsive/print rules |
| `data.js` | Assigns `window.VERB_DATA`; forms, translations, contexts, topics, curriculum metadata |
| `app.js` | Core IIFE/controller, Learn and Practice views, totals, routing between activities, PDF links |
| `vocabulary.js` | Vocabulary list/cards/quiz IIFE; exposes `window.VerbVocabulary.render` |
| `sentence-game.js` | Matching content and logic; exposes `window.VerbSentenceGame.render` and `.model` |
| `*.pdf` | Static foundation materials downloaded by Print & keep |
| `.github/workflows/azure-static-web-apps-lemon-ground-0f356a60f.yml` | Production deployment and PR preview workflow |
| `tools/`, `tests/` | Development checks, generated inventory, foundation-PDF source; not loaded by the app |

All three activity scripts rely on `VERB_DATA` already existing. `app.js` calls
its initial `render()` immediately, so the optional activity globals must also
be loaded before it. Keep the scripts deferred and preserve their order.

## Core controller: app.js

Private state: `module` (1 or 2), `view`, irregular subgroup `irgroup`, conjugation
`session`, aggregated `stats`, and a `persist` availability flag.

`render()` updates navigation and totals, then dispatches:

| View value | Renderer |
| --- | --- |
| `learn` | `learnRegular()` / `learnIrregular()` according to module |
| `practice` | `practice()`, resuming its session if one exists |
| `vocabulary` | `window.VerbVocabulary.render()` |
| `matching` | `window.VerbSentenceGame.render()` |
| `print` | `printPage()` |

Activity tabs preserve the core session. Clicking a sidebar module asks for
confirmation if an unfinished core conjugation session exists, then resets that
session and changes the module. Vocabulary and matching keep separate closure
state; changing the sidebar module does not change their own topic/focus state.
The brand/home link selects Learn. Navigation is not URL routing: the hash in
the brand URL does not restore activity state, and there are no deep links to
specific cards or browser-history transitions between activities.

The regular builder combines the infinitive stem and ending map, and highlights
the matching table cell. The irregular renderer filters `essential`, `yo`, or
`stem`. Its explanatory prose is partly hardcoded, so adding a new irregular
pattern requires updating that text as well as `data.js`.

`start(focus)` creates `(verb, pronoun-row)` pairs from the selected module/group,
shuffles them, and uses at most 10. `question()` renders inputs and feedback;
`results()` offers missed-form retries. `contextSentence()` supplies sentence
clues; `explanation()` ties the form to the pattern. The generic clue uses
Yo/Tú/Ella/Nosotros/Ustedes, with a special plural `estudiantes` for ser.

The answered state, last answer, and correctness are restored on re-render so
returning from Learn/Vocabulary/Match cannot score the same question twice.

## Storage contract

Only `app.js` persists learning totals. Key: **`verb-lab-v1`**.

```json
{"rounds": 2, "correct": 19, "total": 20}
```

Reads require nonnegative integer fields and `correct <= total`; malformed or
unavailable storage is caught. A missing/invalid record leaves defaults. Writes
occur only after a completed non-retry core conjugation round, or after the
confirmed Reset progress operation. Reset affects these totals only, not the
independent game/vocabulary sessions. No schema migration or export exists.

Totals are scoped to origin and browser profile. A local file, localhost, the
default Azure hostname, and the custom domain can have different storage.
Different devices/profiles do not sync. Private browsing and file-URL behavior
can affect persistence. Clearing site data removes these totals.

## Vocabulary module

Closure state: `topic`, `mode`, `card`, `revealed`, and `quiz`. The renderer uses
the same `#content` panel. Topic changes reset the card, reveal, and quiz state.
Switching list/cards/quiz modes or app activity tabs preserves the quiz.

Word-list printing temporarily adds the `printing-vocabulary` class and calls
`window.print()`. Print CSS hides the app shell and retains the selected list.
This is browser printing, not a dynamically generated PDF.

Flashcards use dataset order, with reveal/hide, previous, and next; the last card
wraps to the first. Quizzes shuffle up to 10 selected entries and use three
same-topic distractors plus the correct meaning. `options` are attached to the
question's data object for the visit, preserving order across re-render/retry.
Responses are guarded against double scoring. Only quiz results live in memory.
Current displayed topic counts (12 and 60) are hardcoded in the menu.

## Sentence matching module

The `.model` API is intentionally usable without a DOM for content checks:

| Export | Contract |
| --- | --- |
| `subjects` | Eight subject records with Spanish label, English label, and form-row index |
| `templates` | Twenty verb/object records with English base and third-person verb forms |
| `makeCard(template, subject)` | Builds prompt, answer, randomized options, selections, checked/hinted flags |
| `evaluate(card, selection)` | Returns complete/matches/correct without changing the score |
| `createRound(focus)` | Focus `'1'`, `'2'`, or `'all'`; up to 10 distinct templates with subjects assigned |

Each card offers 4 subjects (correct + 3 distinct alternatives), all 5 forms of
the same verb in shuffled order, and 4 distinct object phrases. The subject is
not inferred from the selected verb: all three chosen pieces must match the
English prompt. Eight subjects share the five form rows. English he/she use the
template's `third`; English you uses `base`, even when Spanish usted uses row 2.

The round stores cards, index, score, missed cards, and a retry flag. Selections,
hint state, and checked feedback survive app navigation in memory. Completed
cards are locked; checking again cannot add points. The English heading receives
focus on start/next/retry to bring the new prompt into view. End game confirms
before resetting to setup. Page reload discards the round.

## DOM and presentation conventions

Views replace their panel markup through `innerHTML` and then bind handlers to
the newly created elements. Do not retain old element references after renders.
Use the existing `esc`/`safe` escaping helpers when interpolating content. This
is an author-controlled dataset, not a supported untrusted-content ingestion
pipeline; future remote imports need their own validation and review.

Controls use native buttons, selects, radio groups/fieldsets, labels, live status
regions, and visible focus styles. Matching choices become two-column groups
stacked vertically on narrow screens. Navigation wraps when space is limited.
These features support accessibility; they are not a completed accessibility audit.

CSS has accumulated base, vocabulary, Wilton, and matching sections; later
overrides matter. The main custom properties are `--ink`, `--teal` (now blue),
`--paper`, `--muted`, `--line`, `--mint` (now pale blue), and `--gold` (now light
blue). Some literal colors remain. Avoid assuming variable names describe the
current palette. Google Fonts provides DM Sans and Manrope with local fallbacks.

## External resources and versioning

- Google Fonts CSS/font hosts supply optional typography.
- The curriculum link opens the public Google Doc; it is a reference, not a
  live content feed or runtime dependency.
- GitHub Actions uses `actions/checkout@v3` and `Azure/static-web-apps-deploy@v1`
  as currently configured; these are deployment dependencies, not browser imports.
- Asset query strings in `index.html` provide manual cache invalidation. Update
  the relevant query when shipping changed JS/CSS; otherwise a browser/CDN may
  show mixed asset revisions. There is no automated release/version pipeline.

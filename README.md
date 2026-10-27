# Verb Lab

A calm Spanish practice app for a seventh-grade learner: learn a pattern,
practice it, use it in a sentence, and revisit mistakes. The visual theme is
inspired by Wilton's blue and white, with Middlebrook references. This is an
independent study aid, not an official school application.

- **Live app:** https://verblab.silofire.com/
- **Repository:** https://github.com/WilliamMaxwell/VerbLab
- **Hosting:** Azure Static Web Apps, Free plan; deployment from `main`.
- **Scope:** Latin American Spanish, present indicative.
- **Content:** 40 verbs / 200 conjugated forms, 60 vocabulary terms and phrases,
  and 20 sentence-game templates across 8 subjects (160 combinations).

## Continue development here

**Start with [the handoff guide](docs/HANDOFF.md).** It records the current
state, user preferences, limitations, and instructions for the next session.

| Document | Purpose |
| --- | --- |
| [Handoff](docs/HANDOFF.md) | Fast orientation and a ready-to-paste continuation prompt |
| [Architecture](docs/ARCHITECTURE.md) | Files, globals, rendering, state, storage, and dependencies |
| [Learning and behavior](docs/LEARNING_AND_BEHAVIOR.md) | Activities, scoring rules, curriculum basis, and printables |
| [Content inventory](docs/CONTENT_INVENTORY.md) | Every verb form, vocabulary entry, and matching template |
| [Content authoring](docs/CONTENT_AUTHORING.md) | How to extend content without breaking agreement or answer choices |
| [Operations](docs/OPERATIONS.md) | Local use, Azure deployment, DNS, verification, rollback, PDF sources |
| [Quality and roadmap](docs/QUALITY_AND_ROADMAP.md) | Completed checks, known gaps, and the proposed faculty pilot |
| [Decisions and history](docs/DECISIONS_AND_HISTORY.md) | Why the app is built this way and how it evolved |
| [Agent guide](AGENTS.md) | Repository conventions for future coding sessions |

## Run it

Open `index.html` in a modern browser, or serve the repository root:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`. There is no build step, package installation,
backend, database, or account requirement. Optional Google Fonts need internet;
the app uses system fonts when they are unavailable. A service worker is not
implemented, so an online visit does not make the hosted app reliably offline.

## Activities

- **Learn:** regular verb builder, ending map, irregular groups.
- **Practice:** typed conjugations, sentence clues, hints, accent reminders,
  answer explanations, and missed-form retries.
- **Vocabulary:** themed word lists, flashcards, recognition checks, and printing.
- **Match:** an English sentence card with subject, conjugated verb, and object
  selections; regular, irregular, or mixed rounds.
- **Print & keep:** two four-page foundational modules and a three-page parent
  guide/answer key. The vocabulary word lists print separately from their tab.

Only completed non-retry conjugation totals persist, under `verb-lab-v1` in the
current browser's localStorage. Active rounds and vocabulary/matching scores
are memory-only and reset on reload. There is no teacher dashboard or sync.
These are practice scores, not validated measures of mastery.

## Check changes

With Node.js available:

```sh
node tools/check.cjs
```

This runs JavaScript syntax checks and the portable content/matching checks.
It does not run browser automation or certify translations, accessibility, or
school readiness. Follow [the manual checks](docs/QUALITY_AND_ROADMAP.md) too.

After changing content, regenerate the reference inventory:

```sh
node tools/content-inventory.cjs
```

The portable source for the original PDFs is retained in
`tools/build-foundation-pdfs.py`; see [Operations](docs/OPERATIONS.md) before
regenerating them. This documentation update does not replace the live PDFs.

## Deployment and ownership

The existing GitHub Actions workflow deploys pushes to `main` to Azure.
The domain `silofire.com` is managed through Network Solutions; the `verblab`
CNAME targets `lemon-ground-0f356a60f.5.azurestaticapps.net`.
See [Operations](docs/OPERATIONS.md) for the exact current settings. Never commit
deployment tokens or account credentials.

The repository contains a [GNU GPL v3 license](LICENSE).

Documentation reviewed against application commit
`c0e07061a61db5dbf4f4f1eab0bf3c402e80e29f` on **2026-10-27**. Refresh counts and
behavior descriptions as the implementation changes.

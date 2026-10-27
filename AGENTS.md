# Working on Verb Lab

Read `docs/HANDOFF.md`, then the relevant architecture, behavior, content, and
operations documents before editing. Inspect the current source and branch
head; recorded commit IDs are historical checkpoints, not assumed current HEAD.

## Product intent

- Keep practice calm, encouraging, readable, and untimed.
- Favor clear explanations, sentence context, and retries over reward systems.
- Preserve the Wilton-inspired navy/blue/white theme and independent-study label.
- The current app is Latin American Spanish, present indicative, for grade 7.
- The public 2024 curriculum outline informs themes; it is not a verified current
  teacher word list. Do not claim school endorsement or faculty approval.

## Implementation

- Static HTML/CSS/JavaScript; preserve the simple architecture unless the task
  requires more. Do not add accounts, analytics, or a backend speculatively.
- Source content lives in `data.js`; matching templates live in `sentence-game.js`.
- Script order in `index.html` matters: data, vocabulary, matching, app controller.
- Re-rendered views must preserve their intended state. Guard repeated scoring.
- Preserve localStorage compatibility for `verb-lab-v1`, or document a migration.
- New assets require matching script/style query versions where caching matters.
- The PDF generator must never overwrite `data.js`. Starter PDFs intentionally
  cover the original 21-verb foundation, not the full expanded app.

## Validation and documentation

- Run `node tools/check.cjs` for JavaScript/content/game changes.
- Use the browser checks in `docs/QUALITY_AND_ROADMAP.md` when interactions change.
- New content needs human language review as well as structural tests.
- Update `docs/CONTENT_INVENTORY.md` via `node tools/content-inventory.cjs` when
  changing verbs, vocabulary, subjects, or matching templates.
- Keep the README, handoff, scoring/storage documentation, and roadmap accurate.
- Historical assertions in tests describe the current release. Deliberate content
  expansion may require updating expected counts, round-length labels, and docs.

## Source control and hosting

- Repository: `WilliamMaxwell/VerbLab`; production deploys from `main` to Azure.
- Prefer the GitHub connector when available; verify permissions rather than
  assuming connector sign-in also authenticates local GitHub CLI or a browser.
- Preserve unrelated user changes, hosting settings, and DNS/email records.
- Keep secrets out of source, documents, screenshots, and command output.
- Verify the matching Azure workflow run and live app before claiming publication.
- Existing hosting uses Azure, not the abandoned Sites publishing attempt.

The separate proposed grades 3-8 math app is not this repository's scope.

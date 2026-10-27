# Verb Lab: start here

Last documented: **2026-10-27**, America/New_York. Application source reviewed:
`c0e07061a61db5dbf4f4f1eab0bf3c402e80e29f`.

## What this is

Verb Lab is an independent Spanish learning app built for a seventh-grade student
at Middlebrook School in Wilton, Connecticut. The parent reports that the student
loves it and friends prefer its straightforward practice experience. That is
encouraging anecdotal feedback, not evidence of measured learning gains.

The app is live at **https://verblab.silofire.com/**. Source is
**https://github.com/WilliamMaxwell/VerbLab**, default/production branch `main`.
The repository was observed as public with a GPL-3.0 license during development.
Recheck access and current HEAD before making changes.

## Current release at a glance

| Area | Implemented |
| --- | --- |
| Grammar | Present indicative; Latin American subject conventions |
| Verbs | 40 infinitives: 27 regular, 13 irregular; 5 forms each = 200 entries |
| Vocabulary | 60 terms/phrases, 12 in each of 5 curriculum-themed groups |
| Matching | 20 transitive templates × 8 subjects = 160 sentence combinations |
| Conjugation | Typed answers, hints, accents, context sentences, feedback, retries |
| Vocabulary activities | Word lists, flashcards, 10-question meaning checks, retries |
| Sentence game | English card → subject + conjugated verb + object |
| Printables | Two 4-page foundation modules; 3-page parent/answer guide; vocabulary printing |
| Design | Wilton-inspired navy/blue/white; Middlebrook reference; independent-study footer |
| Accounts/backend | None |
| Persistent progress | Completed non-retry conjugation totals in this browser only |

“100 learning entries” means 40 infinitives plus 60 vocabulary entries; it does
not mean 100 distinct tokens across all captions, examples, and inflections.
The 200 forms are not added to the 100-entry count. Matching templates do not
add another 160 vocabulary words.

## What matters to the user

1. Make the student feel capable through clear, useful practice.
2. Keep sessions short and untimed; avoid public rankings, streak pressure,
   countdowns, and excessive rewards.
3. Explain mistakes and allow retries, rather than only displaying a score.
4. Connect words and grammar to meaningful sentences.
5. Maintain printable explanations and answer keys for family practice.
6. Keep the Wilton school-inspired look while identifying the app as independent.
7. Work proactively. The user prefers concrete completed work over repeated
   confirmation questions for ordinary authorized changes.

## Current state and boundaries

- Production matching rollout succeeded in GitHub Actions run **40458451906**;
  the Match tab was verified on the custom domain.
- Only verb practice totals persist. Vocabulary/game progress and active rounds
  are not saved or synced. There are no student identities or teacher reports.
- Hinted conjugation answers and accent corrections can still count as correct;
  do not label those totals as independent mastery.
- The five curriculum themes come from a publicly linked **2024** Spanish 7
  overview. Specific word selections are original supplementary material.
- Commands, reflexive conjugations, preterite, and gustar-specific constructions
  are not implemented as full lessons, although the broader course includes them.
- Matching uses 20 selected transitive verbs, not all 40 verbs.
- The original PDFs remain the 21-verb starter foundation and retain the original
  green visual palette; the web app has the newer Wilton theme and expanded content.
- No formal accessibility audit, classroom Chromebook trial, faculty content
  signoff, or learning-effectiveness study has been completed.

## How to orient a new session

1. Read this file and `AGENTS.md`.
2. Fetch/inspect the current repository and compare HEAD with the checkpoint above.
3. Read `docs/ARCHITECTURE.md` and the current source files relevant to the task.
4. Use `docs/LEARNING_AND_BEHAVIOR.md` to understand scoring and storage semantics.
5. Use `docs/CONTENT_INVENTORY.md` for complete content, and run
   `node tools/content-inventory.cjs` if content changed.
6. Run `node tools/check.cjs` for relevant code/content changes, then do browser QA.
7. Use the existing GitHub-to-Azure workflow. Verify its result and the live site.
8. Update documentation and record the next milestone.

Do not rely on the old workspace's `work/` snapshots as production source.
The original development chat had local generated files, test scripts, and PDF
generation code that were not initially in GitHub. This documentation milestone
preserves the useful portable checks and foundation-PDF source in the repository.

## Proposed next milestone: faculty pilot

The parent asked how close the app is to a faculty handoff. The recommendation
was a small teacher-led pilot after content and device review, not a schoolwide
rollout. Nothing in the conversation confirms that a teacher has reviewed it or
that a pilot has begun.

Priority work: current teacher vocabulary alignment; language review; actual
classroom device/keyboard/printing checks; a concise teacher-facing guide; and
deciding which progress information is useful. Accounts and a dashboard were
not prerequisites for the proposed initial pilot.

A separate math app for grades 3-8 was discussed and a handoff prompt drafted.
It should be a separate project, drawing on Verb Lab's approach without changing
this app's purpose.

## Paste into a future session

> Continue work on Verb Lab at https://github.com/WilliamMaxwell/VerbLab, live at
> https://verblab.silofire.com/. Read AGENTS.md and docs/HANDOFF.md first, then
> inspect current HEAD and relevant source. Preserve the calm, untimed practice,
> Wilton-inspired theme, and existing storage semantics. Use the documentation
> index for architecture, content, scoring, operations, tests, and known gaps.
> My next task is: [describe the change]. Make the change, run appropriate checks,
> verify any deployment, and update the relevant documentation. Do not assume
> tools, credentials, or files from the prior session are available.

# Decisions and development history

This is a record of delivered behavior and agreed direction, rather than a
verbatim conversation. It covers the initial build and follow-up work through
2026-10-27. Application checkpoint: `c0e07061a61db5dbf4f4f1eab0bf3c402e80e29f`.

## Milestones

| Sequence | Delivered work | Evidence/checkpoint |
| --- | --- | --- |
| Foundation | Two printable modules, answer guide, regular/irregular present-tense app | 21 verbs, 105 forms; PDFs 4/4/3 pages |
| Local delivery | Downloadable static app and GitHub-ready package | ZIP contents checked; no runtime installation required |
| Azure setup | User created GitHub repository and Azure Static Web App | Repository `WilliamMaxwell/VerbLab`; source before expansion `1140da484d08dc2a6e3f9df145a65ab70448d88d` |
| Domain | Network Solutions CNAME and Azure custom-domain registration | Public CNAME checked; initial validation/HTTPS delay resolved |
| Vocabulary expansion | 19 additional verbs, 60 terms, theme lists/cards/quizzes, contextual clues | Commit `39e857adbbbcb6d3fbfb725d4fcd1ce96d5eca89`; Actions run `40442386250` succeeded |
| Wilton theme | Navy/blue/white, W mark, Middlebrook copy, independent-study footer | Commit `ddfcd45f6d129afb710fa0ba38ca3ad6306bbde7`; run `40442934645` succeeded |
| Sentence matching | English flashcard, three lists, per-part feedback, focus modes, retries | Commit `c0e07061a61db5dbf4f4f1eab0bf3c402e80e29f`; run `40458451906` succeeded |
| Documentation | Architecture/content/operations/handoff, portable checks, PDF source preservation | This documentation milestone |

Historical Actions links follow
`https://github.com/WilliamMaxwell/VerbLab/actions/runs/<run-id>`.
Source commits can be inspected under `/commit/<sha>` in the same repository.

## Decisions worth preserving

**Regular before irregular.** The initial goal was helping a struggling learner
understand conjugation. A stable three-step model precedes exceptions. The user
confirmed Latin American Spanish, which explains the five-row chart and the
absence of vosotros in core practice.

**Calm practice.** Untimed rounds, hints, explanations, and retries are central.
The parent reported positive reactions compared with more heavily gamified
tools. Preserve that preference without claiming the comparison proves efficacy.

**Browser-local simplicity.** Static source made the app easy to share and host.
No accounts or backend were required for the family use case. Persistence was
limited to conjugation totals; later vocabulary/game features intentionally kept
separate temporary scores rather than silently redefining those totals.

**Curriculum themes, not an official word list.** The public district page linked
a 2024 Spanish 7 outline. The five themes informed supplemental words/examples.
The source date and distinction from teacher-approved current content remain in
the app and docs. Broader grammar mentioned by that outline was not implemented.

**Sentence objects and meaningful context.** Contextual verb clues were added
with the expansion. The later matching game uses selected transitive templates
so the third list can truly be described as an object, with explicit subject and
English agreement. Formal you is distinguished from informal and plural you.

**Theme with independent identity.** The W mark is a simple constructed mark,
not a claim to reproduce the school's official logo. The app is Wilton-inspired
and visibly labeled as an independent study aid. The original PDF design was
not automatically recolored when the web theme changed.

**Azure is the production host.** A first Sites publication attempt failed due
to environment connection/approval limitations. The user chose Azure, initially
opened App Service with a Premium plan, then switched to Static Web Apps Free.
Do not recreate the abandoned publishing path or assume a paid App Service plan
is necessary for this app.

**Connector access is session-dependent.** GitHub was initially listed as enabled
without available repository tools; CLI configuration reads were also blocked.
The user manually created/uploaded the repo. A later session exposed functioning
GitHub tools, which were used to publish subsequent changes. An old sign-in or
permission failure does not establish what a new session can access.

## Discussed but not delivered

- A small faculty pilot after content/device review. No actual pilot is recorded.
- Formal accessibility review and classroom Chromebook verification.
- Per-student histories, cross-device sync, accounts, or a teacher dashboard.
- A separate math app for grades 3-8, beginning with facts and progressing toward
  algebraic thinking. A continuation prompt was drafted, not a math implementation.

Future work should update this file with completed milestones and the handoff
guide with the current state. Keep proposals clearly separate from shipped work.

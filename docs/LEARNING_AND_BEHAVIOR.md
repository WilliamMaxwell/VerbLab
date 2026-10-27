# Learning design and exact activity behavior

## Learner and teaching approach

The original request was for printable explanations and worksheets for a
seventh-grade student struggling with Spanish conjugation: regular verbs first,
irregular verbs second, followed by a usable web app. Subsequent requests added
school-appropriate vocabulary, a Wilton visual theme, and sentence matching.

The experience emphasizes a predictable routine: identify who acts, find the
pattern, choose or write a form, read an explanation, and revisit mistakes.
Practice is untimed. There are no leaderboards, streak penalties, rewards
economy, advertisements in the app code, or competitive score comparisons.

These are design choices, not evidence that the app improves learning. The
parent has reported positive student/friend reactions; no delayed-recall or
classroom outcome study has been conducted.

## Language scope and curriculum grounding

- Present indicative, with Latin American Spanish subject conventions.
- The conjugation chart has five rows: yo; tú; él/ella/usted;
  nosotros/nosotras; ellos/ellas/ustedes.
- Vosotros and vos are not taught. Gendered subject alternatives share verb forms.
- Current lessons include regular families, essential irregulars, special yo
  forms, and selected stem changes. They do not cover all Spanish irregulars.
- Ser/estar guidance is a starting explanation using identity/traits and
  location/state; it deliberately avoids a strict permanent/temporary rule.

The [Wilton World Languages page](https://www.wiltonps.org/258566_2) links
Middlebrook Spanish Grade 7 to
[Grade 7 Spanish Curriculum Overview 2024](https://docs.google.com/document/d/1haRcno0UnyWQEUwqerVxkd8Kr3nRnKyMJ8AbpGnchOw/edit).
The linked document was read during development. Its title is dated 2024; its
body begins with a Wilton High School heading despite the district's Middlebrook
Grade 7 link. Use the index link and title to explain provenance, not to imply
that this is the current teacher's exact word list.

The overview's five themes inform the supplementary vocabulary:

| App group | Curriculum connection |
| --- | --- |
| Identity & personality | Describing oneself, activities, likes, and characteristics |
| Family & celebrations | Family composition, events, and descriptions |
| Homes & chores | Living spaces, household work, and location |
| Daily routines | Schedules and getting ready |
| Travel & places | Travel situations, places, and experiences |

The broader outline mentions grammar beyond this app, including gustar,
obligations/commands, reflexive present-tense verbs, and preterite. This app is
supplementary present-tense practice, not complete course coverage. Specific
vocabulary and examples were selected/authored for the app, not copied as an
official faculty list. Current teacher review is still needed.

## Learn

Module 1 shows the three-step regular conjugation routine, an interactive verb
builder for all 27 regular verbs, and the ending table. Changing subject or
infinitive updates the assembled form and highlights its ending.

Module 2 groups 13 irregular verbs into:

- **Essential four:** ser, estar, ir, tener.
- **Special yo:** hacer, poner, salir.
- **Stem changes:** querer, poder, pedir, jugar, dormir, preferir.

Tables and hints are explicit learning supports. These views do not assess or
save mastery. Group descriptions are partly authored directly in `app.js`.

## Practice: typed conjugations

1. Select a family/group or mix within the current module.
2. A round draws 10 unique verb/form-row pairs without replacement. The same
   infinitive may appear with different subjects.
3. The prompt supplies the subject, infinitive, English infinitive meaning,
   Spanish sentence with a blank, and a gloss for its context phrase.
4. Type only the conjugated verb, optionally using the accent buttons or hint.
5. Check, read the pattern explanation and completed sentence, then advance.
6. Review the round and retry missed forms in a separate round.

### What is scored

| Submission | Behavior |
| --- | --- |
| Empty/whitespace | Reminder; not scored |
| Case or surrounding whitespace difference | Trimmed, lowercased with Spanish locale, NFC-normalized |
| Same letters after stripping diacritics, but wrong/missing accent | Accent reminder; still not scored |
| Exact normalized form | Counts correct and locks this question |
| Other nonempty mismatch | Counts incorrect, reveals answer, and adds to missed list |
| Repeated check / return from another tab | Already-scored question remains locked |

There is no alternate-answer list, punctuation stripping, whole-sentence parsing,
or partial credit. A response such as `yo hablo` does not match `hablo`.
Accent-only retries and hints can precede the first scored answer, so the UI's
“first try” totals mean **first scored submission**, not necessarily independent
unassisted recall. The diacritic-only test can also flag an unnecessary accent.

Only completing the original round adds one to stored rounds and its correct
and total counts. Retry rounds do not change those totals. Unfinished rounds
are discarded on reload or a confirmed module change/end. Completed totals are
practice history, not a grade or validated mastery score.

## Vocabulary

Five groups contain 12 entries each. Nouns include articles; adjectives may show
gender alternatives. Each entry includes Spanish, English, a Spanish sentence,
and an English translation.

| Activity | Behavior |
| --- | --- |
| Word list | Selected theme or all entries; prints the visible list |
| Flashcards | Spanish front; reveal English plus example/translation; previous/next, wrap at end |
| Quick check | 10 shuffled Spanish-to-English recognition questions |

Each meaning check has four options, with distractors from the question's own
topic even in an all-themes round. Feedback shows the meaning and example.
The first selection locks the response; there are no typed accent questions or
hints in this quiz. Results and retries are memory-only. Theme changes reset
the quiz, while switching app tabs or list/card/quiz modes preserves it.

Recognition, flashcard reveal, and actual production are different tasks.
Do not describe a correct multiple-choice selection as proof of fluent use.

## Match: English sentence building

Example: **She prepares dinner.** → **Ella + prepara + la cena**.

Eight English/Spanish subject mappings and 20 verb/object templates produce 160
possible combinations. Prompts explicitly distinguish singular informal you,
singular formal you, and you all. Nosotros and ellos are the representative
we/they options; matching does not offer feminine variants as alternate answers.

| Focus | Available templates | Round length |
| --- | ---: | ---: |
| Regular | 14 | 10 |
| Irregular | 6 | 6 |
| Mixed | 20 | 10 |

Templates do not repeat within a round. Subjects are shuffled, then reused if
the round is longer than eight cards. A card offers four subject choices, five
forms of its verb, and four object phrases. Selecting choices updates a live
assembled preview. The hint names the infinitive and points to who/what.

Check requires all three parts. An incomplete answer does not score. A complete
answer gets one point only when all three parts match; no partial points are
awarded, although feedback identifies each matching/mismatching component.
The card then locks, shows the correct sentence and pattern explanation, and
offers Next. The first complete check after any hint determines the score.
There is no independent-recall measure, countdown, or saved game history.

Missed cards are rebuilt with fresh choices for a separate retry round. Game
navigation preserves selections, hint state, and feedback. End game confirms
before resetting the game; reloading the browser clears it.

## Printables

| File | Pages | Contents |
| --- | ---: | --- |
| `module-1-regular-verbs.pdf` | 4 | Visual guide; find pieces; pattern practice; independent use/check |
| `module-2-irregular-verbs.pdf` | 4 | Visual guide; essential four; pattern noticing; mixed recall |
| `parent-guide-and-answer-key.pdf` | 3 | Ten-minute routine, suggested sequence, all worksheet answers |

The PDFs were created before the vocabulary expansion and Wilton web theme.
They teach the original 12 regular and 9 irregular verbs, with the original
green palette. This is intentional historical scope, not a current 40-verb
workbook. The new 60-entry word lists can be printed from Vocabulary.

US Letter, portrait, 100%/actual size and single-sided printing are suggested.
Color is optional. The independent-readiness goals in the starter worksheets
are practice targets, not grades or automatic lesson locks.

## Suggested family/teacher use

An existing parent routine suggests about ten minutes: recall a few subjects,
model one example aloud, let the learner try several, and explain one mistake.
Regular patterns precede irregular groups. Revisit material on another day.
The faculty-pilot proposal is documented in Quality and roadmap; it has not been
executed or approved by school staff.

# Extending content safely

Use `data.js` for the verb/vocabulary bank, `sentence-game.js` for matching
subjects/templates, and `app.js` for hardcoded lesson explanations. These are
JavaScript source files, not live teacher-editable forms. Keep UTF-8 accents.

## Verb schema and five-row contract

```js
{
  verb: "preparar",
  meaning: "to prepare",
  module: 1,
  group: "ar",
  forms: ["preparo", "preparas", "prepara", "preparamos", "preparan"],
  hint: "Keep prepar- and use the -ar endings.",
  context: "la cena",
  contextGloss: "dinner"
}
```

| Index | Subject row |
| --- | --- |
| 0 | yo |
| 1 | tú |
| 2 | él / ella / usted |
| 3 | nosotros / nosotras |
| 4 | ellos / ellas / ustedes |

Regular `module: 1` entries use group `ar`, `er`, or `ir`. The builder derives
forms from the ending map while practice reads the explicit forms array, so
both must agree. Do not put stem-changing or yo-irregular verbs into Module 1
simply because their infinitive has a familiar ending.

Irregular `module: 2` groups currently recognized in UI are `essential`, `yo`,
and `stem`. Add any new group to all filters, menu choices, and lesson prose.
Names such as “Essential four” are hardcoded; update them if expanding that set.

Every new verb needs a context and gloss. The generic context builder combines
Yo/Tú/Ella/Nosotros/Ustedes with the conjugated form and suffix. Check all five
sentences for noun/adjective agreement, article/preposition use, and meaning.
It has a special plural handling for `ser` + `estudiante`; there is not a general
agreement engine. Do not add adjective predicates assuming they automatically
change for plural/feminine subjects.

## Vocabulary schema

```js
{
  id: "home-1",
  topic: "home",
  spanish: "la casa",
  english: "house",
  example: "Vivo en una casa.",
  translation: "I live in a house."
}
```

Keep IDs stable/unique. Supported topic IDs are `identity`, `family`, `home`,
`routines`, and `travel`; titles are in `VERB_DATA.topics`. Every quiz topic needs
at least four distinct English meanings to supply three wrong choices. Current
topic counts in `vocabulary.js` and tests are fixed at 12/60; update them when
deliberately expanding content. A production-safe improvement would derive the
menu counts and guard undersized topics instead of relying on those assumptions.

Use articles with nouns, sensible gender alternatives with adjectives, and
complete example translations. Distinguish flexible meanings such as
`divertido/a` from narrower English synonyms. Distractors should be clearly wrong
for the displayed term; automatically distinct strings are not enough to rule
out overlapping meanings. A teacher should review the language.

The runtime attaches `options` to vocabulary entries during checks. These are
temporary UI fields and should not be copied back into `data.js` when editing.

## Matching template schema

```js
{
  verb: "preparar",          // must reference an existing data.js verb
  base: "prepare",           // I/we/they/you
  third: "prepares",         // he/she only
  object: "la cena",
  englishObject: "dinner"
}
```

Use a verb that naturally works with the selected direct object/phrase. The
game deliberately excludes location-only examples such as “I go to school”
from its current subject/verb/object template set. Do not label all sentence
endings as grammatical objects just to include more verbs.

The same object may appear in multiple templates; object choices are deduplicated.
At least four distinct object phrases must exist across the template bank.
The answer is exact to the prompted meaning: if two offered phrases could both
translate the English prompt, revise the template or choice bank.

Subject records supply `spanish`, `english`, and the five-row `row` index.
Usted uses Spanish row 2 but English “you” still requires the base verb. Check
multiword English verbs (`listen to`, `ask for`), irregular English forms
(`have/has`, `do/does`), and article meanings (`a` versus `the`).

Round setup currently says 10 regular / 6 irregular / 10 mixed. `createRound`
uses up to 10 eligible templates. If the irregular set grows from six, update
the hardcoded setup label, tests, and documentation to match actual behavior.
Changing subjects changes the 160-combination count and subject cycling.

## Adding another activity

1. Put the feature in its own script when that keeps it bounded.
2. Load it after `data.js` and before the calling controller in `index.html`.
3. Add a unique `data-view` activity and a dispatcher case in `app.js`.
4. Preserve memory state across activity navigation deliberately; handle reloads
   and reset/end behavior explicitly.
5. Guard answer submission against duplicate scoring and incomplete inputs.
6. Label what scores mean and whether they are stored. Do not silently mix
   recognition, supported practice, and unassisted production into one metric.
7. Check narrow navigation, keyboard operation, print behavior, and focus after
   changing cards. Avoid filling the screen with controls that hide the prompt.

## Content-change sequence

1. Inspect current HEAD, then edit the content and any required hardcoded prose.
2. Run `node tools/check.cjs`; update expected counts only for intentional changes.
3. Run `node tools/content-inventory.cjs` and review the generated diff.
4. Review Spanish/English agreement and distractor ambiguity, preferably with a
   Spanish teacher. Automated checks establish consistency, not pedagogy.
5. Test the relevant browser flows, including an incorrect and incomplete answer,
   a retry, activity navigation, and storage behavior where applicable.
6. Update asset query versions and the handoff/behavior docs if contracts changed.
7. Deploy through the existing workflow and verify the actual custom-domain app.

For PDF changes, use the separate source and render/review workflow described in
Operations. Editing `data.js` does not regenerate the starter worksheets.

# Verb Lab

A gentle Spanish conjugation practice app for a seventh-grade learner.
Lessons use Latin American Spanish and cover the present indicative.

## What is included

- Module 1: regular -ar, -er, and -ir verbs.
- Module 2: ser, estar, ir, tener, special yo forms, and stem changes.
- Interactive verb builder, short untimed practice rounds, hints, accent reminders,
  answer explanations, and missed-form retries.
- Printable visual guides, six worksheets, a parent guide, and answer keys.

## Files

Keep these files together at the repository root:

```text
README.md
index.html
style.css
vocabulary.js
data.js
app.js
module-1-regular-verbs.pdf
module-2-irregular-verbs.pdf
parent-guide-and-answer-key.pdf
```

## Run locally

Open `index.html` in a modern browser. No installation or build step is needed.
An internet connection is used only for optional Google Fonts; system fonts work
when offline. The app and PDF downloads work locally.

Practice totals stay in the current browser, without syncing between devices.
Some browsers do not retain progress for local files or in private mode.
Scores count first tries, including answers after hints or accent reminders.
Retry scores are separate from saved first-try totals.

## Add these files to GitHub

1. Extract the ZIP on your computer.
2. Create a private repository named `verb-lab`, or open your chosen repository.
3. Use **Add file > Upload files** (or **uploading an existing file** in an empty
   repository).
4. Select all extracted files and drag them into the upload area.
5. Commit the files to `main`.

Upload the extracted files, not the ZIP. `index.html` should be visible directly
on the repository's main page, rather than inside an extra folder.

## Deploy to Azure Static Web Apps

In Azure, create **Static Web Apps**, select the **Free** plan, and connect this
GitHub repository and its `main` branch. This is a static app with no backend.

Use these build settings:

| Setting | Value |
| --- | --- |
| Build preset | Custom |
| App location | `/` |
| API location | Leave empty |
| Output location | Leave empty |

Azure creates a GitHub Actions workflow and the deployment secret when you
connect the repository. Keep the generated secret reference unchanged.
Since this app has no build step, add `skip_app_build: true` under `with:` in the
generated `Azure/static-web-apps-deploy` upload step. Its app settings should be:

```yaml
app_location: "/"
api_location: ""
output_location: ""
skip_app_build: true
```

Commit any workflow change, then check the repository's **Actions** tab. Once
deployment succeeds, open the website URL shown in the Azure resource.

Microsoft reference:
https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration

## Use your own subdomain

After the default Azure URL works, open the Static Web App's **Custom domains**
settings and add your desired subdomain, such as `spanish.example.com`.
Follow Azure's validation instructions. For an external DNS provider, this
typically involves a CNAME from `spanish` to the exact generated Azure hostname.
Azure provides the HTTPS certificate after the domain is validated.

Microsoft reference:
https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain-external

## Learning routine

Start with Module 1. Spend about ten minutes reading one pattern, trying a few
forms, and explaining one mistake. Move to Module 2 when the regular patterns
feel comfortable. Match your teacher's vocabulary and pacing where they differ.



## Vocabulary expansion (October 2026)

The original app taught 21 verbs (12 regular, 9 irregular) with 105 forms.
It now teaches **40 verbs** (27 regular, 13 irregular) with 200 forms, plus
**60 vocabulary terms/phrases**, for **100 learning entries**. These counts
refer to dictionary entries, not every word appearing in explanations.

The Vocabulary tab includes word lists, example sentences with translations,
flashcards, ten-question recognition checks, missed-word retries, and a print
button for the selected word list. Vocabulary-check scores are separate from
saved verb totals. Conjugation questions now include contextual sentence clues.
The existing PDFs remain the original foundation worksheets for Modules 1 and 2.

### Curriculum basis

Themes follow the public **Grade 7 Spanish Curriculum Overview 2024**, linked
under Middlebrook Spanish Grade 7 on the Wilton Public Schools curriculum page:

- https://www.wiltonps.org/258566_2
- https://docs.google.com/document/d/1haRcno0UnyWQEUwqerVxkd8Kr3nRnKyMJ8AbpGnchOw/edit

The five themes are identity/personality, family/celebrations, homes/chores,
daily routines, and travel. Specific words and examples are original practice
content selected to fit those themes. This is not an official or exhaustive
Middlebrook vocabulary list, and the linked overview is dated 2024. Check
current teacher materials for exact assignments and pacing. The school outline
also includes reflexive verbs and preterite; this app's conjugation modules
remain present-tense practice.

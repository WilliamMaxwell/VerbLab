# Local development, deployment, DNS, and printables

## Known production configuration

These are observed application settings as of the documentation checkpoint;
verify them in the account before changing infrastructure.

| Item | Value |
| --- | --- |
| Repository | `WilliamMaxwell/VerbLab` |
| Production branch | `main` |
| Azure resource name | `VerbLab` |
| Resource group shown in portal | `rg-will_ai` |
| Plan | Azure Static Web Apps Free |
| Custom domain | `verblab.silofire.com` |
| Default hostname | `lemon-ground-0f356a60f.5.azurestaticapps.net` |
| DNS account/provider used | Network Solutions |
| Workflow | `.github/workflows/azure-static-web-apps-lemon-ground-0f356a60f.yml` |

The subscription display shown during setup was Visual Studio Professional
Subscription. Do not assume its billing/permissions remain unchanged. There is
no application database, runtime environment-variable configuration, or backend
service to provision for the current static app.

## Local development

Use a fresh clone/checkout or the current repository source rather than an old
ZIP. Required browser assets are `index.html`, `style.css`, `data.js`,
`vocabulary.js`, `sentence-game.js`, and `app.js`. Keep all three PDF files at the
root for the download links.

For a local web origin:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8000/`. `python3` may be the executable on another host.
Stop the server with Ctrl+C when finished. No `npm install`, build command, or
Azure tooling is needed to exercise the browser app. File-URL use is supported
as a simple local copy, but storage and some browser behavior vary; HTTP is
preferred for development.

## Exact existing GitHub Actions settings

The tracked workflow runs on pushes to `main` and selected pull-request events.
The upload step currently contains:

```yaml
uses: Azure/static-web-apps-deploy@v1
with:
  action: "upload"
  app_location: "/"
  api_location: ""
  output_location: "."
```

It uses Azure's generated deployment-token secret reference and the built-in
GitHub token. Those values are not stored in these documents. Preserve the
secret references in the existing workflow. `skip_app_build` is currently
absent. Earlier setup instructions suggested an explicit build skip/empty
output; the checked-in configuration above is the one actually deployed
successfully. This documentation update does not alter it.

Do not recreate the Azure app or its workflow for routine edits. The repository
root is the current deployment input; developer documentation/tools may also be
present in the uploaded static tree. Do not place secrets or private student
material anywhere in the repository. If runtime-only packaging becomes necessary,
make it an explicit deployment improvement and verify the changed artifact path.

Official references:

- https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration
- https://learn.microsoft.com/en-us/azure/static-web-apps/get-started-portal

## Publishing an update

1. Inspect the current branch/head and preserve unrelated changes.
2. Prepare and validate the complete change locally. Use the appropriate browser
   checks as well as `node tools/check.cjs` for code/content changes.
3. Update the changed JS/CSS query versions in `index.html` to avoid stale assets.
4. Commit/push the exact reviewed source to `main` through an authorized GitHub
   connection. Feature branches/PRs are also possible; they are not automatic
   approval or permission to merge unrelated work.
5. Observe the Actions run for that exact commit. A commit or queued run is not
   proof of a successful production update.
6. After success, reload the app at the custom domain and verify the changed
   activity, not just the home page. Keep errors and deployment claims precise.

GitHub connector authentication, local `gh` authentication, and browser sign-in
are separate. Earlier sessions saw installed-but-unavailable connector tools,
inaccessible CLI configuration, and a browser sign-in screen. Later the connector
became available and successfully committed/deployed the vocabulary, theme, and
matching updates. Discover current capabilities rather than reusing assumptions.

The original non-Azure Sites publishing attempt failed before a usable hosted
release. Azure is the production route. Old `.openai/hosting.json` files and
publisher helpers in the original scratch workspace are not this repository's
deployment configuration.

## DNS and HTTPS

At Network Solutions, the configured record was:

| Field | Value |
| --- | --- |
| Type | `CNAME` |
| Name/host | `verblab` |
| Alias/target | `lemon-ground-0f356a60f.5.azurestaticapps.net` |
| TTL shown | 4 hours |

Use the hostname only, without `https://` or a trailing path. Azure also needs
the custom domain registered under **VerbLab → Settings → Custom domains → Add
→ Custom domain on other DNS**, with the matching name and CNAME validation.
Azure manages HTTPS certificates after validation. Initial screenshots showed
“Validating” and a browser secure-connection warning; later live HTTPS access
and deployments were verified. DNS registration and Azure binding are separate
steps.

Do not alter the apex, www, wildcard, mail records, nameservers, or other services
to make an ordinary app update. The subdomain already has its own record.

Official references:

- https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain-external
- https://www.networksolutions.com/help/article/manage-dns-adns-records

## Troubleshooting and rollback

| Symptom | Check |
| --- | --- |
| Old view after successful deployment | Reload; check asset query versions, deployed commit, and cached files |
| Navigation works but activity is blank | Script order, missing file/global, JavaScript syntax/console error |
| App works but PDFs fail | Root filenames and deployed PDF assets; links are relative |
| Wrong totals or totals differ between URLs/devices | localStorage is browser/profile/origin-local; not synced |
| Custom-domain HTTPS fails | Azure domain status, CNAME target/propagation, and certificate provisioning |
| Workflow fails | Exact Actions run/job logs for the changed commit; do not infer success from push |
| New group/topic behaves oddly | Hardcoded labels/filters, minimum distractor bank sizes, and data contracts |

For a regression, create a normal revert commit for the problematic change and
let the same deployment workflow run. Verify the resulting site. Avoid rewriting
shared `main` history. Source checkpoints are recorded in Decisions and history.
Reverting an app file does not restore a user's cleared browser storage.

## PDF source preservation and regeneration

The three shipped PDFs are the original foundation materials. The source was
initially a local ReportLab script; a safe portable derivative is now retained
at `tools/build-foundation-pdfs.py`. It embeds the original 21-verb foundation
and writes PDFs only. It must not write app data or silently replace production
assets. Its default destination is ignored `work/printables/`.

PDF tooling is optional for normal app use. Install the isolated development
requirements using your normal Python environment, for example:

```sh
python -m venv .venv
# Activate .venv using the command appropriate to your shell.
python -m pip install -r tools/requirements-pdf.txt
python tools/build-foundation-pdfs.py
```

The retained generator looks for Arial on Windows/macOS or DejaVu Sans on common
Linux locations. To choose fonts explicitly:

```sh
python tools/build-foundation-pdfs.py --font-regular /path/Regular.ttf --font-bold /path/Bold.ttf
```

Use `--output-dir` to choose another destination. Do not point it at the repo
root until regenerated materials have been reviewed. The generator is source
preservation, not an automatic reflection of the expanded 40-verb curriculum.

Before replacing PDFs: regenerate into scratch output, inspect extracted text
and page counts, render every page to images using Poppler or another suitable
PDF renderer, and inspect accents, arrows, margins, answer lines, tables, page
breaks, and keys. The expected starter page counts are 4/4/3. Then copy only the
reviewed final PDFs to the root and deploy. Content/layout changes require this
review even when the Python script exits successfully. Existing PDF bytes are
unchanged in this documentation milestone.

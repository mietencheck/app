# Mietenbremse

## Mietspiegel verification

```sh
pnpm test:mietspiegel       # Source-backed numerical, questionnaire, API and rendering tests
pnpm exec vitest run        # All unit/integration tests
pnpm type-check
pnpm exec playwright install chromium
pnpm test:e2e               # Actual result pages and answer editing, desktop/mobile, DE/EN
```

The reference data under `src/calculation/verification/reference/` was extracted
from the supplied official Berlin Mietspiegel PDFs (2015, 2017, 2019, 2021, 2023,
2024 and 2026), independently of the production tables. Each edition records its
PDF filename, SHA-256 fingerprint, original PDF page and table field/row. Page
numbers are PDF page indices starting at 1, not the printed page numbers.
The PDFs themselves are not required in CI and are not committed.

| Layer              | Scope                                                                                                                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source data        | All 832 table fields: 798 populated and 34 explicitly blank; missing/extra production fields; all published low-standard deduction rules; all 56 special-feature cells in 2015.                                      |
| Published examples | Nine worked examples across all seven editions, including the 2015 special-feature examples. The monthly 110% amounts are independently derived standard scenarios, not amounts published in the examples.           |
| Arithmetic         | All 243 combinations of negative/neutral/positive group outcomes for every populated field, both calculation types; every 2015 special-feature subset and all 11 group balances; fractional areas and cent rounding. |
| Boundaries         | Inclusive/exclusive area thresholds and construction-period endpoints for every source field; empty cells; classification one cent around both range endpoints.                                                      |
| Uncertainty        | All nine equipment-answer combinations where the footnote defines both missing items; seeded group uncertainty checked against enumerated concrete resolutions.                                                      |
| Integration        | Worked examples through real question visibility/mapping and both HTTP handlers; cumulative energy weights and exclusion of stale alternative energy answers; existing housing exits.                                |
| Display            | Actual breakdown components in DE/EN, units, conditional surcharge, lower/upper columns and 2015 special-feature ranges. Browser checks cover real saved sessions, reloads, uncertainty and changing an answer.      |

The integer/BigInt reference calculator imports no production data or helpers.
Its arithmetic is anchored to the published examples before it is used for
generated comparisons. Tests use synthetic group representatives to exercise
arithmetic independently of questionnaire interpretation. Special-feature subsets
and group states at this boundary can include combinations that the questionnaire
would exclude; they verify the arithmetic contract rather than physical apartments.

### Re-extracting reference tables

Use Python with `pdfplumber` and `pypdf` installed:

```sh
python scripts/extract-mietspiegel-reference.py /path/to/Mietspiegel
pnpm exec prettier --write src/calculation/verification/reference
pnpm test:mietspiegel
```

The script reads the PDFs only. It rotates the older tables in memory, checks table
dimensions and row sequences, preserves blank fields and qualification markers,
and stores monetary values as integer cents. Visually compare changes with rendered
PDF pages before accepting new reference data. A green comparison alone cannot
prove extraction correctness. The deduction and special-feature matrices in
`rules.json` and the fixed examples are separately transcribed source evidence.

### Findings corrected in the initial audit

- 2017 pre-1919 heating/bathroom deductions were reversed (PDF p. 13).
  The source's non-monotonic deductions also require enumerating uncertain equipment
  configurations instead of assuming that more missing equipment means a larger deduction.
- 2021 field I3 was missing and its values had been entered in the blank J3 field (PDF p. 17).
- 2023 fields B5, C5, E5, G3, H5, I6, K5, K7 and L7 contained incorrect values (PDF p. 17).
- 2024 rows 117, 131, 135, 140, 145 and 154 had malformed open-ended area keys,
  causing missing results or overlap with smaller bands (PDF pp. 20-21).
- 2015 section 11.3 step 3 requires suppressing the orientation adjustment in
  either direction when special features alone cross either endpoint, and bounding
  the combined result at the lower endpoint as well as the upper endpoint.
- Floating-point multiplication could round exact half-cent monthly totals down.
  Monthly multiplication now uses the decimal inputs exactly and rounds once to cents.
- The monthly total was labelled per m²; the rent-increase breakdown displayed a
  10% surcharge that its calculation did not apply; uncertain 2015 special-feature
  amounts could display zero for the nonzero endpoint.

### Verification limits and remaining review

The bathroom threshold questions now ask **at least 4 m²**, using new aliases
`Bad mindestens 4qm` and `Sondermerkmal Badezimmer mindestens 4qm`.
Exactly 4 m² therefore does not count as a small bathroom. Existing saved answers
are not migrated, and there is no special reconfirmation flow for older answers.

API flow evaluation now determines applicable questions from the same derived,
normalized state it returns. Address and construction-period inputs therefore
do not require callers to duplicate their derived Wohnlage/Ost/Baujahr fields.

These checks verify the documented numerical method within the application's
calculation model. They do not constitute legal approval of a ceiling for every
tenancy. In particular:

- Establish a reviewed policy for the relevant tenancy dates and edition selection.
  The current questionnaire uses contract-signing date categories aligned to the
  Mietspiegel reference dates. Reference dates, publication dates and the legally
  relevant tenancy date must not be treated as interchangeable without justification.
- Review previous rent, modernization, first use/new-build exceptions, index/stepped
  rents, and rent-increase caps/time limits. The calculation core alone does not
  encode all of these legal conditions. Housing-exit tests preserve existing product
  routing; they do not endorse every legal shortcut in that routing.
- Independently verify the historical street directories, address-to-Wohnlage and
  East/West assignment, West-Staaken and Wendewohnungen. Browser fixtures use a
  synthetic already-resolved address and cannot certify the geographic dataset.
- Complete a clause-by-clause review of every feature's questionnaire wording,
  numerical thresholds, construction-period exclusions, and landlord/tenant provision.
  Energy integration tests verify symbol weighting and exclusivity, not every
  threshold label. Existing mapping tests plus the new examples are not a complete
  independent certification of all feature interpretations or correlated unknown answers.
- The older footnotes specify the 1950-1964 deduction for one missing equipment
  item, but do not explicitly specify both missing. The reference records that
  combination as `null`, rather than inventing an authoritative amount. The current
  application's extension to that combination still needs a documented policy.
- Qualification markers are retained in the fixtures; their correct disclosure and
  legal significance in the UI still need review. Unsupported/excluded cases must
  not be presented as definitively lawful or unlawful based on arithmetic alone.
- Browser tests check the HTML breakdown shared with the print view. They do not
  inspect the downloaded PDF binary or certify its visual layout.

When adding an edition, first add and review source evidence, then update production
data. Keep expected results independent: never regenerate reference expectations
from the implementation or replace a failing expectation merely to make a test pass.

To run the project, first [install PNPM](https://pnpm.io/installation), open a
terminal and run:

```sh
pnpm install
```

Then, to start the development server:

```sh
pnpm dev
```

The app now runs through Vite's Cloudflare Workers integration, so the browser
app and Worker routes are served together during development.

### Mietencheck admin backend (Beratung / Eintragen)

With **`pnpm dev`**, traffic goes through the Cloudflare Worker (Miniflare), so
Vite’s **`server.proxy`** does not apply. The Worker forwards **`/api-mietencheck`**
to your Nest API instead (`src/worker.ts`, origin via **`MIETENCHECK_API_ORIGIN`**
in `wrangler.toml`, default `http://127.0.0.1:3000`). Start the backend on that
port or override the var.

**Production (recommended):** leave **`VITE_MIETENCHECK_API_BASE_URL`** unset so
the browser calls same-origin **`/api-mietencheck`** and avoids CORS. The Worker
proxies those requests — set **`MIETENCHECK_API_ORIGIN`** on the deployed Worker
to your real Nest URL (Wrangler `--var`, `[env.*.vars]`, or dashboard). The
[`wrangler.toml`](wrangler.toml) default is for local dev only.

**Direct API from the browser:** only then set **`VITE_MIETENCHECK_API_BASE_URL`**
to the Nest origin (no trailing slash); Nest must allow CORS for your site’s
origin. Build-time env: `.env.production` or your CI vars for `VITE_*`.

## API

### `POST /api/miete`

Berechnet die `preisspanne` auf Basis eines JSON-Objekts mit Antworten im
Format `FrageAlias -> Wert`.

Production:
`https://mietencheck.de/api/miete`

Local development:
`http://localhost:5173/api/miete`

#### Request

Headers:

```http
Content-Type: application/json
```

Der Request-Body kann entweder direkt das Antwortobjekt sein:

```json
{
  "Unterschrieben": "Ja",
  "Vertragsdatum": "2022-2024",
  "Ost": false,
  "Wohnlage": "einfach",
  "Baujahr": 1918,
  "Qm": 50,
  "Wohnung hat Sammelheizung": "Ja",
  "Badezimmer in Wohnung": "Ja"
}
```

oder unter `answers` verschachtelt:

```json
{
  "answers": {
    "Unterschrieben": "Nein",
    "Ost": false,
    "Wohnlage": "einfach",
    "Baujahr": 1918,
    "Qm": 50,
    "Wohnung hat Sammelheizung": "Ja",
    "Badezimmer in Wohnung": "Ja"
  }
}
```

#### Input-Normalisierung

- Choice-Antworten akzeptieren Alias, Text oder interne Option-ID.
- Number-Antworten akzeptieren Zahlen und numerische Strings.
- Boolean-Antworten akzeptieren `true`/`false` sowie `"true"`/`"false"`.
- Abgeleitete Felder wie `Vertragsdatum`, `Wohnlage`, `Ost` und `Baujahr`
  werden ergänzt, wenn sie aus den vorhandenen Antworten berechnet werden
  können.

#### Response

Status:

```http
200 OK
```

Response-Body:

```json
{
  "answers": {
    "Unterschrieben": "Ja",
    "Vertragsdatum": "2022-2024",
    "Ost": false,
    "Wohnlage": "einfach",
    "Baujahr": 1918,
    "Qm": 50,
    "Wohnung hat Sammelheizung": "Ja",
    "Badezimmer in Wohnung": "Ja"
  },
  "visibleQuestionAliases": ["Adresse", "Ost", "Wohnlage"],
  "steps": [],
  "issues": [],
  "preisspanne": {
    "best": [7.19, 5.61, 10.59],
    "worst": [7.19, 5.61, 10.59]
  }
}
```

Felder:

- `answers`: normalisierte und ggf. abgeleitete Antworten
- `visibleQuestionAliases`: aktuell sichtbare Fragen im Flow
- `steps`: kompletter aktueller Flow-Zustand
- `issues`: Hinweise zu unbekannten oder ungültigen Eingaben
- `preisspanne`: Ergebnis der Berechnung oder `null`, falls keine vollständige
  Berechnung möglich ist

#### Fehler- und Randfälle

Ungültige fachliche Eingaben liefern in der Regel weiterhin `200 OK`, aber mit
Hinweisen in `issues` und `preisspanne: null`.

Beispiel:

```json
{
  "Qm": "abc"
}
```

Antwort:

```json
{
  "issues": [
    {
      "questionAlias": "Qm",
      "message": "Expected a number for number answers",
      "received": "abc"
    }
  ],
  "preisspanne": null
}
```

Ein strukturell ungültiger JSON-Body liefert:

```http
400 Bad Request
```

mit:

```json
{
  "error": "Invalid request data"
}
```

Nicht unterstützte Methoden liefern:

```http
405 Method Not Allowed
```

This project is pinned to Node.js `24.14.0` via
[`/Users/gregor/code/mietencheck/.node-version`](/Users/gregor/code/mietencheck/.node-version).
For older Cloudflare Pages projects still on build image v2, also set
`NODE_VERSION=24.14.0` in the Pages dashboard or upgrade the project to build
image v3.

To edit the flow, open `src/form` at [floma.vercel.app](https://floma.vercel.app)

## Updating Strassenverzeichnis

First download the db from https://github.com/mietencheck/strassenverzeichnis.

Then export it as JSON:

```sh
sqlite3 strassenverzeichnis.sqlite

sqlite> .mode json
sqlite> .once addressen-db-export.json
sqlite> SELECT * FROM addressen;
# Exit sqlite

deno run scripts/pack-addressen.ts addressen-db-export.json
```

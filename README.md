# Mietenbremse

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

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

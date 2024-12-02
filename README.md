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

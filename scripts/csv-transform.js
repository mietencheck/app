/* eslint-disable */
import fs from "fs";
import path from "path";

import { parse, stringify, transform } from "csv";

function ltrim(str) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== "0") {
      return str.slice(i);
    }
  }
  return "0";
}

let [, , fileName, year] = process.argv;
year = Number(year);
if (!fileName || Number.isNaN(year)) {
  process.exit(1);
}

parse(fs.readFileSync(fileName, "utf-8"), { from_line: 2 })
  .pipe(
    transform(
      ([
        bezirk,
        plz,
        strasse,
        nummer,
        wohnlage,
        laerm,
        stadtteil,
        plr_name,
      ]) => [
        strasse,
        ltrim(nummer, "0"),
        plz,
        bezirk,
        String(wohnlage).toLowerCase(),
        JSON.stringify(String(laerm).toLowerCase() == "ja"),
        JSON.stringify(String(stadtteil).toLowerCase() == "ost"),
        plr_name,
        year,
      ],
    ),
  )
  .pipe(
    stringify({
      header: true,
      columns: [
        "strasse",
        "nummer",
        "plz",
        "bezirk",
        "wohnlage",
        "laut",
        "ost",
        "plr",
        "jahr",
      ],
    }),
  )
  .pipe(
    fs.createWriteStream(
      path.join(
        path.dirname(fileName),
        path.basename(fileName, ".csv") + "_sql.csv",
      ),
    ),
  );

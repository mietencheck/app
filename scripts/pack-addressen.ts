// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import sanitize from "npm:sanitize-filename";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setPath(object: any, path: Array<any>, value: any) {
  if (path.length === 0) return value;
  object = object ?? {};
  Object.assign(object, {
    [path[0]]: setPath(object[path[0]], path.slice(1), value),
  });
  return object;
}

const input = await Deno.readTextFile("addressen-db-export.json");
const addressen = JSON.parse(input);

const grouped = {};
const lautSet = new Set();
const ostSet = new Set();
for (const { wohnlage, laut, ost, ...a } of addressen) {
  const wohnlageNumber = { einfach: 0, mittel: 1, gut: 2, ohne: 3 }[wohnlage];
  setPath(
    grouped,
    [a.strasse, a.plz, String(a.nummer), String(a.jahr - 2015)],
    [wohnlageNumber, +laut, +ost],
  );
  lautSet.add(+laut);
  ostSet.add(+ost);
}

const streets = Object.keys(grouped);
await Deno.writeTextFile("out/strassen.json", JSON.stringify(streets));

for (const [strasse, value] of Object.entries(grouped)) {
  await Deno.writeTextFile(
    "out/" + sanitize(strasse + ".json"),
    JSON.stringify(value),
  );
}

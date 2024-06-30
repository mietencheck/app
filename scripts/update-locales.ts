import fs from "fs";
import path from "path";

import { Flow, default as fm } from "flow-machine";

import { hash } from "~/l10n";

import DE from "../public/locales/de.json";
import flow from "../src/form/flow.fm.json";

export async function updateLocales() {
  const stringByHash = new Map<string, string>();
  const addString = (text: string) => stringByHash.set(hash(text), text);
  fm.traverse(flow as Flow, (node) => {
    switch (node.type) {
      case "Group":
      case "Info":
        if (node.alias) {
          addString(node.alias);
        }
        break;

      case "Question":
        addString(node.text);
        if (node.info) {
          addString(node.info);
        }
        if (
          node.answer.type === "ChoiceAnswer" ||
          node.answer.type === "MultiChoiceAnswer"
        ) {
          for (const { text } of node.answer.options) {
            addString(text);
          }
        }
        break;
    }
  });

  const localesPath = path.join("public", "locales");
  const locales = fs
    .readdirSync(localesPath)
    .filter((f) => f.endsWith(".json") && f !== "de.json")
    .map((file) => file.split(".")[0]);
  for (const locale of locales) {
    const localePath = path.join(localesPath, `${locale}.json`);
    const input = JSON.parse(fs.readFileSync(localePath, "utf-8"));

    const fields = Object.fromEntries(
      Object.keys(DE).map((key) => [key, input?.fields?.[key] ?? null]),
    );
    const strings = Object.fromEntries(
      Array.from(stringByHash.entries()).map(([hash, text]) => [
        hash,
        input?.strings?.[hash] ?? "[DE] " + text,
      ]),
    );

    fs.writeFileSync(localePath, JSON.stringify({ fields, strings }, null, 2));
  }
}

updateLocales().catch(console.error);

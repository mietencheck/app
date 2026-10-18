import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, expect, test, vi } from "vitest";

import { FinalAnswers } from "~/form/flow-machine";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";
import { L10nContext, Localization } from "~/L10nContext";
import { OrtsüblicheVergleichsmieteTable } from "~/pages/fragebogen/result/partials/modal/OrtsüblicheVergleichsmieteTable";
import { ZulaessigeHoechstmieteTable } from "~/pages/fragebogen/result/partials/modal/ZulaessigeHoechstmieteTable";

import EN from "../../../public/locales/en.json";

const state = vi.hoisted(() => ({ answers: {} as Record<string, unknown> }));
vi.mock("~/form/flow-machine", () => ({
  useAnswers: () => ({ getAliasedState: () => state.answers }),
  useVisibleQuestionAliases: () => new Set(Object.keys(state.answers)),
}));
vi.mock("~/components", async () => import("~/components/Table/Table"));

beforeEach(() => {
  state.answers = {
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    Typ: "Miete",
    Unterschrieben: "Ja",
    Vertragsdatum: ">2026",
    Baujahr: 1930,
    Wohnlage: "mittel",
    Qm: 60,
    "Wohnung hat Sammelheizung": "Ja",
    "Badezimmer in Wohnung": "Ja",
    "Wohnung hat Balkon": "Ja",
  } satisfies FinalAnswers;
});

function render(component: React.ReactNode, locale: "de" | "en" = "de") {
  return renderToStaticMarkup(
    <L10nContext.Provider
      value={{
        locale,
        setLocale: () => {},
        glossary: {},
        localization: EN as Localization,
      }}
    >
      {component}
    </L10nContext.Provider>,
  );
}

function rows(html: string): string[][] {
  return [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map((match) =>
    [...match[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/g)].map((cell) =>
      cell[1]
        .replace(/<[^>]*>/g, "")
        .replace(/\s/g, " ")
        .trim(),
    ),
  );
}

test.each(["de", "en"] as const)(
  "%s: monthly ceiling has the correct unit",
  (locale) => {
    const result = rows(render(<ZulaessigeHoechstmieteTable />, locale));
    const last = result.at(-1)!;
    expect(last[1]).toContain("481,80"); // source row 81: 7.30 * 60 * 1.1
    expect(last[1]).not.toContain("m²");
    expect(last[1]).toContain(locale === "de" ? "Monat" : "month");
    expect(result[1][1]).toContain("7,30");
    expect(result[1][1]).toContain("m²");
  },
);

test("rent-increase breakdown does not add or display a 10% surcharge", () => {
  state.answers.Typ = "Mieterhöhung";
  const html = render(<ZulaessigeHoechstmieteTable />);
  expect(rows(html).at(-1)![1]).toContain("438 €");
  expect(html).not.toContain("10%");
});

test("uncertain results put lower and upper totals in the correct desktop and mobile columns", () => {
  state.answers["Bad mit Fußbodenheizung"] = "Nicht sicher";
  const result = rows(render(<ZulaessigeHoechstmieteTable />));
  // One uncertain positive group: source row 81 gives 7.30..7.75 EUR/m².
  const desktop = result.find(
    (row) => row[0] === "Zulässige Höchstmiete" && row.length === 3,
  )!;
  expect(desktop[1]).toContain("481,80");
  expect(desktop[2]).toContain("511,50");
  expect(
    result.filter((row) => row[0] === "Niedrigste Miete").at(-1)![1],
  ).toContain("481,80");
  expect(
    result.filter((row) => row[0] === "Höchste Miete").at(-1)![1],
  ).toContain("511,50");
});

test("2015 uncertain special-feature amount is shown even when its lower bound is zero", () => {
  Object.assign(state.answers, {
    Vertragsdatum: "2015-2016",
    Baujahr: 1900,
    Wohnlage: "einfach",
    Qm: 50,
    "Sondermerkmal Bodenbelag": "Nicht sicher",
  });
  const result = rows(render(<OrtsüblicheVergleichsmieteTable />));
  const special = result.find(
    (row) => row[0] === "Sondermerkmal Aufschlag" && row.length === 3,
  )!;
  expect(special[1]).toBe("0 €");
  expect(special[2]).toContain("0,56");
});

test("unavailable table values do not render fabricated zero-euro breakdowns", () => {
  Object.assign(state.answers, {
    Vertragsdatum: "2020-2022",
    Baujahr: 1960,
    Wohnlage: "einfach",
    Qm: 100,
  });
  expect(render(<ZulaessigeHoechstmieteTable />)).toBe("");
  expect(render(<OrtsüblicheVergleichsmieteTable />)).toBe("");
});

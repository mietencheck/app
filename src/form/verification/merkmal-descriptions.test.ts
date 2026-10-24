import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";
import { hash } from "~/l10n";
import { merkmaleDescriptionsByYear } from "~/mietspiegel/merkmale";

import EN from "../../../public/locales/en.json";
import { allQuestionNodes, BASE_ANSWERS, evaluateAnswers } from "./flow-paths";
import { excludedPeriodsFromText } from "./merkmal-coverage";

const descriptions = (jahr: string) => merkmaleDescriptionsByYear[jahr];

// Source clauses: printed pp.19 (2015), 15/17 (2017), 19–21 (2019),
// 18–20 (2021/2023), and 22–24 (2024/2026). These assertions deliberately
// preserve operators and clause scope, which the Baujahr parser cannot check.
test("the moisture exception starts in 2019, not 2017", () => {
  const merkmal = "[Bad-] Bad mit Dielenfußboden";
  for (const jahr of ["2015", "2017"]) {
    expect(descriptions(jahr)[merkmal]).toBe("Dielenfußboden im Bad");
  }
  for (const jahr of ["2019", "2021", "2023", "2024", "2026"]) {
    expect(descriptions(jahr)[merkmal]).toContain(
      "(wenn nicht feuchtraumgeeignet)",
    );
  }
});

test.each(["2017", "2019", "2021", "2023"])(
  "%s: modern heating includes 1 January 2003 and remains an OR alternative",
  (jahr) => {
    expect(
      descriptions(jahr)["[Gebäude+] Gebäude hat zusätzliche Wärmedämmung"],
    ).toBe(
      "Wärmedämmung zusätzlich zur vorhandenen Bausubstanz oder Einbau/Installation einer modernen Heizanlage ab dem 1.1.2003 (wenn Bezugsfertigkeit des Gebäudes/der Wohnung vor diesem Zeitpunkt)",
    );
  },
);

test("2015: Modernes Bad excludes mixer taps as well as the other two features", () => {
  for (const merkmal of [
    "[Bad+] Bad hat Einhebelmischbatterie",
    "[Bad+] Bad hat Strukturheizkörper",
    "[Bad+] Bad hat wandhängendes WC",
  ]) {
    expect(descriptions("2015")[merkmal]).toMatch(
      /^Nur wenn Sondermerkmal „Modernes Bad“ nicht zutrifft: /,
    );
  }
  expect(descriptions("2015")["[Bad-] WC ohne Entlüftung"]).toBe(
    "WC ohne Lüftungsmöglichkeit oder Entlüftung",
  );
  expect(descriptions("2017")["[Bad-] WC ohne Entlüftung"]).toBe(
    "WC ohne Lüftungsmöglichkeit und Entlüftung",
  );
});

test.each(["2024", "2026"])(
  "%s: recent descriptions retain all four Baujahr limits",
  (jahr) => {
    const d = descriptions(jahr);
    expect(d["[Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre"]).toContain(
      "gilt für Baualtersklassen bis einschließlich 1990",
    );
    expect(
      d["[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug"],
    ).toContain("gilt nicht für die Baualtersklassen bis 1949");
    expect(
      d["[Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen"],
    ).toContain("gilt nicht für die Baualtersklassen ab 2010");
    expect(
      d[
        "[Gebäude+] Gebäude ist in überdurchschnittlich gutem Instandhaltungszustand"
      ],
    ).toMatch(/gilt für (die )?Baualtersklassen bis einschließlich 2015/);
  },
);

test.each(["2024", "2026"])(
  "%s: building clauses preserve AND and the access/storage requirements",
  (jahr) => {
    const d = descriptions(jahr);
    expect(
      d[
        "[Gebäude-] Gebäude Treppenbereich/Eingangsbereich in schlechtem Zustand"
      ],
    ).toBe("Treppenhaus und Eingangsbereich überwiegend in schlechtem Zustand");
    expect(d["[Gebäude+] Gebäude hat hochwertigen Eingangsbereich"]).toContain(
      "Eingangsbereich und Treppenhaus",
    );
    expect(d["[Gebäude-] Gebäude Hauseingangstür ist nicht abschließbar"]).toBe(
      jahr === "2024"
        ? "Jederzeit von außen frei zugänglicher Hauseingang"
        : "Jederzeit von außen frei zugänglicher Hauseingang/Treppenhaus",
    );
    expect(
      d["[Gebäude-] Gebäude hat keinen Mieterkeller oder Kellerersatzraum"],
    ).toContain(
      "Kein Abstellraum außerhalb der Wohnung zur alleinigen Nutzung ohne Zusatzkosten",
    );
    expect(d["[Gebäude-] Gebäude hat unzureichende Wärmedämmung"]).toContain(
      "oder Heizanlage mit ungünstigem Wirkungsgrad (Einbau/Installation der Heizanlage vor 1995)",
    );
  },
);

test.each(["2024", "2026"])(
  "%s: guest-WC exclusions apply only to the listed clauses",
  (jahr) => {
    const excluded = Object.entries(descriptions(jahr))
      .filter(([, text]) =>
        /bezieht sich (beides )?nicht auf Gäste-WCs/.test(text),
      )
      .map(([merkmal]) => merkmal)
      .sort();
    expect(excluded).toEqual(
      [
        "[Bad-] Bad ohne Handwaschbecken",
        "[Bad-] WC ohne Entlüftung",
        "[Bad-] Bad mit Dielenfußboden",
        "[Bad-] Bad ohne Heizung",
        "[Bad-] Bad ohne ausreichende Warmwasserversorgung",
        "[Bad-] Bad Wände nicht gefliest",
        "[Bad+] Bad hat großes Waschbecken",
        "[Bad+] Bad hat hochwertige Ausstattung",
        "[Bad+] Bad hat moderne Entlüftung",
        "[Bad+] Bad ist groß",
        "[Bad+] Bad hat Fußbodenheizung",
        "[Bad+] Bad hat hochwertige Boden- oder Wandfliesen",
        "[Bad+] Bad hat wandhängendes WC",
        "[Bad+] Bad hat Strukturheizkörper",
      ].sort(),
    );
    expect(descriptions(jahr)["[Bad+] Bad hat wandhängendes WC"]).toContain(
      "Spülkasten (gilt nicht für die Baualtersklassen ab 2002) oder",
    );
  },
);

test("the 2024 electric towel-heater alternative does not inherit the 2026 additional-electric restriction", () => {
  expect(descriptions("2024")["[Bad+] Bad hat Strukturheizkörper"]).toContain(
    "; falls elektrisch betreibbar: alle Baujahre",
  );
  expect(descriptions("2026")["[Bad+] Bad hat Strukturheizkörper"]).toContain(
    "; sofern zusätzlich elektrisch betreibbar: alle Baujahre",
  );
});

test("parking capacity starts in 2019 and the questionnaire explains it in both languages", () => {
  const merkmal = "[Umfeld+] Vom Vermieter zur Verfügung gestellter Parkplatz";
  expect(descriptions("2017")[merkmal]).not.toContain(
    "ausreichend dimensioniert",
  );
  for (const jahr of ["2019", "2021", "2023", "2024", "2026"]) {
    expect(descriptions(jahr)[merkmal]).toContain(
      "(ausreichend dimensioniert)",
    );
  }
  const question = allQuestionNodes.find(
    ({ node }) => node.alias === "Wohnumfeld hat Parkplatz",
  )!.node;
  expect(question.info).toContain(
    "Ab dem Mietspiegel 2019 muss es ausreichend dimensioniert sein.",
  );
  expect(EN.strings[hash(question.info!) as keyof typeof EN.strings]).toBe(
    "Please note: Parking may also be subject to a charge. From the 2019 rent index onwards, the parking provision must have sufficient capacity.",
  );
});

const answerStates = [
  ["Ja", "checked"],
  ["Nein", "unchecked"],
  ["Nicht sicher", "maybe"],
] as const;

test.each(
  ["2024-2026", ">2026"].flatMap((Vertragsdatum) =>
    [2013, 2016].flatMap((Baujahr) =>
      answerStates.map(([answer, expected]) => ({
        Vertragsdatum,
        Baujahr,
        answer,
        expected,
      })),
    ),
  ),
)(
  "$Vertragsdatum, Baujahr $Baujahr, $answer: building-condition boundary retains answer states",
  ({ Vertragsdatum, Baujahr, answer, expected }) => {
    const result = evaluateAnswers({
      ...BASE_ANSWERS,
      ...MERKMAL_RESET_ANSWERS,
      ...SONDERMERKMAL_RESET_ANSWERS,
      Vertragsdatum,
      Baujahr,
      "Gebäude ist in schlechtem Zustand": "Nein",
      "Gebäude ist in gutem Zustand": answer,
    });
    expect(result.visible.has("Gebäude ist in gutem Zustand")).toBe(
      Baujahr <= 2015,
    );
    expect(
      getMerkmalStates(result.answers as FinalAnswers, result.visible)[
        "[Gebäude+] Gebäude ist in überdurchschnittlich gutem Instandhaltungszustand"
      ],
    ).toBe(Baujahr <= 2015 ? expected : "unchecked");
  },
);

test.each(answerStates)(
  "2017 floor: %s retains its mapping without a moisture exception",
  (answer, expected) => {
    const result = evaluateAnswers({
      ...BASE_ANSWERS,
      ...MERKMAL_RESET_ANSWERS,
      ...SONDERMERKMAL_RESET_ANSWERS,
      Vertragsdatum: "2016-2018",
      Baujahr: 1930,
      "Bad mit Dielenfußboden": answer,
    });
    expect(
      allQuestionNodes.find(
        ({ node }) => node.id === result.nodeIds.get("Bad mit Dielenfußboden"),
      )?.node,
    ).toMatchObject({
      text: "Gibt es ein Badezimmer mit Dielenfußboden?",
    });
    expect(
      getMerkmalStates(result.answers as FinalAnswers, result.visible)[
        "[Bad-] Bad mit Dielenfußboden"
      ],
    ).toBe(expected);
  },
);

test.each(["2024", "2026"])(
  "%s: building-condition description includes 2015 and excludes 2016",
  (jahr) => {
    // The Miete flow exits for post-2014 Neubauten before this question. Check
    // the clause boundary itself rather than bypassing that intentional exit.
    expect(
      excludedPeriodsFromText(
        descriptions(jahr)[
          "[Gebäude+] Gebäude ist in überdurchschnittlich gutem Instandhaltungszustand"
        ],
        [2015, 2016].map((year) => ({
          from: year,
          to: year,
          label: String(year),
        })),
      ),
    ).toEqual(["2016"]);
  },
);

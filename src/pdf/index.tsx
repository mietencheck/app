import { PDFDocument, type PDFForm } from "pdf-lib";
import { entries } from "remeda";
import useSWRImmutable from "swr/immutable";

import {
  StepInfoByAlias,
  useAnswers,
  useVisibleQuestionAliases,
} from "~/form/flow-machine";
import { getAllCheckedMerkmale } from "~/form/rechner/MerkmalsGruppen";
import {
  getWorstBestSondermerkmalZuschlag,
  sondermerkmalZuschläge2015,
} from "~/form/rechner/Sondermerkmale";
import { parseAdresse } from "~/utils";

import {
  availableYears,
  FieldsByYear,
  getPDF_URL,
  type AvailableYear,
} from "./fields";

type State = StepInfoByAlias["Auswertung"]["state"];

type FieldType<F> = F extends { type: "checkBox" }
  ? boolean
  : F extends { type: "radioGroup"; value: infer T }
    ? { type: "radioGroup"; value: T }
    : string;

type SharedFieldKeys = keyof FieldsByYear[keyof FieldsByYear];
const sharedAnswerMappings: {
  [Key in SharedFieldKeys]?: (
    state: State,
  ) => FieldType<FieldsByYear[keyof FieldsByYear][Key]>;
} = {
  Datum: () => new Date().toLocaleDateString("de-DE"),
  "Wohnung PLZ": (s) => (s.Adresse ? parseAdresse(s.Adresse).plz : ""),
  Kaltmiete: (s) => `${s.Kaltmiete}`,
  Indexmiete: (s) => ({
    type: "radioGroup",
    value: s.Mietart == "Indexmiete" ? "Ja" : "Nein",
  }),
  Staffelmiete: (s) => ({
    type: "radioGroup",
    value: s.Mietart == "Staffelmiete" ? "Ja" : "Nein",
  }),
  Wohnungsgröße: (s) => `${s.Qm ?? ""}`,
};

const answerMappingsByYear = {
  "2023": { ...sharedAnswerMappings },
  "2021": { ...sharedAnswerMappings },
  "2019": { ...sharedAnswerMappings },
  "2017": { ...sharedAnswerMappings },
  "2015": { ...sharedAnswerMappings },
} satisfies {
  [Year in AvailableYear]: {
    [Key in keyof FieldsByYear[Year]]?: (
      state: State,
    ) => FieldType<FieldsByYear[Year][Key]>;
  };
};

function fillPDF({
  year,
  form,
  state,
  visibleQuestionAliases,
}: {
  year: AvailableYear;
  form: PDFForm;
  state: State;
  visibleQuestionAliases: Set<string>;
}) {
  if (year == "2015") {
    for (const [key, tuple] of Object.entries(sondermerkmalZuschläge2015)) {
      const z = getWorstBestSondermerkmalZuschlag(
        tuple,
        state,
        visibleQuestionAliases,
      );
      if (z.state != "maybe") {
        form
          .getRadioGroup("[S] " + key)
          .select(z.state == "checked" ? "Ja" : "Nein");
      }
    }
  }
  try {
    for (const [key, getValue] of entries.strict(answerMappingsByYear[year])) {
      try {
        const value = getValue(state);
        if (typeof value === "boolean") {
          form.getCheckBox(key)[value ? "check" : "uncheck"]();
        } else if (typeof value == "string") {
          form.getTextField(key).setText(value);
        } else if (value.type === "radioGroup") {
          form.getRadioGroup(key).select(value.value);
        }
      } catch (e) {
        console.error("Error while setting field", key, e);
      }
    }
    for (const key of getAllCheckedMerkmale(state, visibleQuestionAliases)) {
      try {
        form.getCheckBox(key).check();
      } catch (e) {
        console.error("Error while checking Merkmal", key, e);
      }
    }
  } catch (e) {
    console.error("Error while setting fields", e);
  }
}

async function fetchPDF(year: AvailableYear) {
  return (await fetch(getPDF_URL(year))).arrayBuffer();
}

async function fetchAndFillPDF(
  year: AvailableYear,
  state: State,
  visibleQuestionAliases: Set<string>,
) {
  const pdfDoc = await PDFDocument.load(await fetchPDF(year));
  const form = pdfDoc.getForm();
  fillPDF({ year, form, state, visibleQuestionAliases });
  return window.URL.createObjectURL(
    new Blob([await pdfDoc.save()], { type: "application/pdf" }),
  );
}

export async function downloadPDF(
  year: AvailableYear,
  state: State,
  visibleQuestionAliases: Set<string>,
) {
  const blobURL = await fetchAndFillPDF(year, state, visibleQuestionAliases);
  const a = document.createElement("a");
  a.href = blobURL;
  a.download = "Mietencheck.pdf";
  a.click();
}

export default function PDFs() {
  const answers = useAnswers();
  const visibleQuestionAliases = useVisibleQuestionAliases();
  const state = answers.getAliasedState() as State;
  const { data: pdfBlobURLs } = useSWRImmutable(JSON.stringify(state), () =>
    Promise.all(
      availableYears.map((year) =>
        fetchAndFillPDF(year, state, visibleQuestionAliases),
      ),
    ),
  );

  if (!pdfBlobURLs) {
    return null;
  }
  return (
    <div key={JSON.stringify(answers.state)} className="flex flex-row w-fit">
      {pdfBlobURLs.map((blobURL, i) => (
        <iframe key={i} src={blobURL} className="w-[640px] h-screen" />
      ))}
    </div>
  );
}

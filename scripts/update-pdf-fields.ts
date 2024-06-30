import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";

import * as ts from "dts-dom";
import { PDFDocument, type PDFField, type PDFForm } from "pdf-lib";
import { keys } from "remeda";

import { availableYears, getPDF_Path, type AvailableYear } from "~/pdf/fields";

const OUTPATH = "src/pdf/fields";

async function loadPdfArrayBuffer(year: AvailableYear) {
  return readFileSync(getPDF_Path(year)).buffer;
}

const fieldtypeGetters = {
  button: (form: PDFForm, fieldname: string) => form.getButton(fieldname),
  checkBox: (form: PDFForm, fieldname: string) => form.getCheckBox(fieldname),
  dropdown: (form: PDFForm, fieldname: string) => form.getDropdown(fieldname),
  optionList: (form: PDFForm, fieldname: string) =>
    form.getOptionList(fieldname),
  radioGroup: (form: PDFForm, fieldname: string) =>
    form.getRadioGroup(fieldname),
  signature: (form: PDFForm, fieldname: string) => form.getSignature(fieldname),
  textField: (form: PDFForm, fieldname: string) => form.getTextField(fieldname),
} as const;

function buildFieldProperty(field: PDFField): ts.PropertyDeclaration {
  const form = field.doc.getForm();
  const fieldName = field.getName();
  const fieldTypeName = keys.strict(fieldtypeGetters).find((key) => {
    try {
      fieldtypeGetters[key](form, fieldName);
      return true;
    } catch {
      return false;
    }
  });

  let fieldType: ts.Type;
  if (fieldTypeName) {
    fieldType = ts.create.objectType([
      ts.create.property("type", ts.type.stringLiteral(fieldTypeName)),
    ]);
    switch (fieldTypeName) {
      case "radioGroup":
        fieldType.members.push(
          ts.create.property(
            "value",
            ts.create.union(
              form
                .getRadioGroup(fieldName)
                .getOptions()
                .map((s) => ts.type.stringLiteral(s)),
            ),
          ),
        );
    }
  } else {
    fieldType = ts.type.null;
  }

  return ts.create.property(fieldName, fieldType);
}

async function main() {
  for (const year of availableYears) {
    const pdfDoc = await PDFDocument.load(await loadPdfArrayBuffer(year));
    const fields = pdfDoc.getForm().getFields();
    await writeFile(
      `${OUTPATH}/${year}.json`,
      JSON.stringify(
        fields.map((f) => f.getName()),
        null,
        2,
      ),
    );
    await writeFile(
      `${OUTPATH}/${year}.ts`,
      ts.emit(
        ts.create.alias(
          `Fields${year}`,
          ts.create.objectType(fields.map(buildFieldProperty)),
          ts.DeclarationFlags.Export,
        ),
      ),
    );
  }
}

main();

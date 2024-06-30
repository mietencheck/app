import { Table, TableBody, TableCell, TableRow } from "~/components";
import {
  getMietspiegelJahr,
  useAnswers,
  vertragsDatumToMietspiegelJahr,
} from "~/form/flow-machine";
import { useLocalizeField, useLocalizeString } from "~/l10n";
import { formatEuro, parseAdresse } from "~/utils";

export function DeineDatenTable() {
  const answers = useAnswers();
  const adresse = parseAdresse(answers.get("Adresse") as string);
  const l = useLocalizeField();
  const lString = useLocalizeString();

  const vertragsdatum = answers.getWithOptionAlias("Vertragsdatum");
  const mietspiegeljahr = vertragsdatum
    ? vertragsDatumToMietspiegelJahr[vertragsdatum]
    : null;

  const sammelheizung = answers.getWithOptionAlias("Wohnung hat Sammelheizung");
  const badezimmer = answers.getWithOptionAlias("Badezimmer in Wohnung");

  const nettokaltmiete = answers.getWithOptionAlias("Kaltmiete") || 0;
  const mietart = answers.getWithOptionAlias("Mietart");

  const baujahr = answers.getWithOptionAlias("Baujahr");
  const rows = [
    {
      label: l("Mietspiegel"),
      value: mietspiegeljahr,
    },
    {
      label: l("Adresse"),
      value: `${adresse.strasse} ${adresse.nummer}, ${adresse.plz} Berlin`,
    },
    {
      label: l("Wohnlage"),
      value: lString(
        parseAdresse(answers.get("Adresse") as string).lage[
          getMietspiegelJahr(vertragsdatum)!
        ]?.wohnlage || "",
      ),
    },
    ...(mietart !== "Normal"
      ? [
          {
            label: l("Mietvertrag"),
            value: lString(mietart || ""),
          },
        ]
      : []),
    {
      label: l("Gebäudealter"),
      value: baujahr == "-1918" ? `${l("Vor")} 1918` : baujahr,
    },
    {
      label: l("Wohnfläche"),
      value: `${answers.get("Qm")}m²`,
    },
    {
      label: l("Ausstattung"),
      value: `
        ${sammelheizung === "Nein" ? l("Ohne") : sammelheizung == "Nicht sicher" ? l("Vielleicht") : ""} ${l("Sammelheizung")},
        ${badezimmer === "Nein" ? l("Ohne") : badezimmer == "Nicht sicher" ? l("Vielleicht") : ""} ${l("Badezimmer")},
        ${l("WC in der Wohnung")}
      `,
    },
    {
      label: l("Nettokaltmiete"),
      value: formatEuro(nettokaltmiete),
    },
  ] satisfies { label: string; value: React.ReactNode }[];

  return (
    <Table>
      <TableBody>
        {rows.map(({ label, value }) => (
          <TableRow>
            <TableCell className="w-40">{label}</TableCell>
            <TableCell className="">{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

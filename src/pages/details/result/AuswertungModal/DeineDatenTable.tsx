import { Table, TableBody, TableCell, TableRow } from "~/components";
import {
  getAdresse,
  getAusstattung,
  getBaujahrSpanne,
  getMietspiegeljahr,
  getNettokaltmiete,
  getVertragsart,
  getWohnflaeche,
  getWohnlage,
} from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField, useLocalizeString } from "~/l10n";
import { formatEuro } from "~/utils";

export function DeineDatenTable() {
  const l = useLocalizeField();
  const lString = useLocalizeString();

  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const adresse = getAdresse(answers, visibleQuestionAliases) || {
    strasse: "",
    nummer: "",
    plz: "",
  };
  const wohnlage = getWohnlage(answers, visibleQuestionAliases) || "";
  const mietspiegeljahr = getMietspiegeljahr(answers, visibleQuestionAliases);
  const nettokaltmiete =
    getNettokaltmiete(answers, visibleQuestionAliases) || 0;
  const wohnflaeche = getWohnflaeche(answers, visibleQuestionAliases) || 0;
  const baujahrSpanne = getBaujahrSpanne(answers, visibleQuestionAliases);
  const vertragsart = getVertragsart(answers, visibleQuestionAliases) || "";
  const { sammelheizung, bad } = getAusstattung(
    answers,
    visibleQuestionAliases,
  );

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
      value: wohnlage,
    },
    ...(vertragsart !== "Normal"
      ? [
          {
            label: l("Mietvertrag"),
            value: lString(vertragsart || ""),
          },
        ]
      : []),
    {
      label: l("Gebäudealter"),
      value: baujahrSpanne == "-1918" ? `${l("Vor")} 1918` : baujahrSpanne,
    },
    {
      label: l("Wohnfläche"),
      value: `${wohnflaeche}m²`,
    },
    {
      label: l("Ausstattung"),
      value: `
        ${sammelheizung === "Nein" ? l("Ohne") : sammelheizung == "Nicht sicher" ? l("Vielleicht") : ""} ${l("Sammelheizung")},
        ${bad === "Nein" ? l("Ohne") : bad == "Nicht sicher" ? l("Vielleicht") : ""} ${l("Badezimmer")},
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
          <TableRow key={label}>
            <TableCell className="w-40">{label}</TableCell>
            <TableCell className="">{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

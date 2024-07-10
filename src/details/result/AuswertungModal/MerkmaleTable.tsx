import React, { useMemo } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui";
import {
  useAnswers,
  useVisibleQuestionAliases,
  vertragsDatumToMietspiegelJahr,
} from "~/form/flow-machine";
import {
  getMerkmalGruppeSpannen,
  getMerkmalStateMap,
  merkmaleByGruppe,
} from "~/form/rechner/MerkmalsGruppen";
import { AllPDFFields, fieldKeysByYear } from "~/pdf/fields";
import { isKeyOfObject } from "~/utils";

export function MerkmaleTable() {
  const answers = useAnswers();
  const aliasedAnswers = useMemo(() => answers.getAliasedState(), [answers]);
  const visibleQuestionAlises = useVisibleQuestionAliases();

  const datum = answers.getWithOptionAlias("Vertragsdatum");
  const jahr = datum ? vertragsDatumToMietspiegelJahr[datum] : null;

  const MERKMAL_LABELS = useMemo(
    () =>
      ({
        "[Bad-] k(l)ein Waschbecken":
          "Kein Handwaschbecken in Bad oder WC oder im Bad nur ein kleines Handwaschbecken (Außenmaß 50 x 25 cm oder kleiner)",
        "[Bad-] ohne Luft": "WC ohne Lüftungsmöglichkeit und Entlüftung",
        "[Bad-] Diele":
          jahr == "2015"
            ? "Dielenfußboden im Bad"
            : "Dielenfußboden im Bad (wenn nicht feuchtraumgeeignet)",
        "[Bad-] heizlos":
          "Bad oder WC nicht beheizbar oder Holz-/Kohleheizung oder Elektroheizstrahler ",
        "[Bad-] kaumwarm":
          "Keine ausreichende Warmwasserversorgung (keine zentrale Warm- wasserversorgung, kein Durchlauferhitzer, kein Boiler > 60 Liter)",
        "[Bad-] Spritzdusche":
          "Bad ohne separate Dusche mit frei stehender Badewanne mit oder ohne Verblendung in nicht modernisiertem Bad",
        "[Bad-] kaumflies":
          jahr == "2015"
            ? "Wände nicht überwiegend gefliest"
            : "Wände nicht ausreichend im Spritzwasserbereich von Waschbecken, Badewanne und/oder Dusche gefliest",
        "[Bad-] fensterlos": "Bad mit WC ohne Fenster",
        "[Bad-] duschlos": "Keine Duschmöglichkeit",
        "[Bad-] kleines Bad":
          jahr == "2015"
            ? "Nur wenn Sondermerkmal „kleines Bad (kleiner als 4 m2)“ nicht zutrifft: Kleines Bad (kleiner als 4 m2)"
            : "Kleines Bad (kleiner als 4 m2); gilt nicht in der Baualtersklasse 1973 bis 1990 Ost",

        "[Bad+] großes Waschbecken":
          "Sehr großes Waschbecken (Außenmaß mindestens 80 cm breit) oder Doppelhandwaschbecken oder zwei getrennte Waschbecken",
        "[Bad+] moderne Entlüftung":
          "Innen liegendes Badezimmer mit moderner, gesteuerter Entlüftung (z.B. mittels Feuchtigkeitssensor)",
        "[Bad+] 2tes WC": "Zweites WC in der Wohnung oder Bad und WC getrennt",
        "[Bad+] Großbad": "Mindestens ein Bad größer als 8 m2",
        "[Bad+] Fußbodenheizung": "Fußbodenheizung",
        "[Bad+] Edelboden":
          jahr == "2015"
            ? "Hochwertige Boden- oder Wandfliesen"
            : "Wandbekleidung und Bodenbelag hochwertig",
        "[Bad+] Edelausstattung":
          "Besondere und hochwertige Ausstattung (z.B. hochwertige Sanitärausstattung, hochwertige Badmöbel, Eckwanne, Rundwanne)",
        "[Bad+] Wand-WC":
          jahr == "2015"
            ? "nur wenn Sondermerkmal „Modernes Bad“ nicht zutrifft: Wandhängendes WC mit in der Wand eingelassenem Spülkasten"
            : jahr == "2017"
              ? "Wandhängendes WC mit in der Wand eingelassenem Spülkasten"
              : "Wandhängendes WC mit in der Wand eingelassenem Spülkasten; gilt nicht in der Baualtersklasse ab 2003",
        "[Bad+] Handtuchwärmer":
          jahr == "2015"
            ? "nur wenn Sondermerkmal „Modernes Bad“ nicht zutrifft: Strukturheizkörper als Handtuchwärmer"
            : "Strukturheizkörper als Handtuchwärmer",
        "[Bad+] Einhebelmischbatterie": "Einhebelmischbatterien",
        "[Bad+] Separate Badewanne":
          jahr == "2015"
            ? "Nur wenn Sondermerkmal „Von der Badewanne getrennte Dusche“ nicht zutrifft: Von der Badewanne getrennte Dusche "
            : "Von der Badewanne getrennte zusätzliche Duschtasse oder -kabine",

        "[Küche-] fensterlos":
          "Küche ohne Fenster und ohne ausreichende Entlüftung",
        "[Küche-] kochlos":
          "Keine Kochmöglichkeit oder Gas-/ Elektroherd ohne Backofen",
        "[Küche-] keine Spüle": "Keine Spüle",
        "[Küche-] kaumwarm":
          jahr == "2015"
            ? "Keine ausreichende Warmwasserversorgung (keine zentrale Warmwasserversorgung, kein Durchlauferhitzer, kein Boiler an der Spüle)"
            : "Keine ausreichende Warmwasserversorgung (z.B. keine zentrale Warmwasserversorgung, kein Durchlauferhitzer, kein Boiler)",
        "[Küche-] ohne Heizung":
          "Küche nicht beheizbar oder Holz-/ Kohleheizung",
        "[Küche-] kein Spüleranschluss":
          "Geschirrspüler in der Küche nicht stellbar oder anschließbar",

        "[Küche+] hochwertiger Boden":
          "Hochwertige Fliesen, hochwertiges Linoleum, hochwertiges Feuchtraum- laminat, Parkett, Terrazzo als Bodenbelag jeweils in gutem Zustand",
        "[Küche+] Wohnküche":
          "Wohnküche (separater Raum mit mind. 14 m2 Grundfläche)",
        "[Küche+] EBK":
          jahr == "2015"
            ? "Nur wenn Sondermerkmal „Moderne Küchenausstattung“ nicht zutrifft: Einbauküche mit Ober- und Unterschränken sowie Herd und Spüle"
            : "Einbauküche mit Ober- und Unter- schränken sowie Herd und Spüle",
        "[Küche+] Edelkochfeld":
          jahr == "2015"
            ? "Nur wenn Sondermerkmal „Moderne Küchenausstattung“ nicht zutrifft: Ceran-Kochfeld oder Induktions- Kochfeld"
            : "Ceran-Kochfeld oder Induktions- Kochfeld ",
        "[Küche+] Dunstabzug":
          jahr == "2015"
            ? "Nur wenn Sondermerkmal „Moderne Küchenausstattung“ nicht zutrifft: Dunstabzugshaube"
            : "Dunstabzug",
        "[Küche+] Kühlschrank": "Kühlschrank",

        "[Wohnung-] 1fach Glas": "Überwiegend Einfachverglasung",
        "[Wohnung-] schwache Elektronik":
          jahr == "2015"
            ? "Unzureichende Elektroinstallation: Kein gleichzeitiger Betrieb von mindestens zwei haushaltsüblichen größeren Elektrogeräten (z.B. Waschmaschine und Staubsauger) möglich oder weniger als zwei Steckdosen in Wohnräumen"
            : "Unzureichende Elektroinstallation, z.B. keine ausreichende Elektrosteigeleitung und/oder VDE-gerechte Elektroinstallation (z.B. kein FI- Schalter, Potentialausgleich)",
        "[Wohnung-] Elektronik sichtbar":
          "Elektroinstallation überwiegend sichtbar auf Putz",
        "[Wohnung-] Wässerung auf Putz":
          "Be- und Entwässerungsinstallation überwiegend auf Putz",
        "[Wohnung-] ohne Waschmaschinen-Anschluss":
          "Waschmaschine weder in Bad noch Küche stellbar oder nicht anschließbar",
        "[Wohnung-] schlechter Schnitt":
          "Schlechter Schnitt (z.B. gefangener Raum und/oder Durchgangsraum) ",
        "[Wohnung-] kein Balkon":
          jahr == "2015"
            ? "Kein Balkon (das Merkmal gilt nicht, wenn der Balkon aus baulichen und/oder rechtlichen Gründen nicht möglich oder nicht zulässig ist)"
            : "Kein Balkon, (Dach-)Terrasse, Loggia und Winter-/Dachgarten (gilt nicht, wenn das Merkmal aus baulichen und/oder rechtlichen Gründen nicht möglich oder nicht zulässig ist)",
        "[Wohnung-] kein Breitband":
          "Weder Breitbandkabelanschluss noch Gemeinschaftssatelliten-/Antennenanlage",

        "[Wohnung+] Einbauschrank":
          "Einbauschrank oder Abstellraum innerhalb der Wohnung",
        "[Wohnung+] großes Außen":
          "Großer, geräumiger Balkon, (Dach-) Terrasse, Loggia oder Wintergarten (ab 4 m2)",
        "[Wohnung+] Fußbodenheizung": "Überwiegend Fußbodenheizung",
        "[Wohnung+] Deckenverkleidung":
          jahr == "2015"
            ? "Aufwändige Deckenverkleidung (z.B. Stuck) oder getäfelte Wandverkleidung in gutem Zustand in der überwiegenden Anzahl der Wohnräume"
            : "Aufwändige Decken- und/oder Wandverkleidung (z.B. Stuck, Täfelung) in gutem Zustand in der überwiegenden Anzahl der Wohnräume",
        "[Wohnung+] Heizungsrohre nicht sichtbar":
          jahr == "2015"
            ? "Heizungsrohre überwiegend unter Putz"
            : "Heizungsrohre überwiegend nicht sichtbar",
        "[Wohnung+] Rückkanal-Breitband":
          "Rückkanalfähiger Breitbandkabelanschluss (Nutzung ohne zusätzliche vertragliche Bindung des Mieters mit Dritten) ",
        "[Wohnung+] Rollladen": "Rollläden",
        "[Wohnung+] Kaltwasserzähler":
          jahr == "2015"
            ? "Wohnungsbezogener Kaltwasserzähler, wenn der Mieter nicht die Kosten für Miete oder Leasing im Rahmen der Betriebskosten trägt"
            : jahr == "2017"
              ? "Wohnungsbezogener Kaltwasserzähler in vor 1998 bezugsfertigen Gebäuden/ Wohnungen, wenn der Mieter nicht die Kosten für Miete oder Leasing im Rahmen der Betriebskosten trägt"
              : "Wohnungsbezogener Kaltwasserzähler in vor 1991 bezugsfertigen Gebäuden/ Wohnungen, wenn der Mieter nicht die Kosten für Miete oder Leasing im Rahmen der Betriebskosten trägt",

        "[Wohnung+] großer Wohnraum": "Ein Wohnraum größer als 40 m2",
        "[Wohnung+] barrierearm":
          "Barrierearme Wohnungsgestaltung (Schwellenfreiheit in der Wohnung, schwellenarmer Übergang zu Balkon/Terrasse, ausreichende Bewegungsfreiheit in der Wohnung und/oder barrierearme Badgestaltung)",
        "[Wohnung+] Isolierverglasung":
          jahr == "2015"
            ? "Nur wenn Sondermerkmal „Überwiegend Isolierverglasung (ab 1987) oder Schallschutzfenster“ nicht zutrifft Überwiegend Isolierverglasung (Einbau ab 1987) oder Schallschutzfenster"
            : jahr == "2017"
              ? "Überwiegend Wärmeschutzverglasung (Einbau ab 1995) oder Schallschutzfenster für Wohngebäude/Wohnungen, die vor 1995 bezugsfertig geworden sind"
              : "Wohngebäude/Wohnungen die vor 2002 bezugsfertig geworden sind: überwiegend Wärmeschutzverglasung (Einbau ab 2002) oder Schallschutzfenster ",
        "[Wohnung+] hochwertiger Boden":
          jahr == "2015"
            ? "Nur wenn Sondermerkmal „Hochwertiges Parkett, Natur- /Kunststein, Fliesen oder gleichwertiger Boden/-belag in der überwiegenden Zahl der Wohnräume“ nicht zutrifft Hochwertiges Parkett, Natur-/Kunststein, Fliesen oder gleichwertiger Boden/-belag in der überwiegenden Zahl der Wohnräume"
            : "Hochwertiges Parkett, Natur- /Kunststein, Fliesen oder gleichwertiger Boden/-belag in der überwie- genden Zahl der Wohnräume",
        "[Wohnung+] Einbruchssicherung":
          "Zusätzliche Einbruchssicherung für die Wohnungstür (z.B. hochwertige Sperrbügel und/oder Türschlösser mit Mehrfachverriegelung) bei verstärkten Türen",

        "[Gebäude-] Treppenbereich schlecht":
          "Treppenhaus/Eingangsbereich überwiegend in schlechtem Zustand",
        "[Gebäude-] kein Keller/Abstellraum":
          jahr == "2015"
            ? "Kein nur dem Mieter zugänglicher, bestimmungsgemäß nutzbarer Abstellraum im Gebäude außerhalb der Wohnung vorhanden"
            : "Kein Mieterkeller oder Kellerersatzraum zur alleinigen Nutzung des Mieters vorhanden",
        "[Gebäude-] offene Haustür": "Hauseingangstür nicht abschließbar",
        "[Gebäude-] schlecht instand":
          "Schlechter Instandhaltungszustand (z.B. dauernde Durchfeuchtung des Mauerwerks - auch Keller -, große Putzschäden, erhebliche Schäden an der Dacheindeckung)",
        "[Gebäude-] Seitenlage":
          "Lage im Seitenflügel oder Quergebäude bei verdichteter Bebauung",
        "[Gebäude-] keine Gegensprechanlage":
          "Gegen-/Wechselsprechanlage mit elektrischem Türöffner",
        "[Gebäude-] keine Fahrradabstellmöglichkeit":
          "Keine Fahrradabstellmöglichkeit",
        "[Gebäude-] schleche Wärmedämmung":
          jahr == "2015"
            ? "Unzureichende Wärmedämmung oder Heizanlage mit ungünstigem Wirkungsgrad (Einbau/Installation vor 1984)"
            : "Unzureichende Wärmedämmung oder Heizanlage mit ungünstigem Wirkungsgrad (Einbau/Installation vor 1988)",
        "[Gebäude-] EVK>170":
          "Energieverbrauchskennwert größer als 170 kWh/(m²a)",
        "[Gebäude-] EVK>210":
          "Energieverbrauchskennwert größer als 210 kWh/(m²a)",
        "[Gebäude-] EVK>250":
          "Energieverbrauchskennwert größer als 250 kWh/(m²a)",
        "[Gebäude-] EVK>155":
          "Energieverbrauchskennwert größer als 155 kWh/(m²a)",
        "[Gebäude-] EVK>195":
          "Energieverbrauchskennwert größer als 195 kWh/(m²a)",
        "[Gebäude-] EVK>235":
          "Energieverbrauchskennwert größer als 235 kWh/(m²a)",
        "[Gebäude-] kein Aufzug":
          "Wohnung ab fünftem Obergeschoss ohne Personenaufzug",
        "[Gebäude+] geschlossener Fahrradraum":
          jahr == "2015"
            ? "Abschließbarer Fahrradabstellraum innerhalb oder außerhalb des Gebäudes"
            : jahr == "2017"
              ? "Abschließbarer leicht zugänglicher Fahrradabstellraum innerhalb des Gebäudes oder Fahrradabstellplätze mit Anschließmöglichkeit außerhalb des Gebäudes auf dem Grundstück"
              : "Abschließbarer leicht zugänglicher Fahrradabstellraum innerhalb des Gebäudes oder Fahrradabstellplätze mit Anschließmöglichkeit außerhalb des Gebäudes auf dem Grundstück (ausreichend dimensioniert)",
        "[Gebäude+] Partyraum":
          "Zusätzliche und in angemessenem Umfang nutzbare Räume außerhalb der Wohnung in fußläufiger Entfernung (z.B. Gemeinschaftsraum)",
        "[Gebäude+] Stellplatz":
          "Zur Wohnung gehörige(r) Garage/Stellplatz (ohne zusätzliches Entgelt)",
        "[Gebäude+] hochwertiger Eingang":
          "Repräsentativer/s oder hochwertig sanierter/s Eingangsbereich/Treppenhaus (z.B. Spiegel, Marmor, exklusive Beleuchtung, hochwertiger Anstrich / Wandbelag, Läufer im gesamten Flur- und Treppenbereich)",
        "[Gebäude+] einbruchsicher":
          "Einbruchhemmende Wohnungs- und Haustür (zusätzliche moderne Einbruchsicherungsmaßnahmen)",
        "[Gebäude+] Gegensprechanlage":
          "Gegen-/Wechselsprechanlage mit Videokontakt und elektrischem Türöffner",
        "[Gebäude+] Aufzug":
          jahr == "2015"
            ? "Nur wenn Sondermerkmal „Aufzug im Haus“ nicht zutrifft Personenaufzug bei weniger als fünf Obergeschossen"
            : "Personenaufzug bei weniger als fünf Obergeschossen",
        "[Gebäude+] Wärmedämmung":
          jahr == "2015"
            ? "Wärmedämmung zusätzlich zur vorhandenen Bausubstanz oder Einbau/Installation einer modernen Heizanlage nach dem 1.7.1994 (wenn Baujahr vor diesem Zeitpunkt)"
            : "Wärmedämmung zusätzlich zur vorhandenen Bausubstanz oder Einbau/Installation einer modernen Heizanlage nach dem 1.1.2003 (wenn Bezugsfertigkeit des Gebäudes/der Wohnung vor diesem Zeitpunkt)",
        "[Gebäude+] EVK<120":
          "Energieverbrauchskennwert kleiner als 120 kWh/(m²a)",
        "[Gebäude+] EVK<100":
          "Energieverbrauchskennwert kleiner als 100 kWh/(m²a)",
        "[Gebäude+] EVK<80":
          "Energieverbrauchskennwert kleiner als 80 kWh/(m²a)",

        "[Umfeld-] vernachlässigt":
          "Lage in stark vernachlässigter Umgebung in einfacher Wohnlage",
        "[Umfeld-] Verkehrsnähe":
          "Lage der Wohnung an einer Straße oder Schienenstrecke mit hoher Verkehrslärmbelastung oder Belastung durch Flugverkehr nach Maßgabe der Erläuterungen zur Verkehrslärmbelastung unter Nr. 12 dieses Mietspiegels",
        "[Umfeld-] Gewerbenähe":
          "Erhebliche, regelmäßige Beeinträchtigung durch Geräusche oder Gerüche (Gewerbe), z.B. durch Liefer- und Kundenverkehr",
        "[Umfeld-] Müll": "Ungepflegte und offene Müllstandfläche",
        "[Umfeld-] Lärm":
          "Besonders lärmbelastete Lage (ein Indiz hierfür kann die Ausweisung einer hohen Verkehrslärmbelastung gemäß Erläuterungen unter Nr. 12 des Mietspiegelheftes sein)",
        "[Umfeld-] stinkt": "Besonders geruchsbelastete Lage",
        "[Umfeld-] kein Fahrradabstell":
          "Keine Fahrradabstellmöglichkeit auf dem Grundstück",

        "[Umfeld+] Citylage":
          "Bevorzugte Citylage (nahe repräsentativen, überregional ausstrahlenden Einkaufs-, Dienstleistungs- und Wohnstandorten)",
        "[Umfeld+] ruhig":
          jahr == "2015"
            ? "Lage an einer besonders ruhigen Straße oder besonders ruhige Innenlage"
            : "Besonders ruhige Lage",
        "[Umfeld+] Gestaltung":
          jahr == "2015"
            ? "Aufwändig gestaltetes Wohnumfeld auf dem Grundstück (z.B. Sitzbänke oder Ruhezonen, neu angelegte Wegebefestigung mit Grünflächen)"
            : "Aufwändig gestaltetes Wohnumfeld auf dem Grundstück (z.B. Kinderspielplatz - bei Bezugsfertigkeit des Gebäudes vor 2003, Sitzbänke oder Ruhezonen, gute Gehwegbefestigung mit Grünflächen und Beleuchtung) ",
        "[Umfeld+] Müllfläche":
          "Gepflegte Müllstandsfläche mit sichtbegrenzender Gestaltung; nur den Mietern zugänglich",
        "[Umfeld+] Villenartig": "Villenartige Mehrfamilienhäuser",
        "[Umfeld+] Garten":
          "Garten zur alleinigen Nutzung/Mietergarten ohne Entgelt oder zur Wohnung gehörender Garten mit direktem Zugang",
        "[Umfeld+] Parkplatz":
          "Vom Vermieter zur Verfügung gestelltes PKW-Parkplatzangebot in der Nähe",
      }) satisfies Partial<Record<AllPDFFields, string>>,
    [jahr],
  );

  const spannen = getMerkmalGruppeSpannen(
    answers.getAliasedState(),
    visibleQuestionAlises,
  );

  return (
    <div className="flex flex-col gap-12">
      {Object.entries(merkmaleByGruppe).flatMap(([group, { pro, con }]) => {
        return (
          <div className="" key={group}>
            <h2 className="heading-20 mb-6">{group}</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Merkmal</TableHead>
                  <TableHead className="hidden sm:table-cell w-28 text-right">
                    Antwort
                  </TableHead>
                  <TableHead className="hidden sm:table-cell w-28 text-right">
                    Bester Fall
                  </TableHead>
                  <TableHead className="hidden sm:table-cell w-36 text-right">
                    Schlechtester Fall
                  </TableHead>
                  <TableHead className="sm:hidden w-36 text-right">
                    Wert
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(
                  [
                    [pro, "+"],
                    [con, "-"],
                  ] as const
                ).map(([fields, sign]) =>
                  Object.entries(
                    getMerkmalStateMap(
                      { group, sign },
                      fields,
                      aliasedAnswers,
                      visibleQuestionAlises,
                    ),
                  ).map(([merkmal, state]) => {
                    const pdfFieldKey = `[${group}${sign}] ${merkmal}`;
                    if (!jahr || !fieldKeysByYear[jahr].has(pdfFieldKey)) {
                      return null;
                    }

                    const label = isKeyOfObject(pdfFieldKey, MERKMAL_LABELS)
                      ? MERKMAL_LABELS[pdfFieldKey]
                      : merkmal;
                    const antwort =
                      state &&
                      { checked: "Ja", unchecked: "Nein", maybe: "Vielleicht" }[
                        state
                      ];
                    const best =
                      state == "maybe"
                        ? sign == "+"
                          ? `0`
                          : `-1`
                        : state == "unchecked"
                          ? "0"
                          : `${sign}1`;
                    const worst =
                      state == "maybe"
                        ? sign == "+"
                          ? `+1`
                          : `0`
                        : state == "unchecked"
                          ? "0"
                          : `${sign}1`;

                    return (
                      <React.Fragment key={label}>
                        <TableRow className="hidden sm:table-row">
                          <TableCell>{label}</TableCell>
                          <TableCell className="w-28 text-right">
                            {antwort}
                          </TableCell>
                          <TableCell className="w-28 text-right">
                            {best}
                          </TableCell>
                          <TableCell className="w-36 text-right">
                            {worst}
                          </TableCell>
                        </TableRow>
                        <TableRow className="sm:hidden border-b-0">
                          <TableCell
                            colSpan={2}
                            className="text-sm-medium pb-0"
                          >
                            {label}
                          </TableCell>
                        </TableRow>
                        <TableRow className="sm:hidden border-b-0">
                          <TableCell className="text-neutral-faded pb-0">
                            Bester Fall
                          </TableCell>
                          <TableCell className="w-36 text-right pb-0">
                            {best}
                          </TableCell>
                        </TableRow>
                        <TableRow className="sm:hidden">
                          <TableCell className="text-neutral-faded">
                            Schlechtester Fall
                          </TableCell>
                          <TableCell className="w-36 text-right">
                            {worst}
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  }),
                )}
                <TableRow className="hidden sm:table-row">
                  <TableCell colSpan={2} className="text-sm-medium">
                    Summe
                  </TableCell>
                  <TableCell className="w-28 text-right">
                    {spannen[group as keyof typeof spannen][1]}
                  </TableCell>
                  <TableCell className="w-36 text-right">
                    {spannen[group as keyof typeof spannen][0]}
                  </TableCell>
                </TableRow>
                <TableRow className="sm:hidden border-b-0">
                  <TableCell colSpan={2} className="text-sm-medium pb-0">
                    Summe
                  </TableCell>
                </TableRow>
                <TableRow className="sm:hidden border-b-0">
                  <TableCell className="text-neutral-faded pb-0">
                    Bester Fall
                  </TableCell>
                  <TableCell className="w-36 text-right pb-0">
                    {spannen[group as keyof typeof spannen][1]}
                  </TableCell>
                </TableRow>
                <TableRow className="sm:hidden">
                  <TableCell className="text-neutral-faded">
                    Schlechtester Fall
                  </TableCell>
                  <TableCell className="w-36 text-right">
                    {spannen[group as keyof typeof spannen][0]}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
}

import { ReactNode, useEffect, useMemo, useState } from "react";

import {
  ApiError,
  getMietenFlows,
  putMietenFlow,
} from "~/api/mietencheck-backend";
import { useAuth } from "~/auth/AuthContext";
import { getWorstBestAusstattungsAbzug } from "~/calculation/ausstattungsAbzug";
import {
  calcMerkmalsgruppenValueInEuro,
  getWorstBestOrtsueblicheVergleichsmiete,
} from "~/calculation/ortsueblicheVergleichsmiete";
import { getWorstBestPreisspanne } from "~/calculation/preisspanne";
import { getWorstBestSondermerkmalModifier } from "~/calculation/sondermerkmale";
import {
  getWorstBestMerkmalStateByMerkmalGrupppeInPercent,
  getWorstBestSpanneneinordnungInPercent,
} from "~/calculation/spanneneinordnung";
import { getWorstBestZulaessigeHoechstmiete } from "~/calculation/zulaessigeHoechstmiete";
import {
  Button,
  CheckIcon,
  CloseIcon,
  HelpCircleIcon,
  LinkOld,
  NumberInput,
  SegmentedControl,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import { merkmaleDescriptionsByYear } from "~/mietspiegel/merkmale";
import { sondermerkmale } from "~/mietspiegel/sondermerkmale";
import { AppRouter } from "~/router";
import { formatEuro } from "~/utils";

import { Layout } from "../Layout";
import {
  getBaujahrSpanneOptions,
  getMietspiegeljahrFromVertragsdatum,
  getSelectedWohnflaecheSpanne,
  getSondermerkmalOptions,
  getWohnflaecheSpanneOptions,
  recordToCalculationContext,
  vertragsdatumOptions,
  wohnlageOptions,
} from "../logic";
import { parseStoredFlowDataAsBeratungRecord } from "../parseStoredFlowData";
import {
  BeratungRecord,
  MerkmaleByGruppe,
  MerkmalState,
  SubgroupKey,
} from "../types";

function BeratungDetailHeading() {
  return (
    <div className="mb-8">
      <LinkOld
        href={AppRouter.Beratung()}
        className="text-sm font-450 text-purple-11-solid underline"
      >
        Zur Übersicht
      </LinkOld>
      <h1 className="heading-22 text-purple-11 mt-2">Beratung</h1>
    </div>
  );
}

const merkmalOptions: {
  value: MerkmalState;
  label: string;
  icon: ReactNode;
}[] = [
  {
    value: "checked",
    label: "Ja",
    icon: <CheckIcon className="w-5 h-5" aria-hidden />,
  },
  {
    value: "unchecked",
    label: "Nein",
    icon: <CloseIcon className="w-5 h-5" aria-hidden />,
  },
  {
    value: "maybe",
    label: "Nicht sicher",
    icon: <HelpCircleIcon className="w-5 h-5" aria-hidden />,
  },
];

const subgroupLabels: Record<SubgroupKey, string> = {
  Wohnwerterhoehend: "Wohnwerterhöhend",
  Wohnwertmindernd: "Wohnwertmindernd",
};
const sondermerkmalLabels = sondermerkmale as Record<string, string>;

type ResultRow = { name: string; best: string; worst: string };
type FlowMeta = {
  folder_uuid: string;
  datasheet_uuid: string;
  lawAndOrgaURL: string;
};

export function BeratungDetailPage({ mietenFlowId }: { mietenFlowId: string }) {
  const { getValidToken, logout } = useAuth();
  const [beratungRecord, setBeratungRecord] = useState<BeratungRecord | null>(
    null,
  );
  const [state, setState] = useState<MerkmaleByGruppe | null>(null);
  const [flowMeta, setFlowMeta] = useState<FlowMeta | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [savePending, setSavePending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = getValidToken();
      if (!token) return;
      setLoadError(null);
      setSaveError(null);
      setSaveMessage(null);
      setBeratungRecord(null);
      setState(null);
      setFlowMeta(null);

      try {
        const flows = await getMietenFlows(token);
        if (cancelled) return;
        const flow = flows.find((f) => f._id === mietenFlowId);
        if (!flow) {
          setLoadError("Eintrag nicht gefunden.");
          return;
        }
        const record = parseStoredFlowDataAsBeratungRecord(
          flow.flowData as Record<string, unknown>,
        );
        if (!record) {
          setLoadError("Beratungsdaten konnten nicht gelesen werden.");
          return;
        }
        const recordCopy = structuredClone(record);
        setBeratungRecord(recordCopy);
        setState(structuredClone(recordCopy.merkmale));
        setFlowMeta({
          folder_uuid: flow.folder_uuid,
          datasheet_uuid: flow.datasheet_uuid,
          lawAndOrgaURL: flow.lawAndOrgaURL,
        });
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          logout();
          return;
        }
        if (!cancelled) {
          setLoadError("Laden fehlgeschlagen.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mietenFlowId, getValidToken, logout]);

  const mietspiegeljahr = useMemo(
    () =>
      beratungRecord
        ? getMietspiegeljahrFromVertragsdatum(beratungRecord.vertragsdatum)
        : undefined,
    [beratungRecord],
  );

  const descriptions = useMemo(
    () =>
      mietspiegeljahr
        ? (merkmaleDescriptionsByYear[mietspiegeljahr] ?? {})
        : {},
    [mietspiegeljahr],
  );

  const baujahrSpanneOptions = useMemo(() => {
    return getBaujahrSpanneOptions(mietspiegeljahr);
  }, [mietspiegeljahr]);

  const vertragsdatumItems = useMemo(
    () => Object.fromEntries(vertragsdatumOptions.map((o) => [o, o] as const)),
    [],
  );

  const baujahrSpanneItems = useMemo(
    () => Object.fromEntries(baujahrSpanneOptions.map((o) => [o, o] as const)),
    [baujahrSpanneOptions],
  );

  const wohnlageItems = useMemo(
    () =>
      Object.fromEntries(
        wohnlageOptions.map((o) => [o.value, o.label] as const),
      ),
    [],
  );

  useEffect(() => {
    if (!beratungRecord || baujahrSpanneOptions.length === 0) return;

    if (!baujahrSpanneOptions.includes(beratungRecord.baujahrSpanne)) {
      setBeratungRecord((prev) =>
        prev ? { ...prev, baujahrSpanne: baujahrSpanneOptions[0] } : prev,
      );
    }
  }, [beratungRecord, baujahrSpanneOptions]);

  const wohnflaecheSpanneOptions = useMemo(() => {
    return getWohnflaecheSpanneOptions(
      mietspiegeljahr,
      beratungRecord?.baujahrSpanne,
      beratungRecord?.wohnlage,
    );
  }, [mietspiegeljahr, beratungRecord]);

  const sondermerkmalOptions = useMemo(() => {
    return getSondermerkmalOptions(mietspiegeljahr);
  }, [mietspiegeljahr]);

  const selectedWohnflaecheSpanne = useMemo(() => {
    if (!beratungRecord) return undefined;
    return getSelectedWohnflaecheSpanne(
      beratungRecord.wohnflaeche,
      wohnflaecheSpanneOptions,
    );
  }, [beratungRecord, wohnflaecheSpanneOptions]);

  const getDescription = (
    gruppe: string,
    subKey: SubgroupKey,
    merkmal: string,
  ) => {
    const sign = subKey === "Wohnwerterhoehend" ? "+" : "-";
    return descriptions[`[${gruppe}${sign}] ${merkmal}`] || merkmal;
  };

  const zulaessigeHoechstmiete = useMemo(() => {
    if (!beratungRecord || !state) return undefined;
    return recordToCalculationContext(beratungRecord, state);
  }, [beratungRecord, state]);

  const resultData = useMemo(() => {
    if (!zulaessigeHoechstmiete) return undefined;

    const ausstattungsAbzug = getWorstBestAusstattungsAbzug(
      zulaessigeHoechstmiete,
    ) ?? {
      best: 0,
      worst: 0,
    };
    const preisspanne = getWorstBestPreisspanne(zulaessigeHoechstmiete) ?? {
      best: [0, 0, 0],
      worst: [0, 0, 0],
    };
    const spanneneinordnung = getWorstBestSpanneneinordnungInPercent(
      zulaessigeHoechstmiete,
    );
    const merkmalsgruppenByGruppe =
      getWorstBestMerkmalStateByMerkmalGrupppeInPercent(zulaessigeHoechstmiete);
    const sondermerkmalAufschlag = getWorstBestSondermerkmalModifier(
      zulaessigeHoechstmiete,
    );
    const ortsueblicheVergleichsmiete = getWorstBestOrtsueblicheVergleichsmiete(
      zulaessigeHoechstmiete,
    ) ?? { best: 0, worst: 0 };
    const hoechstmiete = getWorstBestZulaessigeHoechstmiete(
      zulaessigeHoechstmiete,
    ) ?? {
      best: 0,
      worst: 0,
    };

    return {
      ctx: zulaessigeHoechstmiete,
      ausstattungsAbzug,
      preisspanne,
      spanneneinordnung,
      merkmalsgruppenByGruppe,
      sondermerkmalAufschlag,
      ortsueblicheVergleichsmiete,
      hoechstmiete,
    };
  }, [zulaessigeHoechstmiete]);

  const setItem = (
    gruppe: string,
    subKey: SubgroupKey,
    merkmal: string,
    next: MerkmalState,
  ) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [gruppe]: {
          ...prev[gruppe],
          [subKey]: {
            ...prev[gruppe][subKey],
            [merkmal]: next,
          },
        },
      };
    });
  };

  const setVertragsdatum = (next: BeratungRecord["vertragsdatum"]) => {
    setBeratungRecord((prev) =>
      prev ? { ...prev, vertragsdatum: next } : prev,
    );
  };

  const setWohnlage = (next: BeratungRecord["wohnlage"]) => {
    setBeratungRecord((prev) => (prev ? { ...prev, wohnlage: next } : prev));
  };

  const setBaujahrSpanne = (next: string) => {
    setBeratungRecord((prev) =>
      prev ? { ...prev, baujahrSpanne: next } : prev,
    );
  };

  const setWohnflaeche = (next: number) => {
    setBeratungRecord((prev) => (prev ? { ...prev, wohnflaeche: next } : prev));
  };

  const setSondermerkmal = (merkmal: string, next: MerkmalState) => {
    setBeratungRecord((prev) =>
      prev
        ? {
            ...prev,
            sondermerkmale: {
              ...prev.sondermerkmale,
              [merkmal]: next,
            },
          }
        : prev,
    );
  };

  const onSave = async () => {
    if (!beratungRecord || !state || !flowMeta) return;
    const token = getValidToken();
    if (!token) return;

    setSavePending(true);
    setSaveError(null);
    setSaveMessage(null);

    try {
      await putMietenFlow(token, {
        folder_uuid: flowMeta.folder_uuid,
        datasheet_uuid: flowMeta.datasheet_uuid,
        lawAndOrgaURL: flowMeta.lawAndOrgaURL,
        flowData: {
          ...beratungRecord,
          merkmale: state,
        },
      });
      setSaveMessage("Änderungen wurden gespeichert.");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout();
        return;
      }
      if (e instanceof ApiError && e.status === 400) {
        setSaveError("Ungültige Daten. Bitte Eingaben prüfen.");
      } else if (e instanceof ApiError && e.status === 404) {
        setSaveError("Datensatz nicht gefunden.");
      } else {
        setSaveError("Speichern fehlgeschlagen. Bitte erneut versuchen.");
      }
    } finally {
      setSavePending(false);
    }
  };

  if (loadError) {
    return (
      <Layout>
        <BeratungDetailHeading />
        <p className="text-sm text-red-10" role="alert">
          {loadError}
        </p>
      </Layout>
    );
  }

  if (!beratungRecord || !state) {
    return (
      <Layout>
        <BeratungDetailHeading />
        <p className="text-sm text-gray-11">
          Lade Beratungsdaten aus dem Backend…
        </p>
      </Layout>
    );
  }

  return (
    <Layout
      headerTrailing={
        <Button
          size="sm"
          disabled={savePending}
          type="button"
          variant="outline"
          color="gray"
          onClick={onSave}
        >
          {savePending ? "Speichere…" : "Speichern"}
        </Button>
      }
    >
      <BeratungDetailHeading />
      {(saveError || saveMessage) && (
        <p
          className={`mb-6 text-sm ${saveError ? "text-red-10" : "text-green-11"}`}
          role={saveError ? "alert" : "status"}
        >
          {saveError ?? saveMessage}
        </p>
      )}
      <div className="flex flex-col gap-12">
        <section className="flex flex-col gap-4">
          <h2 className="heading-22">Angaben</h2>
          <div className="flex flex-col gap-4 rounded-lg border border-gray-6 rounded bg-white p-4">
            <div>
              <dt className="text-gray-11">Vertragsdatum</dt>
              <dd>
                <Select
                  value={beratungRecord.vertragsdatum || null}
                  onValueChange={(v) =>
                    setVertragsdatum(
                      String(v ?? "") as BeratungRecord["vertragsdatum"],
                    )
                  }
                  items={vertragsdatumItems}
                >
                  <SelectTrigger className="w-full" aria-label="Vertragsdatum">
                    <SelectValue placeholder="Vertragsdatum auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {vertragsdatumOptions.map((option) => (
                      <SelectItem key={option} value={option} label={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </dd>
            </div>
            <div>
              <dt className="text-gray-11">Baujahr Spanne</dt>
              <dd>
                <Select
                  value={beratungRecord.baujahrSpanne || null}
                  onValueChange={(v) => setBaujahrSpanne(String(v ?? ""))}
                  items={baujahrSpanneItems}
                >
                  <SelectTrigger className="w-full" aria-label="Baujahr Spanne">
                    <SelectValue placeholder="Baujahr Spanne auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {baujahrSpanneOptions.map((option) => (
                      <SelectItem key={option} value={option} label={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </dd>
            </div>
            <div>
              <dt className="text-gray-11">Wohnflaeche Spanne</dt>
              <dd>
                <NumberInput
                  aria-label="Wohnflaeche in qm"
                  value={String(beratungRecord.wohnflaeche)}
                  onChange={(value) => {
                    const parsed = Number(value);
                    if (Number.isNaN(parsed)) return;
                    setWohnflaeche(parsed);
                  }}
                />
                <p className="mt-1 text-xs text-gray-11">
                  Erkannte Spanne:{" "}
                  {selectedWohnflaecheSpanne ?? "keine passende Spanne"}
                </p>
              </dd>
            </div>
            <div>
              <dt className="text-gray-11">Wohnlage</dt>
              <dd>
                <Select
                  value={beratungRecord.wohnlage || null}
                  onValueChange={(v) =>
                    setWohnlage(String(v ?? "") as BeratungRecord["wohnlage"])
                  }
                  items={wohnlageItems}
                >
                  <SelectTrigger className="w-full" aria-label="Wohnlage">
                    <SelectValue placeholder="Wohnlage auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {wohnlageOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </dd>
            </div>
            <div>
              <dt className="text-gray-11">Ausstattung</dt>
              <dd>
                Sammelheizung: {beratungRecord.ausstattung.sammelheizung}, Bad:{" "}
                {beratungRecord.ausstattung.bad}
              </dd>
            </div>
          </div>
        </section>
        {sondermerkmalOptions.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="heading-22">Sondermerkmale</h2>
            <div className="rounded border border-gray-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 bg-gray-1 px-4 py-2 text-gray-11">
                <span>Merkmal</span>
                <span>Bewertung</span>
              </div>
              {sondermerkmalOptions.map((merkmal) => (
                <div
                  key={merkmal}
                  className="flex items-start gap-6 border-t border-gray-6 px-4 py-3"
                >
                  <p className="w-full">
                    {sondermerkmalLabels[merkmal] ?? merkmal}
                  </p>
                  <SegmentedControl
                    className="shrink-0"
                    aria-label={merkmal}
                    options={merkmalOptions}
                    value={
                      beratungRecord.sondermerkmale[merkmal] ?? "unchecked"
                    }
                    onValueChange={(next) => setSondermerkmal(merkmal, next)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
        {Object.entries(state).map(([gruppe, sub]) => (
          <section key={gruppe} className="flex flex-col gap-4">
            <h2 className="heading-22">{gruppe}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-6 rounded">
              {(Object.keys(sub) as SubgroupKey[]).map((subKey) => (
                <div
                  key={subKey}
                  className="overflow-hidden first:border-r first:border-gray-6"
                >
                  <h3 className="px-4 py-4 border-b border-gray-6 text-base-medium">
                    {subgroupLabels[subKey]}
                  </h3>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 bg-gray-1 px-4 py-2 text-gray-11">
                    <span>Merkmal</span>
                    <span>Bewertung</span>
                  </div>
                  {Object.entries(sub[subKey]).map(([merkmal, value]) => (
                    <div
                      key={merkmal}
                      className="flex items-start gap-6 border-t border-gray-6 px-4 py-3"
                    >
                      <p className="w-full">
                        {getDescription(gruppe, subKey, merkmal)}
                      </p>
                      <SegmentedControl
                        className="shrink-0"
                        aria-label={merkmal}
                        options={merkmalOptions}
                        value={value}
                        onValueChange={(next) =>
                          setItem(gruppe, subKey, merkmal, next)
                        }
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
        <section className="max-w-2xl">
          <h2 className="heading-22">Auswertung</h2>
          {!resultData ? (
            <p className="mt-2 text-gray-11">Nicht berechenbar</p>
          ) : (
            <div className="mt-4 flex flex-col gap-8 rounded border border-gray-6 bg-white p-4">
              {resultData.ausstattungsAbzug.best !==
                resultData.ausstattungsAbzug.worst && (
                <div>
                  <h3 className="heading-18 mb-4">Ausstattungsabzug</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Spanne</TableHead>
                        <TableHead className="w-40 text-right">
                          Niedrigste Miete
                        </TableHead>
                        <TableHead className="w-40 text-right">
                          Höchste Miete
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Wert</TableCell>
                        <TableCell className="w-40 text-right">
                          {formatEuro(resultData.ausstattungsAbzug.best)}
                        </TableCell>
                        <TableCell className="w-40 text-right">
                          {formatEuro(resultData.ausstattungsAbzug.worst)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              <div>
                <h3 className="heading-18 mb-4">Preisspanne</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Spanne</TableHead>
                      <TableHead className="w-40 text-right">
                        Niedrigste Miete
                      </TableHead>
                      <TableHead className="w-40 text-right">
                        Höchste Miete
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(
                      [
                        {
                          name: "Unterwert",
                          best: `${formatEuro(resultData.preisspanne.best[1])} pro m²`,
                          worst: `${formatEuro(resultData.preisspanne.worst[1])} pro m²`,
                        },
                        {
                          name: "Mittelwert",
                          best: `${formatEuro(resultData.preisspanne.best[0])} pro m²`,
                          worst: `${formatEuro(resultData.preisspanne.worst[0])} pro m²`,
                        },
                        {
                          name: "Oberwert",
                          best: `${formatEuro(resultData.preisspanne.best[2])} pro m²`,
                          worst: `${formatEuro(resultData.preisspanne.worst[2])} pro m²`,
                        },
                      ] satisfies ResultRow[]
                    ).map((row) => (
                      <TableRow key={row.name}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell className="w-40 text-right">
                          {row.best}
                        </TableCell>
                        <TableCell className="w-40 text-right">
                          {row.worst}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="heading-18 mb-4">Merkmalsgruppen</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merkmalsgruppe</TableHead>
                      <TableHead className="w-40 text-right">
                        Niedrigste Miete
                      </TableHead>
                      <TableHead className="w-40 text-right">
                        Höchste Miete
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(resultData.merkmalsgruppenByGruppe).map(
                      ([gruppe, value]) => (
                        <TableRow key={gruppe}>
                          <TableCell>{gruppe}</TableCell>
                          <TableCell className="w-40 text-right">
                            {value.best > 0 ? "+" : ""}
                            {Math.round(value.best * 100)}%
                          </TableCell>
                          <TableCell className="w-40 text-right">
                            {value.worst > 0 ? "+" : ""}
                            {Math.round(value.worst * 100)}%
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                    <TableRow>
                      <TableCell className="text-sm-medium">Gesamt</TableCell>
                      <TableCell className="w-40 text-right">
                        {resultData.spanneneinordnung.best > 0 ? "+" : ""}
                        {Math.round(resultData.spanneneinordnung.best * 100)}%
                      </TableCell>
                      <TableCell className="w-40 text-right">
                        {resultData.spanneneinordnung.worst > 0 ? "+" : ""}
                        {Math.round(resultData.spanneneinordnung.worst * 100)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="heading-20 mb-4">Ortsübliche Vergleichsmiete</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Spanne</TableHead>
                      <TableHead className="w-40 text-right">
                        Niedrigste Miete
                      </TableHead>
                      <TableHead className="w-40 text-right">
                        Höchste Miete
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(
                      [
                        {
                          name: "Mittelwert",
                          best: `${formatEuro(resultData.preisspanne.best[0])} pro m²`,
                          worst: `${formatEuro(resultData.preisspanne.worst[0])} pro m²`,
                        },
                        ...(resultData.ctx.mietspiegeljahr === "2015"
                          ? [
                              {
                                name: "Sondermerkmal Aufschlag",
                                best: formatEuro(
                                  resultData.sondermerkmalAufschlag.best,
                                ),
                                worst: formatEuro(
                                  resultData.sondermerkmalAufschlag.worst,
                                ),
                              },
                            ]
                          : []),
                        {
                          name: "Merkmalsgruppen (in Prozent)",
                          best: `${Math.round(resultData.spanneneinordnung.best * 100)}%`,
                          worst: `${Math.round(resultData.spanneneinordnung.worst * 100)}%`,
                        },
                        {
                          name: "Merkmalsgruppen (pro m²)",
                          best: `${formatEuro(
                            calcMerkmalsgruppenValueInEuro(
                              resultData.preisspanne.best,
                              resultData.spanneneinordnung.best,
                              resultData.sondermerkmalAufschlag.best,
                            ),
                          )} pro m²`,
                          worst: `${formatEuro(
                            calcMerkmalsgruppenValueInEuro(
                              resultData.preisspanne.worst,
                              resultData.spanneneinordnung.worst,
                              resultData.sondermerkmalAufschlag.worst,
                            ),
                          )} pro m²`,
                        },
                        {
                          name: "Ergebnis",
                          best: `${formatEuro(resultData.ortsueblicheVergleichsmiete.best)} pro m²`,
                          worst: `${formatEuro(resultData.ortsueblicheVergleichsmiete.worst)} pro m²`,
                        },
                      ] satisfies ResultRow[]
                    ).map((row) => (
                      <TableRow key={row.name}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell className="w-40 text-right">
                          {row.best}
                        </TableCell>
                        <TableCell className="w-40 text-right">
                          {row.worst}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="heading-20 mb-4">Zulässige Höchstmiete</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Spanne</TableHead>
                      <TableHead className="w-40 text-right">
                        Niedrigste Miete
                      </TableHead>
                      <TableHead className="w-40 text-right">
                        Höchste Miete
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(
                      [
                        {
                          name: "Ortsübliche Vergleichsmiete",
                          best: `${formatEuro(resultData.ortsueblicheVergleichsmiete.best)} pro m²`,
                          worst: `${formatEuro(resultData.ortsueblicheVergleichsmiete.worst)} pro m²`,
                        },
                        {
                          name: "10% Aufschlag",
                          best: `${formatEuro(resultData.ortsueblicheVergleichsmiete.best * 0.1)} pro m²`,
                          worst: `${formatEuro(resultData.ortsueblicheVergleichsmiete.worst * 0.1)} pro m²`,
                        },
                        {
                          name: "Wohnfläche",
                          best: `${resultData.ctx.wohnflaeche}m²`,
                          worst: `${resultData.ctx.wohnflaeche}m²`,
                        },
                        {
                          name: "Ergebnis",
                          best: `${formatEuro(resultData.hoechstmiete.best)} pro m²`,
                          worst: `${formatEuro(resultData.hoechstmiete.worst)} pro m²`,
                        },
                      ] satisfies ResultRow[]
                    ).map((row) => (
                      <TableRow key={row.name}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell className="w-40 text-right">
                          {row.best}
                        </TableCell>
                        <TableCell className="w-40 text-right">
                          {row.worst}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

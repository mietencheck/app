import cx from "classnames";
import { useMemo, useState } from "react";

import {
  calculateKappungsgrenze,
  IncreaseInput,
  IncreaseReason,
  Market,
} from "~/calculation/kappungsgrenze";
import {
  Button,
  DatePicker,
  FormDescription,
  FormField,
  FormLabel,
  Input,
  RadioGroup,
  Select,
  SelectOption,
} from "~/components";
import { Layout } from "~/pages/landing/layout";

const reasonOptions: { value: IncreaseReason; label: string }[] = [
  {
    value: "vergleichsmiete",
    label: "Mietspiegel, Vergleichsmieten oder § 558 BGB",
  },
  {
    value: "modernisierung",
    label: "Modernisierung oder bauliche Maßnahmen",
  },
  {
    value: "betriebskosten",
    label: "Erhöhung der Betriebskosten",
  },
  {
    value: "index",
    label: "Indexmiete",
  },
  {
    value: "staffel",
    label: "Staffelmiete",
  },
  {
    value: "sonstiges",
    label: "Keine der Optionen",
  },
];

function createIncrease(): IncreaseInput {
  return {
    id: `inc-${Math.random().toString(36).slice(2)}`,
    date: "",
    amountType: "delta",
    amount: null,
    reason: "",
    unknownDate: false,
    unknownAmount: false,
  };
}

function parseMoney(value: string): number | null {
  if (!value) return null;
  const cleaned = value.replace(/\s/g, "").replace(",", ".");
  const parsed = Number.parseFloat(cleaned);
  if (Number.isNaN(parsed)) return null;
  return parsed;
}

function formatMoney(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "–";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "–";
  return `${value.toFixed(1)} %`;
}

function formatWindowStartLabel(value: string | null) {
  if (!value) return "den letzten 3 Jahren";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "den letzten 3 Jahren";
  return `dem ${date.toLocaleDateString("de-DE")}`;
}

function IncreaseCard({
  value,
  onChange,
  title,
  errors,
  withContainer = true,
  showTitle = true,
}: {
  value: IncreaseInput;
  onChange: (next: IncreaseInput) => void;
  title: string;
  errors?: {
    date?: boolean;
    amount?: boolean;
    reason?: boolean;
  };
  withContainer?: boolean;
  showTitle?: boolean;
}) {
  return (
    <div
      className={
        withContainer
          ? "rounded border border-neutral bg-white p-4 space-y-4"
          : "space-y-12"
      }
    >
      {showTitle && (
        <div className="flex items-center justify-between">
          <h4 className="text-base-medium">{title}</h4>
        </div>
      )}
      <div className="grid gap-12">
        <FormField>
          <FormLabel htmlFor={`${value.id}-date`} alias={null} label="Datum" />
          <div className="mt-3">
            <DatePicker
              id={`${value.id}-date`}
              value={value.date ?? ""}
              onChange={(next) => onChange({ ...value, date: next })}
              className={cx(errors?.date && "ring-2 ring-red-500")}
            />
          </div>
        </FormField>
        <FormField>
          <FormLabel
            htmlFor={`${value.id}-amount`}
            alias={null}
            label="Erhöhungsbetrag"
          />
          <div className="mt-3">
            <Input
              id={`${value.id}-amount`}
              type="text"
              value={value.amount?.toString() ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  amount: parseMoney(e.target.value),
                })
              }
              className={cx(errors?.amount && "ring-2 ring-red-500")}
            />
          </div>
        </FormField>
      </div>
      <FormField>
        <FormLabel
          htmlFor={`${value.id}-reason`}
          alias={null}
          label="Begründung"
        />
        <div
          className={cx(
            "mt-3 rounded",
            errors?.reason && "ring-2 ring-red-500",
          )}
        >
          <Select
            selectedKey={value.reason}
            onSelectionChange={(key) =>
              onChange({ ...value, reason: key as IncreaseReason })
            }
            placeholder="Auswählen"
          >
            {reasonOptions.map((option) => (
              <SelectOption key={option.value} id={option.value}>
                {option.label}
              </SelectOption>
            ))}
          </Select>
        </div>
      </FormField>
    </div>
  );
}

export default function KappungsgrenzePage() {
  const [currentRent, setCurrentRent] = useState("");
  const [market, setMarket] = useState<Market>("normal");
  const [inBerlin, setInBerlin] = useState<"yes" | "no" | "">("");
  const [showResult, setShowResult] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [target, setTarget] = useState<IncreaseInput>(() => ({
    ...createIncrease(),
    id: "target",
    date: new Date().toISOString().slice(0, 10),
    amountType: "newRent",
  }));
  const [history, setHistory] = useState<IncreaseInput[]>([]);
  const [hasHistory, setHasHistory] = useState<"yes" | "no" | "">("");

  const parsedCurrentRent = parseMoney(currentRent);

  const result = useMemo(
    () =>
      calculateKappungsgrenze({
        currentRent: parsedCurrentRent,
        market,
        target: {
          ...target,
          amount: target.amount ?? null,
        },
        history: history.map((inc) => ({
          ...inc,
          amount: inc.amount ?? null,
        })),
      }),
    [parsedCurrentRent, market, target, history],
  );

  const usage = result.conservative.usagePercent;
  const status = result.conservative.exceeded;

  const validateForm = () => {
    const errors: string[] = [];

    if (!target.date) {
      errors.push("Bitte gib das Datum der Mieterhöhung an.");
    }

    if (!parsedCurrentRent || parsedCurrentRent <= 0) {
      errors.push("Bitte gib deine aktuelle Nettokaltmiete an.");
    }

    if (target.amount === null || target.amount === undefined) {
      errors.push("Bitte gib die neue Nettokaltmiete an.");
    }

    if (!target.reason) {
      errors.push("Bitte wähle den Grund der Mieterhöhung aus.");
    }

    if (!inBerlin) {
      errors.push("Bitte wähle aus, ob du in Berlin wohnst.");
    }

    if (inBerlin === "no" && !market) {
      errors.push("Bitte wähle die Kappungsgrenze für deinen Wohnort aus.");
    }

    if (target.reason !== "staffel" && target.reason !== "index") {
      if (!hasHistory) {
        errors.push("Bitte beantworte die Frage zu vorherigen Mieterhöhungen.");
      } else if (hasHistory === "yes") {
        history.forEach((entry, index) => {
          if (!entry.date) {
            errors.push(`Bitte gib das Datum für Erhöhung ${index + 1} an.`);
          }
          if (entry.amount === null || entry.amount === undefined) {
            errors.push(`Bitte gib den Betrag für Erhöhung ${index + 1} an.`);
          }
          if (!entry.reason) {
            errors.push(`Bitte wähle den Grund für Erhöhung ${index + 1} aus.`);
          }
        });
      }
    }

    return errors;
  };

  return (
    <Layout>
      <section className="bg-purple-9">
        <div className="container pt-12 pb-24 text-center">
          <h1 className="mx-auto max-w-[700px] title-40 sm:title-48 md:title-52 inline-flex flex-col gap-2 items-center transform -rotate-6">
            <span className="inline-block px-4 py-3 text-purple-11 bg-yellow-9">
              Kappungsgrenze
            </span>
            <span className="inline-block px-4 py-3 text-purple-11 bg-yellow-9">
              Rechner
            </span>
          </h1>
          <p className="mx-auto mt-12 max-w-[640px] text-lg-book text-yellow-11">
            Hast du eine Mieterhöhung bekommen? Überprüfe jetzt schnell und
            kostenlos, ob die Mieterhöhung die Kappungsgrenze überschreitet und
            somit nicht rechtens ist.
          </p>
        </div>
      </section>

      <section className="bg-page">
        <div className="container max-w-[640px] py-16 space-y-12">
          <section className="space-y-12 bg-white p-6">
            <h2 className="heading-24">Allgemeine Angaben</h2>
            <FormField>
              <FormLabel
                className="text-lg-book"
                htmlFor="in-berlin"
                alias={null}
                label="Wohnst du in Berlin?"
              />
              <div className="mt-3">
                <RadioGroup
                  id="in-berlin"
                  value={inBerlin}
                  onChange={(value) => {
                    const next = value as "yes" | "no";
                    setInBerlin(next);
                    if (next === "yes") setMarket("tight");
                  }}
                  options={[
                    { value: "yes", label: "Ja" },
                    { value: "no", label: "Nein" },
                  ]}
                />
              </div>
            </FormField>
            {inBerlin === "no" && (
              <FormField>
                <FormLabel
                  className="text-lg-book"
                  htmlFor="market"
                  alias={null}
                  label="Welche Kappungsgrenze gilt für deinen Wohnort?"
                />
                <div className="mt-3">
                  <Select
                    selectedKey={market}
                    onSelectionChange={(key) => setMarket(key as Market)}
                    placeholder="Auswählen"
                  >
                    <SelectOption id="tight">
                      Angespannter Markt (15 %)
                    </SelectOption>
                    <SelectOption id="normal">
                      Normaler Markt (20 %)
                    </SelectOption>
                  </Select>
                </div>
              </FormField>
            )}
            <FormField>
              <FormLabel
                className="text-lg-book"
                htmlFor="current-rent"
                alias={null}
                label="Wie hoch ist deine aktuelle Nettokaltmiete in Euro?"
              />
              <FormDescription
                description={
                  'Die Nettokaltmiete ist unterschiedlich zur der "normalen" Kaltmiete. Der Wert sollte in deinem Mietvertrag stehen.'
                }
                className="text-base text-neutral-faded mt-1.5"
              />
              <div className="mt-3">
                <Input
                  id="current-rent"
                  type="text"
                  value={currentRent}
                  onChange={(e) => setCurrentRent(e.target.value)}
                />
              </div>
            </FormField>
            <h2 className="heading-24 pt-4">Aktuelle Mieterhöhung</h2>
            <FormField>
              <FormLabel
                className="text-lg-book"
                htmlFor="target-date"
                alias={null}
                label="Wann hast du die aktuelle Mieterhöhung bekommen?"
              />
              <div className="mt-3">
                <DatePicker
                  id="target-date"
                  value={target.date ?? ""}
                  onChange={(next) => setTarget({ ...target, date: next })}
                />
              </div>
            </FormField>

            <FormField>
              <FormLabel
                className="text-lg-book"
                htmlFor="target-amount"
                alias={null}
                label="Wie hoch ist die Nettokaltmiete, welche der Vermieter zukünftig fordert?"
              />
              <div className="mt-3">
                <Input
                  id="target-amount"
                  type="text"
                  value={target.amount?.toString() ?? ""}
                  onChange={(e) =>
                    setTarget({
                      ...target,
                      amountType: "newRent",
                      amount: parseMoney(e.target.value),
                    })
                  }
                  placeholder="z. B. 950,00"
                />
              </div>
            </FormField>
            <FormField>
              <FormLabel
                className="text-lg-book"
                htmlFor="target-reason"
                alias={null}
                label="Welche Grund für die Mieterhöhung hat der Vermieter im Schreiben angeführt?"
              />
              <div className="mt-3">
                <Select
                  id="target-reason"
                  selectedKey={target.reason}
                  onSelectionChange={(key) => {
                    const nextReason = key as IncreaseReason;
                    setTarget({ ...target, reason: nextReason });
                    if (nextReason === "staffel" || nextReason === "index") {
                      setHasHistory("no");
                      setHistory([]);
                    }
                  }}
                  placeholder="Auswählen"
                >
                  {reasonOptions.map((option) => (
                    <SelectOption key={option.value} id={option.value}>
                      {option.label}
                    </SelectOption>
                  ))}
                </Select>
              </div>
            </FormField>
            {target.reason !== "staffel" && target.reason !== "index" && (
              <>
                <h2 className="heading-24 pt-4">Vorherige Mieterhöhungen</h2>
                <FormField>
                  <FormLabel
                    className="text-lg-book"
                    htmlFor="has-history"
                    alias={null}
                    label={`Wurde deine Miete seit dem ${formatWindowStartLabel(
                      result.windowStart,
                    )} schon einmal erhöht?`}
                  />
                  <div className="mt-3">
                    <RadioGroup
                      id="has-history"
                      value={hasHistory}
                      onChange={(value) => {
                        const next = value as "yes" | "no";
                        setHasHistory(next);
                        if (next === "no") {
                          setHistory([]);
                        } else if (history.length === 0) {
                          setHistory([createIncrease()]);
                        }
                      }}
                      options={[
                        { value: "yes", label: "Ja" },
                        { value: "no", label: "Nein" },
                      ]}
                    />
                  </div>
                </FormField>
                {hasHistory === "yes" && (
                  <div className="space-y-4">
                    <p className="text-sm text-neutral-faded">
                      Trage die Erhöhungen in diesem Zeitraum ein.
                    </p>
                    <div className="space-y-4">
                      {history.map((entry, index) => (
                        <div key={entry.id} className="space-y-2">
                          <IncreaseCard
                            value={entry}
                            onChange={(next) =>
                              setHistory((items) =>
                                items.map((item) =>
                                  item.id === entry.id ? next : item,
                                ),
                              )
                            }
                            title={`Erhöhung ${index + 1}`}
                          />
                          <Button
                            variant="ghost"
                            color="neutral"
                            onPress={() =>
                              setHistory((items) =>
                                items.filter((item) => item.id !== entry.id),
                              )
                            }
                          >
                            Entfernen
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        variant="outline"
                        onPress={() =>
                          setHistory((items) => [...items, createIncrease()])
                        }
                      >
                        Weitere Erhöhung hinzufügen
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="pt-6 flex justify-end">
              <Button
                color="primary"
                variant="solid"
                onPress={() => {
                  const errors = validateForm();
                  setFormErrors(errors);
                  setShowResult(errors.length === 0);
                }}
                className="w-full text-center"
              >
                Berechnen
              </Button>
            </div>
            {formErrors.length > 0 && (
              <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 space-y-1">
                {formErrors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}
          </section>

          {showResult && (
            <section className="bg-white p-6 space-y-6">
              <p className="text-base text-neutral-faded mb-2">Ergebnis</p>
              <h2 className="heading-24 mb-6">
                Kappungsgrenze überschritten:{" "}
                {status === null ? "–" : status ? "Ja" : "Nein"}
              </h2>

              <h3 className="text-base-medium mb-2">Was bedeutet das?</h3>
              <div className="text-neutral-faded space-y-2 mb-6">
                <p>
                  Ausnutzung der Kappungsgrenze (konservativ):{" "}
                  {formatPercent(usage)}
                </p>
                <p>
                  Zeitraum: {result.windowStart ?? "–"} bis{" "}
                  {result.windowEnd ?? "–"}
                </p>
              </div>

              <h3 className="text-base-medium mb-2">Aufschlüsselung</h3>
              <div className="text-neutral-faded space-y-2">
                <p>
                  Miete vor 3 Jahren:{" "}
                  {formatMoney(result.conservative.baseRent)}
                </p>
                <p>
                  Max. zulässige Miete:{" "}
                  {formatMoney(result.conservative.maxAllowedRent)}
                </p>
                <p>
                  Summe berücksichtigter Erhöhungen:{" "}
                  {formatMoney(result.conservative.countedIncreaseSum)}
                </p>
              </div>

              {result.assumptions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base-medium">Annahmen</h3>
                  <ul className="list-disc list-inside text-sm text-neutral">
                    {result.assumptions.map((assumption) => (
                      <li key={assumption}>{assumption}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.warnings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base-medium">Hinweise</h3>
                  <ul className="list-disc list-inside text-sm text-neutral">
                    {result.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-neutral-faded">
                Keine Rechtsberatung. Der Rechner hilft bei einer ersten
                Einschätzung und ersetzt keine Prüfung im Einzelfall.
              </p>
            </section>
          )}
        </div>
      </section>
    </Layout>
  );
}

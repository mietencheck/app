export type Market = "tight" | "normal";

export type IncreaseReason =
  | "vergleichsmiete"
  | "modernisierung"
  | "index"
  | "staffel"
  | "sonstiges"
  | "betriebskosten";

export type AmountType = "delta" | "newRent";

export type IncreaseInput = {
  id: string;
  date: string | null;
  amountType: AmountType;
  amount: number | null;
  reason: IncreaseReason | "";
  unknownDate?: boolean;
  unknownAmount?: boolean;
};

export type KappungsgrenzeInput = {
  currentRent: number | null;
  target: IncreaseInput;
  history: IncreaseInput[];
  market: Market;
};

export type ScenarioResult = {
  baseRent: number | null;
  countedIncreaseSum: number | null;
  capAmount: number | null;
  maxAllowedRent: number | null;
  usagePercent: number | null;
  exceeded: boolean | null;
  countedIncreaseIds: string[];
};

export type KappungsgrenzeResult = {
  windowStart: string | null;
  windowEnd: string | null;
  capPercent: number;
  optimistic: ScenarioResult;
  conservative: ScenarioResult;
  decision: "conservative";
  assumptions: string[];
  warnings: string[];
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function addYears(date: Date, years: number) {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

function isWithinWindow(date: Date, start: Date, end: Date) {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getSortKey(date: Date | null, targetDate: Date) {
  return date ? date.getTime() : targetDate.getTime() + MS_PER_DAY;
}

function getDeltaFromAmount({
  amountType,
  amount,
  rentAfter,
  warnings,
  warningContext,
}: {
  amountType: AmountType;
  amount: number | null;
  rentAfter: number;
  warnings: string[];
  warningContext: string;
}) {
  if (amount === null || amount === undefined) {
    return { delta: 0, known: false };
  }

  let delta = amountType === "delta" ? amount : rentAfter - amount;

  if (amountType === "newRent" && amount > rentAfter) {
    warnings.push(
      `${warningContext}: Die neue Miete liegt über der späteren Miete. Wir behandeln die Erhöhung als 0 €.`,
    );
    delta = 0;
  }

  if (delta < 0) {
    warnings.push(
      `${warningContext}: Die Erhöhung wäre negativ. Wir behandeln sie als 0 €.`,
    );
    delta = 0;
  }

  return { delta, known: true };
}

function calculateScenario({
  currentRent,
  targetDate,
  windowStart,
  capPercent,
  history,
  target,
  mode,
  warnings,
}: {
  currentRent: number | null;
  targetDate: Date | null;
  windowStart: Date | null;
  capPercent: number;
  history: IncreaseInput[];
  target: IncreaseInput;
  mode: "optimistic" | "conservative";
  warnings: string[];
}): ScenarioResult {
  if (!currentRent || !targetDate || !windowStart) {
    return {
      baseRent: null,
      countedIncreaseSum: null,
      capAmount: null,
      maxAllowedRent: null,
      usagePercent: null,
      exceeded: null,
      countedIncreaseIds: [],
    };
  }

  const historyInWindow = history
    .map((increase) => {
      const date = parseDate(increase.date);
      const inWindow = date
        ? isWithinWindow(date, windowStart, targetDate)
        : mode === "conservative";
      return { ...increase, dateObj: date, inWindow };
    })
    .filter((increase) => increase.inWindow)
    .sort(
      (a, b) =>
        getSortKey(b.dateObj ?? null, targetDate) -
        getSortKey(a.dateObj ?? null, targetDate),
    );

  let sumKnownAll = 0;
  let sumKnownCounted = 0;
  const countedIncreaseIds: string[] = [];

  let hasUnknownCounted = false;
  let rentAfter = currentRent;

  historyInWindow.forEach((increase) => {
    const amountKnown =
      increase.amount !== null &&
      increase.amount !== undefined &&
      !increase.unknownAmount;
    const counts = increase.reason === "vergleichsmiete";

    if (amountKnown) {
      const { delta } = getDeltaFromAmount({
        amountType: increase.amountType,
        amount: increase.amount,
        rentAfter,
        warnings,
        warningContext: "Frühere Erhöhung",
      });
      sumKnownAll += delta;
      rentAfter = Math.max(0, rentAfter - delta);
      if (counts) {
        sumKnownCounted += delta;
        countedIncreaseIds.push(increase.id);
      }
    } else if (counts) {
      hasUnknownCounted = true;
      countedIncreaseIds.push(increase.id);
    }
  });

  const baseRent = Math.max(0, rentAfter);

  let targetCounted = 0;
  if (target.reason === "vergleichsmiete") {
    if (target.amount !== null && !target.unknownAmount) {
      const adjustedAmount =
        target.amountType === "newRent"
          ? target.amount - currentRent
          : target.amount;
      const { delta } = getDeltaFromAmount({
        amountType: "delta",
        amount: adjustedAmount,
        rentAfter: currentRent,
        warnings,
        warningContext: "Neue Erhöhung",
      });
      targetCounted = Math.max(0, delta);
      countedIncreaseIds.push(target.id);
    } else {
      hasUnknownCounted = true;
      countedIncreaseIds.push(target.id);
    }
  }

  const unknownCountedPotential =
    mode === "conservative" && hasUnknownCounted ? baseRent : 0;

  const countedIncreaseSum =
    sumKnownCounted + targetCounted + unknownCountedPotential;
  const capAmount = baseRent * capPercent;
  const maxAllowedRent = baseRent + capAmount;
  const usagePercent =
    capAmount > 0 ? (countedIncreaseSum / capAmount) * 100 : null;
  const exceeded = capAmount > 0 ? countedIncreaseSum > capAmount : null;

  return {
    baseRent,
    countedIncreaseSum,
    capAmount,
    maxAllowedRent,
    usagePercent,
    exceeded,
    countedIncreaseIds,
  };
}

export function calculateKappungsgrenze(
  input: KappungsgrenzeInput,
): KappungsgrenzeResult {
  const capPercent = input.market === "tight" ? 0.15 : 0.2;
  const targetDate = parseDate(input.target.date);
  const windowStart = targetDate ? addYears(targetDate, -3) : null;

  const warnings: string[] = [];
  const optimistic = calculateScenario({
    currentRent: input.currentRent,
    targetDate,
    windowStart,
    capPercent,
    history: input.history,
    target: input.target,
    mode: "optimistic",
    warnings,
  });

  const conservative = calculateScenario({
    currentRent: input.currentRent,
    targetDate,
    windowStart,
    capPercent,
    history: input.history,
    target: input.target,
    mode: "conservative",
    warnings,
  });

  const assumptions: string[] = [];

  if (!input.currentRent || input.currentRent <= 0) {
    warnings.push("Bitte gib eine aktuelle Miete größer 0 ein.");
  }

  if (!targetDate) {
    warnings.push("Bitte gib ein Datum für die neue Mieterhöhung an.");
  }

  const allIncreases = [...input.history, input.target];
  const hasUnknownDate = allIncreases.some(
    (inc) => inc.unknownDate || !inc.date,
  );
  const hasUnknownAmount = allIncreases.some(
    (inc) =>
      inc.unknownAmount || inc.amount === null || inc.amount === undefined,
  );

  if (hasUnknownDate) {
    assumptions.push(
      "Unbekannte Daten werden konservativ als innerhalb der letzten 3 Jahre behandelt.",
    );
  }

  if (hasUnknownAmount) {
    assumptions.push(
      "Unbekannte Beträge werden konservativ so behandelt, als ob sie vollständig zur Kappungsgrenze zählen.",
    );
  }

  if (optimistic.baseRent !== null && optimistic.baseRent === 0) {
    warnings.push(
      "Die bekannten Erhöhungen sind so hoch, dass die rekonstruierte Miete vor 3 Jahren bei 0 liegt. Prüfe bitte deine Eingaben.",
    );
  }

  input.history.forEach((inc) => {
    const date = parseDate(inc.date);
    if (date && targetDate && date.getTime() > targetDate.getTime()) {
      warnings.push(
        "Eine frühere Erhöhung liegt nach dem Datum der neuen Mieterhöhung. Bitte prüfe die Reihenfolge.",
      );
    }
  });

  if (
    optimistic.baseRent !== null &&
    input.currentRent !== null &&
    optimistic.baseRent > input.currentRent
  ) {
    warnings.push(
      "Die rekonstruierte Miete vor 3 Jahren ist höher als die aktuelle Miete. Prüfe bitte die Beträge.",
    );
  }

  return {
    windowStart: windowStart ? formatDate(windowStart) : null,
    windowEnd: targetDate ? formatDate(targetDate) : null,
    capPercent,
    optimistic,
    conservative,
    decision: "conservative",
    assumptions,
    warnings,
  };
}

export const SAMPLE_TEST_CASES = [
  {
    name: "Normalmarkt, keine Vor-Erhöhung",
    input: {
      currentRent: 1000,
      market: "normal" as const,
      target: {
        id: "target",
        date: "2026-01-01",
        amountType: "delta" as const,
        amount: 100,
        reason: "vergleichsmiete" as const,
      },
      history: [],
    },
  },
  {
    name: "Normalmarkt, Vor-Erhöhung zählt",
    input: {
      currentRent: 1000,
      market: "normal" as const,
      target: {
        id: "target",
        date: "2026-01-01",
        amountType: "delta" as const,
        amount: 100,
        reason: "vergleichsmiete" as const,
      },
      history: [
        {
          id: "h1",
          date: "2024-02-01",
          amountType: "delta" as const,
          amount: 150,
          reason: "vergleichsmiete" as const,
        },
      ],
    },
  },
  {
    name: "Modernisierung zählt nicht",
    input: {
      currentRent: 1000,
      market: "normal" as const,
      target: {
        id: "target",
        date: "2026-01-01",
        amountType: "delta" as const,
        amount: 100,
        reason: "vergleichsmiete" as const,
      },
      history: [
        {
          id: "h1",
          date: "2024-05-01",
          amountType: "delta" as const,
          amount: 100,
          reason: "modernisierung" as const,
        },
      ],
    },
  },
  {
    name: "Neue Miete als Betrag",
    input: {
      currentRent: 900,
      market: "normal" as const,
      target: {
        id: "target",
        date: "2026-01-01",
        amountType: "newRent" as const,
        amount: 990,
        reason: "vergleichsmiete" as const,
      },
      history: [],
    },
  },
];

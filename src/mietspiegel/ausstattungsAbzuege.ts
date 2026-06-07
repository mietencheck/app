import { BaujahrSpanneInMietspiegeljahr, Mietspiegeljahr } from "./types";

export const ausstattungsAbzuegeByYear = {
  "2015": {
    "-1918": {
      "!SH && !Bad": 2.65,
      "!SH || !Bad": 1.94,
    },
    "1919-1949": {
      "!SH && !Bad": 2.65,
      "!SH || !Bad": 1.67,
    },
    "1950-1964": {
      "!SH && !Bad": 1.03,
      "!SH || !Bad": 1.03,
    },
  },
  "2017": {
    "-1918": {
      "!SH && !Bad": 1.34,
      "!SH || !Bad": 0.87,
    },
    "1919-1949": {
      "!SH && !Bad": 0.87,
      "!SH || !Bad": 0.35,
    },
    "1950-1964": {
      "!SH && !Bad": 0.81,
      "!SH || !Bad": 0.81,
    },
  },
  "2019": {
    "-1918": {
      "!SH && !Bad": 2.2,
      "!SH || !Bad": 1.41,
    },
    "1919-1949": {
      "!SH && !Bad": 2.2,
      "!SH || !Bad": 0.43,
    },
    "1950-1964": {
      "!SH && !Bad": 1.45,
      "!SH || !Bad": 1.45,
    },
  },
  "2021": {
    "-1918": {
      "!SH && !Bad": 2.22,
      "!SH || !Bad": 1.43,
    },
    "1919-1949": {
      "!SH && !Bad": 2.22,
      "!SH || !Bad": 0.43,
    },
    "1950-1964": {
      "!SH && !Bad": 1.47,
      "!SH || !Bad": 1.47,
    },
  },
  "2023": {
    "-1918": {
      "!SH && !Bad": 2.34,
      "!SH || !Bad": 1.51,
    },
    "1919-1949": {
      "!SH && !Bad": 2.34,
      "!SH || !Bad": 0.45,
    },
    "1950-1964": {
      "!SH && !Bad": 1.55,
      "!SH || !Bad": 1.55,
    },
  },
  "2024": {
    "-1918": {
      "!SH && !Bad": 0.45,
      "!SH || !Bad": 0.45,
    },
    "1919-1949": {
      "!SH && !Bad": 0.45,
      "!SH || !Bad": 0.45,
    },
    "1950-1964": {
      "!SH && !Bad": 0.45,
      "!SH || !Bad": 0.45,
    },
  },
  "2026": {
    "-1918": {
      "!SH && !Bad": 0.33,
      "!SH || !Bad": 0.33,
    },
    "1919-1949": {
      "!SH && !Bad": 0.33,
      "!SH || !Bad": 0.33,
    },
    "1950-1964": {
      "!SH && !Bad": 0,
      "!SH || !Bad": 0,
    },
  },
} satisfies {
  [Jahr in Mietspiegeljahr]: Partial<{
    [Baujahr in BaujahrSpanneInMietspiegeljahr[Jahr]]: {
      "!SH || !Bad": number;
      "!SH && !Bad": number;
    };
  }>;
};

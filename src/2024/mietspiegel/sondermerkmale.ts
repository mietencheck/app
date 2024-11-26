import {
  BaujahrSpanneInMietspiegeljahr,
  o_Mietspiegeljahr as Mietspiegeljahr,
  Sondermerkmal,
} from "./types";

export const sondermerkmale = [
  "[Sondermerkmal] Hochwertiger Bodenbelag",
  "[Sondermerkmal] Moderne Küchenausstattung",
  "[Sondermerkmal] Von der Badewanne getrennte Dusche",
  "[Sondermerkmal] Kleines Bad",
  "[Sondermerkmal] Modernes Bad",
  "[Sondermerkmal] Isolierverglasung/Schallschutzfenster",
  "[Sondermerkmal] Aufzug im Haus",
] as const;

export const sondermerkmaleAbzuegeByMietspiegeljahr = {
  2015: {
    "[Sondermerkmal] Hochwertiger Bodenbelag": {
      "-1918": 0.56,
      "1919-1949": 0.83,
      "1950-1964": 1.1,
      "W:1973-1990": 0.46,
      "1991-2002": 0.79,
    },
    "[Sondermerkmal] Moderne Küchenausstattung": {
      "-1918": 1.37,
      "1950-1964": 1.04,
      "1965-1972": 0.5,
      "W:1973-1990": 0.4,
      "1991-2002": 0.42,
    },
    "[Sondermerkmal] Von der Badewanne getrennte Dusche": {
      "-1918": 0.63,
    },
    "[Sondermerkmal] Kleines Bad": {
      "1991-2002": -0.32,
    },
    "[Sondermerkmal] Modernes Bad": {
      "-1918": 0.34,
      "1919-1949": 0.4,
      "1950-1964": 0.28,
      "1965-1972": 0.12,
      "O:1973-1990": 0.16,
    },
    "[Sondermerkmal] Isolierverglasung/Schallschutzfenster": {
      "-1918": 0.28,
    },
    "[Sondermerkmal] Aufzug im Haus": { "-1918": 0.64 },
  },
  2017: {},
  2019: {},
  2021: {},
  2023: {},
  2024: {},
} satisfies {
  [Jahr in Mietspiegeljahr]: {
    [Merkmal in Sondermerkmal]?: {
      [Baujahr in BaujahrSpanneInMietspiegeljahr[Jahr]]?: number;
    };
  };
};

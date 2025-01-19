import {
  BaujahrSpanneInMietspiegeljahr,
  Mietspiegeljahr,
  Sondermerkmal,
} from "./types";

export const sondermerkmale = {
  "[Sondermerkmal] Hochwertiger Bodenbelag":
    "Hochwertiges Parkett, Natur-/Kunststein, Fliesen oder gleichwertiger Boden/-belag in der überwiegenden Zahl der Wohnräume",
  "[Sondermerkmal] Moderne Küchenausstattung":
    "Moderne Küchenausstattung (Küchenschränke, Einbauspüle, Dunstabzugshaube, Herd mit Ceran- oder Induktionskochfeld, Backofen, Wandfliesen im Arbeitsbereich, Kühlschrank)",
  "[Sondermerkmal] Von der Badewanne getrennte Dusche":
    "Von der Badewanne getrennte Dusche in der Wohnung",
  "[Sondermerkmal] Kleines Bad": "Kleines Bad (kleiner als 4 m2)",
  "[Sondermerkmal] Modernes Bad":
    "Modernes Bad (Wände ausreichend im Spritzwasserbereich von Waschbecken, Badewanne und/oder Dusche gefliest, Bodenfliesen, Einbauwanne und/oder -dusche, Einhebelmischbatterie, Strukturheizkörper als Handtuchwärmer)",
  "[Sondermerkmal] Isolierverglasung/Schallschutzfenster":
    "Überwiegend Isolierverglasung (ab 1987) oder Schallschutzfenster",
  "[Sondermerkmal] Aufzug im Haus": "Aufzug im Haus",
};

export const sondermerkmaleModifierByMietspiegeljahr = {
  2015: {
    "[Sondermerkmal] Hochwertiger Bodenbelag": {
      "-1918": 0.56,
      "1919-1949": 0.83,
      "1950-1964": 1.1,
      "W:1973-1990": 0.46,
      "O:1973-1990": 0,
      "1991-2002": 0.79,
      "2003-2013": 0,
    },
    "[Sondermerkmal] Moderne Küchenausstattung": {
      "-1918": 1.37,
      "1950-1964": 1.04,
      "1965-1972": 0.5,
      "W:1973-1990": 0.4,
      "1991-2002": 0.42,
      "2003-2013": 0,
    },
    "[Sondermerkmal] Von der Badewanne getrennte Dusche": {
      "-1918": 0.63,
      "1950-1964": 0,
      "1965-1972": 0,
      "W:1973-1990": 0,
      "1991-2002": 0,
      "2003-2013": 0,
    },
    "[Sondermerkmal] Kleines Bad": {
      "-1918": 0,
      "1950-1964": 0,
      "1965-1972": 0,
      "W:1973-1990": 0,
      "1991-2002": -0.32,
      "2003-2013": 0,
    },
    "[Sondermerkmal] Modernes Bad": {
      "-1918": 0.34,
      "1950-1964": 0.28,
      "1965-1972": 0.12,
      "W:1973-1990": 0,
      "1991-2002": 0,
      "2003-2013": 0,
      "1919-1949": 0.4,
      "O:1973-1990": 0.16,
    },
    "[Sondermerkmal] Isolierverglasung/Schallschutzfenster": {
      "-1918": 0.28,
      "1950-1964": 0,
      "1965-1972": 0,
      "W:1973-1990": 0,
      "1991-2002": 0,
      "2003-2013": 0,
    },
    "[Sondermerkmal] Aufzug im Haus": {
      "-1918": 0.64,
      "1950-1964": 0,
      "1965-1972": 0,
      "W:1973-1990": 0,
      "1991-2002": 0,
      "2003-2013": 0,
    },
  },
} satisfies {
  [Jahr in Mietspiegeljahr]?: {
    [Merkmal in Sondermerkmal]: {
      [Baujahr in BaujahrSpanneInMietspiegeljahr[Jahr]]?: number;
    };
  };
};

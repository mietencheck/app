import { Mietspiegeljahr, Baujahr, AusstattungsAbzuege } from "./types";

const AusstattungsAbzuege2015: AusstattungsAbzuege = {
  [Baujahr.Pre_1918]: {
    "!SH && !Bad": 2.65,
    "!SH || !Bad": 1.94,
  },
  [Baujahr.Range_1919_1949]: {
    "!SH && !Bad": 2.65,
    "!SH || !Bad": 1.67,
  },
  [Baujahr.Range_1950_1964]: {
    "!SH && !Bad": 1.03,
    "!SH || !Bad": 1.03,
  },
};

const AusstattungsAbzuege2017: AusstattungsAbzuege = {
  [Baujahr.Pre_1918]: {
    "!SH && !Bad": 1.34,
    "!SH || !Bad": 0.87,
  },
  [Baujahr.Range_1919_1949]: {
    "!SH && !Bad": 0.87,
    "!SH || !Bad": 0.35,
  },
  [Baujahr.Range_1950_1964]: {
    "!SH && !Bad": 0.81,
    "!SH || !Bad": 0.81,
  },
};

const AusstattungsAbzuege2019: AusstattungsAbzuege = {
  [Baujahr.Pre_1918]: {
    "!SH && !Bad": 2.2,
    "!SH || !Bad": 1.41,
  },
  [Baujahr.Range_1919_1949]: {
    "!SH && !Bad": 2.2,
    "!SH || !Bad": 0.43,
  },
  [Baujahr.Range_1950_1964]: {
    "!SH && !Bad": 1.45,
    "!SH || !Bad": 1.45,
  },
};

const AusstattungsAbzuege2021: AusstattungsAbzuege = {
  [Baujahr.Pre_1918]: {
    "!SH && !Bad": 2.22,
    "!SH || !Bad": 1.43,
  },
  [Baujahr.Range_1919_1949]: {
    "!SH && !Bad": 2.22,
    "!SH || !Bad": 0.43,
  },
  [Baujahr.Range_1950_1964]: {
    "!SH && !Bad": 1.47,
    "!SH || !Bad": 1.47,
  },
};

const AusstattungsAbzuege2023: AusstattungsAbzuege = {
  [Baujahr.Pre_1918]: {
    "!SH && !Bad": 2.34,
    "!SH || !Bad": 1.51,
  },
  [Baujahr.Range_1919_1949]: {
    "!SH && !Bad": 2.34,
    "!SH || !Bad": 0.45,
  },
  [Baujahr.Range_1950_1964]: {
    "!SH && !Bad": 1.55,
    "!SH || !Bad": 1.55,
  },
};

const AusstattungsAbzuege2024: AusstattungsAbzuege = {
  [Baujahr.Pre_1918]: {
    "!SH && !Bad": 0.45,
    "!SH || !Bad": 0.45,
  },
  [Baujahr.Range_1919_1949]: {
    "!SH && !Bad": 0.45,
    "!SH || !Bad": 0.45,
  },
  [Baujahr.Range_1950_1964]: {
    "!SH && !Bad": 0.45,
    "!SH || !Bad": 0.45,
  },
};

export const ausstattungsAbzuegeByYear : Record<Mietspiegeljahr, AusstattungsAbzuege> = {
  [Mietspiegeljahr._2015]: AusstattungsAbzuege2015,
  [Mietspiegeljahr._2017]: AusstattungsAbzuege2017,
  [Mietspiegeljahr._2019]: AusstattungsAbzuege2019,
  [Mietspiegeljahr._2021]: AusstattungsAbzuege2021,
  [Mietspiegeljahr._2023]: AusstattungsAbzuege2023,
  [Mietspiegeljahr._2024]: AusstattungsAbzuege2024,
};

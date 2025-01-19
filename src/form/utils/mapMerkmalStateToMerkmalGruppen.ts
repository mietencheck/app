import {
  Merkmal,
  MerkmalGruppe,
  MerkmalTyp,
  Sondermerkmal,
} from "~/mietspiegel/types";

export type MerkmalState = "checked" | "maybe" | "unchecked";

export type SondermerkmalStateList = {
  [key in Sondermerkmal]: MerkmalState;
};

export type MerkmalStateList = {
  [key in Merkmal]?: MerkmalState;
};

export type MerkmalGruppenStateList = {
  [key in MerkmalGruppe]: {
    [key in MerkmalTyp]: MerkmalStateList;
  };
};

export const mapMerkmalStateToMerkmalGruppen = (merkmale: MerkmalStateList) => {
  const merkmalGruppen: MerkmalGruppenStateList = {
    Bad: { Wohnwerterhoehend: {}, Wohnwertmindernd: {} },
    Küche: { Wohnwerterhoehend: {}, Wohnwertmindernd: {} },
    Wohnung: { Wohnwerterhoehend: {}, Wohnwertmindernd: {} },
    Gebäude: { Wohnwerterhoehend: {}, Wohnwertmindernd: {} },
    Umfeld: { Wohnwerterhoehend: {}, Wohnwertmindernd: {} },
  };

  for (const key in merkmale) {
    // Matches keys to extract MerkmalGruppe (name) and MerkmalTyp ('+' or '-').
    const match = key.match(/^\[([^\+\-]+)([\+\-])\]/);

    if (match) {
      const merkmalGruppe = match[1] as MerkmalGruppe;
      const merkmalTyp =
        match[2] === "+"
          ? "Wohnwerterhoehend"
          : ("Wohnwertmindernd" as MerkmalTyp);
      const merkmal = key.replace(match[0], "").trim() as Merkmal;

      merkmalGruppen[merkmalGruppe][merkmalTyp][merkmal] =
        merkmale[key as Merkmal];
    }
  }
  return merkmalGruppen;
};

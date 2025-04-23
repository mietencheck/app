import { useAnswers } from "~/form/flow-machine";

import { StepperType } from "..";
import { MieteSchnelltestResult } from "./miete/MieteSchnelltestResult";
import { MieterhoehungSchnelltestResult } from "./mieterhoehung/MieterhoehungSchnelltestResult";

export function SchnelltestResult({ stepper }: { stepper: StepperType }) {
  const answers = useAnswers();
  const typ = answers.getWithOptionAlias("Typ");

  if (typ == "Mieterhöhung") {
    return <MieterhoehungSchnelltestResult />;
  }

  return <MieteSchnelltestResult stepper={stepper} />;
}

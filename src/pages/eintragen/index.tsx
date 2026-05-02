import { useMemo, useState } from "react";

import {
  ApiError,
  postLawOrgaCreateRecord,
  postMietenFlow,
} from "~/api/mietencheck-backend";
import { Button, FormField, Label, Link, TextField } from "~/components";
import { useStoredAnswers } from "~/form/flow-machine";
import { evaluateFlowMachine } from "~/form/flow-machine-evaluation";
import { Layout } from "~/pages/layout";
import { AppRouter } from "~/router";

import { evaluationAnswersToBeratungRecord } from "./flow-data";

const FOLDER_FRAGEBOGEN = "/fragebogen";

export function EintragenPage() {
  const [storedAnswers] = useStoredAnswers();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const evaluation = useMemo(
    () => evaluateFlowMachine(storedAnswers),
    [storedAnswers],
  );
  const evaluationAnswers = evaluation.answers as Record<string, unknown>;

  const hasAnswers =
    Object.keys(storedAnswers).length > 0 &&
    Object.keys(evaluationAnswers).length > 0;

  /** Same mapping Beratung uses — blocks submit if Auswertung data isn’t complete enough. */
  const beratungReady = useMemo(
    () => evaluationAnswersToBeratungRecord(evaluationAnswers) !== null,
    [evaluationAnswers],
  );

  const canSubmit = hasAnswers && beratungReady;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!hasAnswers) {
      setError(
        "Bitte zuerst den Fragebogen ausfüllen, damit wir deine Daten speichern können.",
      );
      return;
    }
    const converted = evaluationAnswersToBeratungRecord(evaluationAnswers);
    if (!converted) {
      setError(
        "Der Fragebogen ist noch nicht vollständig genug. Bitte alle Angaben bis zur Auswertung ausfüllen, damit die Beratung die Daten laden kann.",
      );
      return;
    }
    setPending(true);
    try {
      const lo = await postLawOrgaCreateRecord({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        tel: tel.trim(),
      });
      try {
        const id = await postMietenFlow({
          folder_uuid: lo.folder_uuid,
          datasheet_uuid: lo.datasheet_uuid,
          lawAndOrgaURL: lo.lawAndOrgaURL,
          flowData: converted.record,
        });
        setSuccessId(id);
      } catch (inner) {
        if (inner instanceof ApiError && inner.status === 409) {
          setError(
            "Dieser Law-&-Orga-Eintrag wurde bereits gespeichert (Konflikt).",
          );
        } else if (inner instanceof ApiError && inner.status === 400) {
          setError("Ungültige Daten. Bitte Eingaben prüfen.");
        } else {
          setError(
            "Die Mietencheck-Daten konnten nicht gespeichert werden. Bitte später erneut versuchen.",
          );
        }
      }
    } catch (outer) {
      if (outer instanceof ApiError && outer.status === 400) {
        setError("Ungültige Kontaktdaten. Bitte alle Felder ausfüllen.");
      } else {
        setError(
          "Law & Orga konnte keinen Datensatz anlegen. Bitte später erneut versuchen.",
        );
      }
    } finally {
      setPending(false);
    }
  };

  if (successId) {
    return (
      <Layout>
        <div className="container max-w-lg py-16">
          <h1 className="heading-22 text-purple-11 mb-4">Gespeichert</h1>
          <p className="text-base text-neutral-faded mb-6">
            Deine Angaben und der Fragebogen wurden übernommen.
          </p>
          <p className="text-sm text-neutral-faded mb-8">ID: {successId}</p>
          <Link
            href={AppRouter.Landing()}
            className="text-primary-solid underline"
          >
            Zur Startseite
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-lg py-16">
        <h1 className="heading-22 text-purple-11 mb-2">Daten eintragen</h1>
        <p className="text-base text-neutral-faded mb-8">
          Kontaktdaten für Law & Orga. Es wird ein Datensatz angelegt und dein
          ausgefüllter Fragebogen gespeichert.
        </p>

        {!hasAnswers && (
          <div className="mb-8 p-4 rounded-lg border border-yellow-9 bg-yellow-3">
            <p className="text-sm text-purple-11 mb-3">
              Es sind noch keine Fragebogen-Antworten vorhanden.
            </p>
            <Link
              href={FOLDER_FRAGEBOGEN}
              className="text-primary-solid underline font-medium"
            >
              Zum Fragebogen
            </Link>
          </div>
        )}

        {hasAnswers && !beratungReady && (
          <div className="mb-8 p-4 rounded-lg border border-yellow-9 bg-yellow-3">
            <p className="text-sm text-purple-11 mb-3">
              Es fehlen noch Angaben für eine vollständige Auswertung
              (z.&nbsp;B. Vertragsdatum, Fläche, Lage). Ohne diese können wir
              die Daten in der Beratung nicht darstellen.
            </p>
            <Link
              href={FOLDER_FRAGEBOGEN}
              className="text-primary-solid underline font-medium"
            >
              Fragebogen fortsetzen
            </Link>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <FormField>
            <Label htmlFor="eintragen-firstname" className="mb-1.5">
              Vorname
            </Label>
            <TextField
              id="eintragen-firstname"
              name="firstname"
              autoComplete="given-name"
              isRequired
              value={firstname}
              onChange={setFirstname}
            />
          </FormField>
          <FormField>
            <Label htmlFor="eintragen-lastname" className="mb-1.5">
              Nachname
            </Label>
            <TextField
              id="eintragen-lastname"
              name="lastname"
              autoComplete="family-name"
              isRequired
              value={lastname}
              onChange={setLastname}
            />
          </FormField>
          <FormField>
            <Label htmlFor="eintragen-email" className="mb-1.5">
              E-Mail
            </Label>
            <TextField
              id="eintragen-email"
              name="email"
              type="email"
              autoComplete="email"
              isRequired
              value={email}
              onChange={setEmail}
            />
          </FormField>
          <FormField>
            <Label htmlFor="eintragen-tel" className="mb-1.5">
              Telefon
            </Label>
            <TextField
              id="eintragen-tel"
              name="tel"
              type="tel"
              autoComplete="tel"
              isRequired
              value={tel}
              onChange={setTel}
            />
          </FormField>
          {error && (
            <p className="text-sm text-red-10" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            color="primary"
            variant="solid"
            isDisabled={pending || !canSubmit}
          >
            {pending ? "…" : "Absenden"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}

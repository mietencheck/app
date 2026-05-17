import { useMemo, useState } from "react";

import {
  ApiError,
  postLawOrgaCreateRecord,
  postMietenFlow,
} from "~/api/mietencheck-backend";
import {
  Button,
  Checkbox,
  DialogBody,
  DialogHeader,
  DialogTitle,
  FormField,
  Label,
  Link,
  TextField,
} from "~/components";
import { useStoredAnswers } from "~/form/flow-machine";
import { evaluateFlowMachine } from "~/form/flow-machine-evaluation";
import { useInlineLocale } from "~/l10n";
import { AppRouter } from "~/router";

import { evaluationAnswersToBeratungRecord } from "./flow-data";

const FOLDER_FRAGEBOGEN = "/fragebogen";

function lawOrgaCreateErrorMessage(
  error: unknown,
  l: ReturnType<typeof useInlineLocale>,
): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return l({
        de: "Ungültige Kontaktdaten. Bitte alle Felder ausfüllen.",
        en: "Invalid contact details. Please fill in all fields.",
      });
    }
    if (error.status === 401 || error.status === 403) {
      return l({
        de: "Law-&-Orga-Anfrage wurde abgelehnt (Zugriff). Bitte Backend-Konfiguration prüfen.",
        en: "Law & Orga request was denied (access). Please check the backend configuration.",
      });
    }
    if (error.status === 404) {
      return l({
        de: "Law-&-Orga-Endpunkt unter der konfigurierten API-Adresse nicht gefunden.",
        en: "Law & Orga endpoint not found at the configured API address.",
      });
    }
    if (error.status >= 500 && error.status < 600) {
      return l({
        de: "Law-&-Orga-Server hat einen Fehler gemeldet. Bitte später erneut versuchen.",
        en: "Law & Orga server reported an error. Please try again later.",
      });
    }
    return l({
      de: `Law & Orga konnte keinen Datensatz anlegen (HTTP ${error.status}). Bitte später erneut versuchen.`,
      en: `Law & Orga could not create a record (HTTP ${error.status}). Please try again later.`,
    });
  }
  return l({
    de: "Keine Verbindung zum Mietencheck-Backend (Netzwerk oder CORS). Bitte später erneut versuchen.",
    en: "No connection to the Mietencheck backend (network or CORS). Please try again later.",
  });
}

type EintragenFormProps = {
  layout?: "page" | "dialog";
};

export function EintragenForm({ layout = "page" }: EintragenFormProps) {
  const l = useInlineLocale();
  const idPrefix = layout === "dialog" ? "eintragen-dialog" : "eintragen";
  const [storedAnswers] = useStoredAnswers();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [dataProcessingConsent, setDataProcessingConsent] = useState(false);
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

  const beratungReady = useMemo(
    () => evaluationAnswersToBeratungRecord(evaluationAnswers) !== null,
    [evaluationAnswers],
  );

  const canSubmit = hasAnswers && beratungReady && dataProcessingConsent;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!dataProcessingConsent) {
      setError(
        l({
          de: "Bitte stimme der Datenverarbeitung zu, um das Formular abzusenden.",
          en: "Please consent to data processing to submit the form.",
        }),
      );
      return;
    }
    if (!hasAnswers) {
      setError(
        l({
          de: "Bitte zuerst den Fragebogen ausfüllen, damit wir deine Daten speichern können.",
          en: "Please complete the questionnaire first so we can save your data.",
        }),
      );
      return;
    }
    const converted = evaluationAnswersToBeratungRecord(evaluationAnswers);
    if (!converted) {
      setError(
        l({
          de: "Der Fragebogen ist noch nicht vollständig genug. Bitte alle Angaben bis zur Auswertung ausfüllen, damit die Beratung die Daten laden kann.",
          en: "The questionnaire is not complete enough yet. Please complete all entries up to the evaluation so that the advisory service can load the data.",
        }),
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
            l({
              de: "Dieser Law-&-Orga-Eintrag wurde bereits gespeichert (Konflikt).",
              en: "This Law & Orga entry has already been saved (conflict).",
            }),
          );
        } else if (inner instanceof ApiError && inner.status === 400) {
          setError(
            l({
              de: "Ungültige Daten. Bitte Eingaben prüfen.",
              en: "Invalid data. Please check your entries.",
            }),
          );
        } else {
          setError(
            l({
              de: "Die Mietencheck-Daten konnten nicht gespeichert werden. Bitte später erneut versuchen.",
              en: "The Mietencheck data could not be saved. Please try again later.",
            }),
          );
        }
      }
    } catch (outer) {
      setError(lawOrgaCreateErrorMessage(outer, l));
    } finally {
      setPending(false);
    }
  };

  if (successId) {
    const successBody = (
      <>
        <p className="text-base text-gray-11 mb-6">
          {l({
            de: "Unsere Berater:innen werden sich so schnell wie möglich bei dir melden. Bitte beachte, dass dies einige Tage dauern kann.",
            en: "Our advisors will get back to you as soon as possible. Please note that this may take a few days.",
          })}
        </p>
        {layout === "page" && (
          <Link href={AppRouter.Landing()}>
            {l({ de: "Zur Startseite", en: "Back to homepage" })}
          </Link>
        )}
      </>
    );

    if (layout === "dialog") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>
              {l({ de: "Anfrage versendet!", en: "Request sent!" })}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>{successBody}</DialogBody>
        </>
      );
    }

    return (
      <>
        <h1 className="heading-22 mb-4">
          {l({ de: "Anfrage versendet!", en: "Request sent!" })}
        </h1>
        {successBody}
      </>
    );
  }

  const warnings = (
    <>
      {!hasAnswers && (
        <div className="mb-8 p-4 rounded-lg bg-red-3 text-red-11">
          <p className="mb-3">
            {l({
              de: "Es sind noch keine Fragebogen-Antworten vorhanden.",
              en: "No questionnaire answers are available yet.",
            })}
          </p>
          <Link href={FOLDER_FRAGEBOGEN}>
            {l({ de: "Zum Fragebogen", en: "Go to questionnaire" })}
          </Link>
        </div>
      )}

      {hasAnswers && !beratungReady && (
        <div className="mb-8 p-4 rounded-lg bg-red-3 text-red-11">
          <p className="mb-3">
            {l({
              de: "Es fehlen noch Angaben für eine vollständige Auswertung (z.&nbsp;B. Vertragsdatum, Fläche, Lage). Ohne diese können wir die Daten in der Beratung nicht darstellen.",
              en: "Some information for a complete evaluation is still missing (e.g. contract date, area, location). Without these we cannot display the data in the advisory session.",
            })}
          </p>
          <Link href={FOLDER_FRAGEBOGEN}>
            {l({ de: "Fragebogen fortsetzen", en: "Continue questionnaire" })}
          </Link>
        </div>
      )}
    </>
  );

  const form = (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormField>
        <Label htmlFor={`${idPrefix}-firstname`} className="mb-1.5">
          {l({ de: "Vorname", en: "First name" })}
        </Label>
        <TextField
          id={`${idPrefix}-firstname`}
          name="firstname"
          autoComplete="given-name"
          isRequired
          value={firstname}
          onChange={setFirstname}
        />
      </FormField>
      <FormField>
        <Label htmlFor={`${idPrefix}-lastname`} className="mb-1.5">
          {l({ de: "Nachname", en: "Last name" })}
        </Label>
        <TextField
          id={`${idPrefix}-lastname`}
          name="lastname"
          autoComplete="family-name"
          isRequired
          value={lastname}
          onChange={setLastname}
        />
      </FormField>
      <FormField>
        <Label htmlFor={`${idPrefix}-email`} className="mb-1.5">
          {l({ de: "E-Mail", en: "Email" })}
        </Label>
        <TextField
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          autoComplete="email"
          isRequired
          value={email}
          onChange={setEmail}
        />
      </FormField>
      <FormField>
        <Label htmlFor={`${idPrefix}-tel`} className="mb-1.5">
          {l({ de: "Telefon", en: "Phone" })}
        </Label>
        <TextField
          id={`${idPrefix}-tel`}
          name="tel"
          type="tel"
          autoComplete="tel"
          isRequired
          value={tel}
          onChange={setTel}
        />
      </FormField>
      <Checkbox
        isSelected={dataProcessingConsent}
        onChange={setDataProcessingConsent}
        isRequired
        className="flex gap-3"
      >
        {l({
          de: "Hiermit stimme ich zu, dass die Mieten Law Clinic Berlin e.V. meine Daten zu Beratungszwecken verarbeiten darf.",
          en: "I hereby agree that the Mieten Law Clinic Berlin e.V. may process my data for advisory purposes.",
        })}
      </Checkbox>
      {error && (
        <p className="text-red-10" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" variant="solid" disabled={pending || !canSubmit}>
        {pending ? "…" : l({ de: "Absenden", en: "Submit" })}
      </Button>
    </form>
  );

  if (layout === "dialog") {
    return (
      <>
        <DialogHeader>
          <DialogTitle>
            {l({
              de: "Kostenlose Beratung anfordern",
              en: "Request free advisory session",
            })}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-base text-gray-11 mb-4">
            {l({
              de: "Beantrage jetzt unverbindlich eine kostenlose Beratung durch die Mieten Law Clinic Berlin e.V..",
              en: "Request a free, non-binding advisory session from Mieten Law Clinic Berlin e.V. now.",
            })}
          </p>
          {warnings}
          {form}
        </DialogBody>
      </>
    );
  }

  return (
    <>
      <h1 className="heading-22 mb-2">
        {l({ de: "Daten eintragen", en: "Enter your details" })}
      </h1>
      <p className="text-base text-gray-11 mb-8">
        {l({
          de: "Kontaktdaten für Law & Orga. Es wird ein Datensatz angelegt und dein ausgefüllter Fragebogen gespeichert.",
          en: "Contact details for Law & Orga. A record will be created and your completed questionnaire will be saved.",
        })}
      </p>
      {warnings}
      {form}
    </>
  );
}

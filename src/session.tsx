import * as Sentry from "@sentry/react";
import fetchWithRetry from "fetch-retry";
import { AnswersRecord } from "flow-machine";
import { useCallback, useEffect, useMemo } from "react";
import { omit } from "remeda";
import useSWR from "swr";
import { useDebounceCallback, useLocalStorage } from "usehooks-ts";

import { Button, TextInput } from "~/components/ui";

import { useStoredAnswers } from "./form/flow-machine";
import { useLocalizeField, useLocalizeString } from "./l10n";
import { parseAdresse } from "./utils";

const fetch = fetchWithRetry(window.fetch);

export const useStoredSession = () =>
  useLocalStorage<{ hash: string | null; pii: boolean }>("session", {
    hash: null,
    pii: false,
  });

const useFetchServerSession = (hash: string | null) =>
  useSWR<AnswersRecord | undefined>("session-" + hash, () =>
    hash ? fetch("/sessions/" + hash).then((r) => r.json()) : undefined,
  );

export function useSyncAnswers() {
  const [storedAnswers, setStoredAnswers] = useStoredAnswers();
  const [session, setSession] = useStoredSession();

  const { data: serverAnswers } = useFetchServerSession(session.hash);

  useEffect(() => {
    if (serverAnswers && "Adresse" in serverAnswers) {
      setStoredAnswers(serverAnswers);
    }
  }, [serverAnswers, session.pii, setStoredAnswers]);

  const syncableData = useMemo(() => {
    const adresse = storedAnswers.Adresse;
    return {
      ...(session.pii ? storedAnswers : omit(storedAnswers, ["Adresse"])),
      __LageInfoByJahr:
        typeof adresse == "string" ? parseAdresse(adresse).lage : null,
    };
  }, [session.pii, storedAnswers]);

  const sync = useCallback(
    (hash: string | null, data: object) => {
      const ctrl = new AbortController();
      if (hash) {
        fetch("/sessions/" + hash, {
          method: "PUT",
          body: JSON.stringify(data),
          signal: ctrl.signal,
        });
      } else {
        fetch("/sessions", {
          method: "POST",
          body: JSON.stringify(data),
          signal: ctrl.signal,
        }).then((r) => {
          if (r.ok) {
            return r.text().then((hash) => setSession({ hash, pii: false }));
          }
        });
      }
      return () => ctrl.abort();
    },
    [setSession],
  );
  const throttledSync = useDebounceCallback(sync, 1000);

  useEffect(() => {
    throttledSync(session.hash, syncableData);
  }, [session.hash, syncableData, throttledSync]);
}

export const SESSION_PARAM = "s";

export function SaveSessionModal({ onClose }: { onClose: () => void }) {
  const [session, setSession] = useStoredSession();
  const l = useLocalizeField();

  if (!session.pii) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="heading-18 mb-4">
          {l("Fortschritt Speichern Modal Titel")}
        </h1>
        <p className="mb-3 text-neutral-faded">
          {l("Fortschritt Speichern Modal Text 1")}
        </p>
        <p className="mb-3 text-neutral-faded">
          {l("Fortschritt Speichern Modal Text 2")}
        </p>
        <p className="mb-8 text-neutral-faded">
          {l("Fortschritt Speichern Modal Text 3")}
        </p>

        <div className="flex justify-end flex-row gap-3">
          <Button onPress={onClose}>{l("Abbrechen")}</Button>
          <Button
            variant="solid"
            color="primary"
            onPress={() => {
              setSession({ ...session, pii: true });
            }}
          >
            {l("Ja, speichert meine Adresse")}
          </Button>
        </div>
      </div>
    );
  }

  const url = `${location.protocol}//${location.host}${location.pathname}?${SESSION_PARAM}=${session.hash}`;
  return (
    <div className="p-4 sm:p-6">
      <h1 className="heading-18 mb-4"></h1>
      <p className="mb-4">
        {l(
          "Speicher dir diesen Link, oder schicke ihn dir am besten selbst als E-Mail/Chat, um mit dem Formular fortzusetzen.",
        )}
      </p>
      <TextInput
        disabled
        className="w-full bg-gray-100 mb-6"
        value={url}
        onChange={() => {}}
      />
      <div className="flex flex-row gap-3 justify-end">
        <Button onPress={onClose}>{l("Schließen")}</Button>
        <Button
          variant="solid"
          color="primary"
          onPress={() => {
            if (navigator.share as unknown) {
              navigator.share({ url });
            } else {
              navigator.clipboard.writeText(url);
            }
          }}
        >
          {(navigator.share as unknown)
            ? l("Link teilen")
            : l("In die Zwischenablage kopieren")}
        </Button>
      </div>
    </div>
  );
}

export function ContinueSessionModal({ hash }: { hash: string }) {
  const [session, setSession] = useStoredSession();
  const [storedAnswers, setStoredAnswers] = useStoredAnswers();
  const l = useLocalizeString();

  const { data: serverSession, error } = useFetchServerSession(hash);

  const stripHashFromURL = useCallback(() => {
    location.replace(location.href.split("?")[0]);
  }, []);
  const continueSessionFromServer = useCallback(() => {
    if (!serverSession) return;
    setStoredAnswers(serverSession);
    setSession({ hash, pii: true });
    stripHashFromURL();
  }, [hash, serverSession, setSession, setStoredAnswers, stripHashFromURL]);

  useEffect(() => {
    if (hash == session.hash) {
      stripHashFromURL();
    }
  }, [stripHashFromURL, hash, session.hash]);

  useEffect(() => {
    if (error) {
      Sentry.captureException(error);
      stripHashFromURL();
    }
  }, [stripHashFromURL, error]);

  const localAnswerCount = Object.keys(storedAnswers).length;
  useEffect(() => {
    if (localAnswerCount == 0) {
      continueSessionFromServer();
    }
  }, [continueSessionFromServer, localAnswerCount, serverSession]);

  if (!serverSession) return null;

  return (
    <div className="border rounded-sm max-w-2xl mx-auto my-12 p-6 flex flex-col gap-4">
      <p>{l("Session fortsetzen?")}</p>
      <div className="self-end flex flex-row gap-2 justify-between">
        <Button onPress={stripHashFromURL}>{l("Abbrechen")}</Button>
        <Button
          variant="solid"
          color="primary"
          onPress={continueSessionFromServer}
        >
          {l("Sitzung überschreiben")}
        </Button>
      </div>
    </div>
  );
}

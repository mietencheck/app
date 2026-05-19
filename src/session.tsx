import * as Sentry from "@sentry/react";
import fetchWithRetry from "fetch-retry";
import { useCallback, useEffect, useMemo } from "react";
import { omit } from "remeda";
import useSWR from "swr";
import { useDebounceCallback, useLocalStorage } from "usehooks-ts";

import {
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  TextInput,
} from "~/components";
import { useStoredAnswers, type AnswerData } from "~/form/flow-machine";
import { useInlineLocale } from "~/l10n";

import { parseAdresse } from "./utils";

const fetch = fetchWithRetry(globalThis.fetch as typeof globalThis.fetch);

export const useStoredSession = () =>
  useLocalStorage<{ hash: string | null; pii: boolean }>("session", {
    hash: null,
    pii: false,
  });

const useFetchServerSession = (hash: string | null) =>
  useSWR<AnswerData | undefined>(
    hash ? "/sessions/" + hash : null,
    (url: string) => fetch(url).then((r) => r.json() as Promise<AnswerData>),
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

export function SaveSessionDialog({ onClose }: { onClose: () => void }) {
  const [session, setSession] = useStoredSession();
  const l = useInlineLocale();

  if (!session.pii) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>
            {l({
              de: "Speicher deinen Fortschritt",
              en: "Save your progress",
            })}
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="text-gray-11">
          <p>
            {l({
              de: "Um sicher zu stellen, dass dein Fortschritt nicht verloren geht, können wir deine Antworten auf unseren Servern für dich speichern. Du erhältst dann einen einzigartigen Link, mit dem du jederzeit und mit jedem Gerät auf deinen Fortschritt zugreifen kannst.",
              en: "To ensure that your progress is not lost, we can save your answers on our servers for you. You will then receive a unique link that you can use to access your progress at any time and on any device.",
            })}
          </p>
          <p>
            {l({
              de: "Hierfür benötigen wir dein Einverständnis, dass wir die angegebene Adresse speichern dürfen. Wir werden diese Daten niemals weitergeben oder für andere Zwecke benutzen.",
              en: "To do this, we need your consent to store the address you provide. We will never pass on this data or use it for other purposes.",
            })}
          </p>
          <p>
            {l({
              de: "Wenn du deine Addresse nicht weitergeben möchtest, kannst den Fragebogen auch jederzeit weiter ausfüllen, indem du einfach diese Seite auf dem selben Gerät wieder öffnest.",
              en: "If you do not wish to share your address, you can continue to complete the questionnaire at any time by simply reopening this page on the same device.",
            })}
          </p>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="outline"
            color="gray"
            type="button"
            onClick={onClose}
          >
            {l({ de: "Abbrechen", en: "Cancel" })}
          </Button>
          <Button
            variant="solid"
            type="button"
            onClick={() => {
              setSession({ ...session, pii: true });
            }}
          >
            {l({
              de: "Ja, speichert meine Adresse",
              en: "Yes, save my address",
            })}
          </Button>
        </DialogFooter>
      </>
    );
  }

  const url = `${location.protocol}//${location.host}${location.pathname}?${SESSION_PARAM}=${session.hash}`;
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {l({
            de: "Speicher deinen Fortschritt",
            en: "Save your progress",
          })}
        </DialogTitle>
      </DialogHeader>
      <DialogBody>
        <p>
          {l({
            de: "Speicher dir diesen Link, oder schicke ihn dir am besten selbst als E-Mail/Chat, um mit dem Formular fortzusetzen.",
            en: "Save this link or send it to yourself via email/chat to continue with the form.",
          })}
        </p>
        <TextInput disabled value={url} onChange={() => {}} />
      </DialogBody>
      <DialogFooter>
        <Button variant="outline" color="gray" type="button" onClick={onClose}>
          {l({ de: "Schließen", en: "Close" })}
        </Button>
        <Button
          variant="solid"
          type="button"
          onClick={() => {
            if (navigator.share as unknown) {
              navigator.share({ url });
            } else {
              navigator.clipboard.writeText(url);
            }
          }}
        >
          {(navigator.share as unknown)
            ? l({ de: "Link teilen", en: "Share link" })
            : l({ de: "In die Zwischenablage kopieren", en: "Copy link" })}
        </Button>
      </DialogFooter>
    </>
  );
}

export function ContinueSessionDialog({ hash }: { hash: string }) {
  const [session, setSession] = useStoredSession();
  const [storedAnswers, setStoredAnswers] = useStoredAnswers();
  const l = useInlineLocale();

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
    <>
      <DialogHeader>
        <DialogTitle>
          {l({ de: "Sitzung überschreiben?", en: "Overwrite session?" })}
        </DialogTitle>
      </DialogHeader>
      <DialogBody>
        <p>
          {l({
            de: "Möchtest du deinen aktuellen Fortschritt überschreiben? Diese Aktion kann nicht rückgängig gemacht werden.",
            en: "Do you want to overwrite your current progress? This action cannot be undone.",
          })}
        </p>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="outline"
          color="gray"
          type="button"
          onClick={stripHashFromURL}
        >
          {l({ de: "Abbrechen", en: "Cancel" })}
        </Button>
        <Button
          variant="solid"
          type="button"
          onClick={continueSessionFromServer}
        >
          {l({ de: "Sitzung überschreiben", en: "Overwrite session" })}
        </Button>
      </DialogFooter>
    </>
  );
}

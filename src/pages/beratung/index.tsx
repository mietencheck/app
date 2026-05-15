import { pushUnsafe } from "@swan-io/chicane";
import { useEffect, useState } from "react";

import {
  ApiError,
  deleteMietenFlow,
  getMietenFlows,
  postLawOrgaCreateRecord,
  postMietenFlow,
} from "~/api/mietencheck-backend";
import { useAuth } from "~/auth/AuthContext";
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormField,
  Label,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextField,
} from "~/components";
import { AppRouter } from "~/router";

import { Layout } from "./Layout";
import { getDefaultBeratungRecord } from "./mock-data";

function lawOrgaCreateErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return "Ungültige Kontaktdaten. Bitte alle Felder ausfüllen.";
    }
    if (error.status === 401 || error.status === 403) {
      return "Law-&-Orga-Anfrage wurde abgelehnt (Zugriff). Bitte Backend-Konfiguration prüfen.";
    }
    if (error.status === 404) {
      return "Law-&-Orga-Endpunkt unter der konfigurierten API-Adresse nicht gefunden.";
    }
    if (error.status >= 500 && error.status < 600) {
      return "Law-&-Orga-Server hat einen Fehler gemeldet. Bitte später erneut versuchen.";
    }
    return `Law & Orga konnte keinen Datensatz anlegen (HTTP ${error.status}). Bitte später erneut versuchen.`;
  }
  return "Keine Verbindung zum Mietencheck-Backend (Netzwerk oder CORS). Bitte später erneut versuchen.";
}

function DeleteMietenFlowRowAction({
  flowId,
  onRemoved,
}: {
  flowId: string;
  onRemoved: (id: string) => void;
}) {
  const { getValidToken, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    const token = getValidToken();
    if (!token) return;
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await deleteMietenFlow(token, flowId);
      onRemoved(flowId);
      setIsOpen(false);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout();
        return;
      }
      setDeleteError("Löschen ist fehlgeschlagen.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setDeleteError(null);
      }}
    >
      <DialogTrigger
        nativeButton={false}
        render={
          <Button variant="outline" color="gray" size="sm" type="button">
            Löschen
          </Button>
        }
      />
      <DialogContent showCloseButton={false} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Eintrag löschen?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-base text-gray-11">
            Dieser gespeicherte Mietencheck wird unwiderruflich gelöscht.
          </p>
          {deleteError && (
            <p className="text-sm text-red-10" role="alert">
              {deleteError}
            </p>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogClose
            disabled={isDeleting}
            render={
              <Button variant="outline" color="gray" type="button">
                Abbrechen
              </Button>
            }
          />
          <Button
            variant="solid"
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Wird gelöscht…" : "Löschen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateMietenFlowAction() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createPending, setCreatePending] = useState(false);

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setTel("");
    setCreateError(null);
    setCreatePending(false);
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreatePending(true);
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
          flowData: getDefaultBeratungRecord(),
        });
        pushUnsafe(AppRouter.BeratungDetail({ id }));
      } catch (inner) {
        if (inner instanceof ApiError && inner.status === 409) {
          setCreateError(
            "Dieser Law-&-Orga-Eintrag wurde bereits gespeichert (Konflikt).",
          );
        } else if (inner instanceof ApiError && inner.status === 400) {
          setCreateError("Ungültige Daten. Bitte Eingaben prüfen.");
        } else {
          setCreateError(
            "Die Mietencheck-Daten konnten nicht gespeichert werden. Bitte später erneut versuchen.",
          );
        }
      }
    } catch (outer) {
      setCreateError(lawOrgaCreateErrorMessage(outer));
    } finally {
      setCreatePending(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger
        nativeButton={false}
        render={<Button>Fall erstellen</Button>}
      />
      <DialogContent className="max-w-lg">
        {/* Form inside portal: wrapping DialogContent would leave controls outside <form> in the DOM. */}
        <form onSubmit={handleCreateNew} className="contents">
          <DialogHeader>
            <DialogTitle>Neuen Mietencheck anlegen</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <FormField>
              <Label htmlFor="beratung-firstname" className="mb-1.5">
                Vorname
              </Label>
              <TextField
                id="beratung-firstname"
                name="firstname"
                autoComplete="given-name"
                isRequired
                value={firstname}
                onChange={setFirstname}
              />
            </FormField>
            <FormField>
              <Label htmlFor="beratung-lastname" className="mb-1.5">
                Nachname
              </Label>
              <TextField
                id="beratung-lastname"
                name="lastname"
                autoComplete="family-name"
                isRequired
                value={lastname}
                onChange={setLastname}
              />
            </FormField>
            <FormField>
              <Label htmlFor="beratung-email" className="mb-1.5">
                E-Mail
              </Label>
              <TextField
                id="beratung-email"
                name="email"
                type="email"
                autoComplete="email"
                isRequired
                value={email}
                onChange={setEmail}
              />
            </FormField>
            <FormField>
              <Label htmlFor="beratung-tel" className="mb-1.5">
                Telefon
              </Label>
              <TextField
                id="beratung-tel"
                name="tel"
                type="tel"
                autoComplete="tel"
                isRequired
                value={tel}
                onChange={setTel}
              />
            </FormField>
            {createError && (
              <p className="text-sm text-red-10" role="alert">
                {createError}
              </p>
            )}
            <DialogFooter>
              <DialogClose
                disabled={createPending}
                render={
                  <Button variant="outline" color="gray" type="button">
                    Abbrechen
                  </Button>
                }
              />
              <Button type="submit" variant="solid" disabled={createPending}>
                {createPending ? "Wird angelegt…" : "Anlegen"}
              </Button>
            </DialogFooter>
          </DialogBody>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BeratungListPage() {
  const { getValidToken, logout } = useAuth();
  const [rows, setRows] = useState<Awaited<
    ReturnType<typeof getMietenFlows>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const token = getValidToken();
    if (!token) return;

    getMietenFlows(token)
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) {
          logout();
          return;
        }
        if (!cancelled) setError("Liste konnte nicht geladen werden.");
      });

    return () => {
      cancelled = true;
    };
  }, [getValidToken, logout]);

  const removeRow = (id: string) => {
    setRows((prev) => (prev ? prev.filter((r) => r._id !== id) : null));
  };

  return (
    <Layout headerTrailing={<CreateMietenFlowAction />}>
      <h1 className="heading-22 mb-8">Gespeicherte Mietenchecks</h1>

      {error && (
        <p className="text-sm text-red-10 mb-4" role="alert">
          {error}
        </p>
      )}
      {!rows ? (
        <p className="text-sm text-gray-11">Lade Einträge…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-11">Noch keine Einträge.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pr-3">ID</TableHead>
              <TableHead className="px-3">Law & Orga Link</TableHead>
              <TableHead className="px-3">Erstellt</TableHead>
              <TableHead className="pl-3 text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r._id}>
                <TableCell className="pr-3">
                  <Link
                    href={AppRouter.BeratungDetail({ id: r._id })}
                    title={r._id}
                    className="font-normal underline"
                  >
                    {r._id}
                  </Link>
                </TableCell>

                <TableCell className="px-3 max-w-md">
                  <a
                    href={r.lawAndOrgaURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-11-solid underline text-sm truncate block"
                    title={r.lawAndOrgaURL}
                  >
                    {r.lawAndOrgaURL}
                  </a>
                </TableCell>
                <TableCell className="px-3 whitespace-nowrap">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleString("de-DE")
                    : "—"}
                </TableCell>
                <TableCell className="pl-3 flex justify-end">
                  <DeleteMietenFlowRowAction
                    flowId={r._id}
                    onRemoved={removeRow}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Layout>
  );
}

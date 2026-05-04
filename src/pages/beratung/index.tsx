import { useEffect, useState } from "react";
import { DialogTrigger } from "react-aria-components";

import {
  ApiError,
  deleteMietenFlow,
  getMietenFlows,
} from "~/api/mietencheck-backend";
import { useAuth } from "~/auth/AuthContext";
import {
  Button,
  IconButton,
  Link,
  ModalDialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import { CloseIcon } from "~/components/Icons/Close";
import { AppRouter } from "~/router";

import { Layout } from "./Layout";

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
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setDeleteError(null);
      }}
    >
      <Button variant="outline" size="sm" onPress={() => setIsOpen(true)}>
        Löschen
      </Button>
      <ModalDialog className="flex flex-col">
        <header className="border-b border-neutral-subtle px-4 sm:px-6 py-3 flex flex-row justify-between items-center">
          <h2 className="title-16">Eintrag löschen?</h2>
          <IconButton
            size="sm"
            variant="ghost"
            isDisabled={isDeleting}
            onPress={() => setIsOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </header>
        <div className="flex flex-col p-4 sm:p-6">
          <p className="text-base text-neutral-faded mb-3">
            Dieser gespeicherte Mietencheck wird unwiderruflich gelöscht.
          </p>
          {deleteError && (
            <p className="text-sm text-red-10" role="alert">
              {deleteError}
            </p>
          )}
        </div>
        <div className="px-4 sm:px-6 py-3 border-t border-neutral-subtle flex flex-row gap-2 justify-between">
          <Button onPress={() => setIsOpen(false)} isDisabled={isDeleting}>
            Abbrechen
          </Button>
          <Button
            variant="solid"
            color="primary"
            onPress={handleConfirmDelete}
            isDisabled={isDeleting}
          >
            {isDeleting ? "Wird gelöscht…" : "Löschen"}
          </Button>
        </div>
      </ModalDialog>
    </DialogTrigger>
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
    <Layout>
      <h1 className="heading-22 mb-8">Gespeicherte Mietenchecks</h1>

      {error && (
        <p className="text-sm text-red-10 mb-4" role="alert">
          {error}
        </p>
      )}

      {!rows ? (
        <p className="text-sm text-neutral-faded">Lade Einträge…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-neutral-faded">Noch keine Einträge.</p>
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
                    className="text-primary-solid underline truncate block"
                    title={r._id}
                  >
                    {r._id}
                  </Link>
                </TableCell>

                <TableCell className="px-3 max-w-md">
                  <a
                    href={r.lawAndOrgaURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-solid underline text-sm truncate block"
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

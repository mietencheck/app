import { useEffect, useState } from "react";

import { ApiError, getMietenFlows } from "~/api/mietencheck-backend";
import { useAuth } from "~/auth/AuthContext";
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import { AppRouter } from "~/router";

import { Layout } from "./Layout";

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
              <TableHead className="px-3">folder_uuid</TableHead>
              <TableHead className="px-3">datasheet_uuid</TableHead>
              <TableHead className="px-3">Erstellt</TableHead>
              <TableHead className="pl-3">Link</TableHead>
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
                <TableCell className="px-3 truncate" title={r.folder_uuid}>
                  {r.folder_uuid}
                </TableCell>
                <TableCell className="px-3 truncate" title={r.datasheet_uuid}>
                  {r.datasheet_uuid}
                </TableCell>
                <TableCell className="px-3 whitespace-nowrap">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleString("de-DE")
                    : "—"}
                </TableCell>
                <TableCell className="pl-3">
                  <a
                    href={r.lawAndOrgaURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-solid underline text-sm"
                  >
                    Law &amp; Orga
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Layout>
  );
}

import { useState } from "react";

import { ApiError } from "~/api/mietencheck-backend";
import { useAuth } from "~/auth/AuthContext";
import { Button, FormField, Label, TextField } from "~/components";
import { Layout } from "~/pages/layout";
import { AppRouter } from "~/router";

function safeNextParam(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return AppRouter.Beratung();
  }
  return raw;
}

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login(email.trim(), password);
      const params = new URLSearchParams(window.location.search);
      const next = safeNextParam(params.get("next"));
      // Chicane's push() is for typed route helpers, not arbitrary paths — use a real navigation.
      window.location.assign(next);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("E-Mail oder Passwort ist ungültig.");
      } else {
        setError("Anmeldung fehlgeschlagen. Bitte später erneut versuchen.");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-16">
        <h1 className="heading-22 mb-2">Anmelden</h1>
        <p className="text-base text-gray-11 mb-8">
          Zugang für interne Beratungstools.
        </p>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField>
            <Label htmlFor="login-email" className="mb-1.5">
              E-Mail
            </Label>
            <TextField
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              isRequired
              value={email}
              onChange={setEmail}
            />
          </FormField>
          <FormField>
            <Label htmlFor="login-password" className="mb-1.5">
              Passwort
            </Label>
            <TextField
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              isRequired
              value={password}
              onChange={setPassword}
            />
          </FormField>
          {error && (
            <p className="text-sm text-red-10" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="solid" disabled={pending}>
            {pending ? "…" : "Anmelden"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}

import { Layout } from "~/pages/layout";

import { EintragenForm } from "./EintragenForm";

export function EintragenPage() {
  return (
    <Layout>
      <div className="container max-w-lg py-16">
        <EintragenForm layout="page" />
      </div>
    </Layout>
  );
}

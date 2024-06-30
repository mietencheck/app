import type { Env } from "../env.js";

export const onRequest: PagesFunction<Env> = async ({
  env: { DB },
  request,
}) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  let hash = crypto.randomUUID();
  while (
    await DB.prepare("SELECT 1 FROM sessions WHERE hash = ?").bind(hash).first()
  ) {
    hash = crypto.randomUUID();
  }

  await DB.prepare("INSERT INTO sessions (hash, form_data) VALUES (?, ?)")
    .bind(hash, await request.text())
    .run();

  return new Response(hash);
};

import type { Env } from "../env.js";

const GET: PagesFunction<Env> = async ({ env: { DB }, params: { hash } }) => {
  const row = await DB.prepare("SELECT form_data FROM sessions WHERE hash = ?")
    .bind(hash)
    .first();

  if (!row) {
    return new Response(null, { status: 404 });
  }
  return new Response(row.form_data as string, {
    headers: { "Content-Type": "application/json" },
  });
};

const PUT: PagesFunction<Env> = async ({
  env: { DB },
  request,
  params: { hash },
}) => {
  await DB.prepare("UPDATE sessions SET form_data = ? WHERE hash = ?")
    .bind(await request.text(), hash)
    .run();
  return new Response(null, { status: 204 });
};

const HANDLERS = { GET, PUT };

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const handler = HANDLERS[ctx.request.method];
  return handler ? handler(ctx) : new Response(null, { status: 405 });
};

import { Env } from "./env.js";

export const onRequest: PagesFunction<Env> = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }
  const { readable, writable } = new TransformStream();
  request.body.pipeTo(writable);

  const [header, body] = readable.tee();

  const decoder = new TextDecoder();
  let chunk = "";

  const headerReader = header.getReader();

  while (true) {
    const { done, value } = await headerReader.read();

    if (done) {
      break;
    }

    chunk += decoder.decode(value);

    const index = chunk.indexOf("\n");

    if (index >= 0) {
      const firstLine = chunk.slice(0, index);
      const event = JSON.parse(firstLine);
      const dsn = new URL(event.dsn);
      const headers = request.headers;
      headers.set("X-Forwarded-For", request.headers.get("CF-Connecting-IP"));
      return fetch(`https://${dsn.host}/api${dsn.pathname}/envelope/`, {
        method: "POST",
        body,
        headers,
      });
    }
  }
};

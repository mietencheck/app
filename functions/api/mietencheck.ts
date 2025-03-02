import { getWorstBestZulaessigeHoechstmiete } from "../../src/calculation/zulaessigeHoechstmiete.js";
import { getVisibleQuestionAliases } from "../../src/form/flow-machine.js";

export async function onRequestPost(context) {
  // Parse the request body to get the answers
  let answers = {};
  try {
    const request = context.request;
    const contentType = request.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      answers = await request.json();
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to parse request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const visibleQuestionAliases = getVisibleQuestionAliases(answers);

  const zulaessigeHoechstmiete = getWorstBestZulaessigeHoechstmiete(
    answers,
    visibleQuestionAliases,
  );

  return new Response(
    JSON.stringify({ message: "hi", zulaessigeHoechstmiete }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}

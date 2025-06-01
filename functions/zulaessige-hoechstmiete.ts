import { getWorstBestZulaessigeHoechstmiete } from "../src/calculation/zulaessigeHoechstmiete.js";
import type { FinalAnswers } from "../src/form/flow-machine.js";
import type { Env } from "./env.js";

interface RequestBody {
  answers: FinalAnswers;
  visibleQuestionAliases: string[];
}

export const onRequest: PagesFunction<Env> = async ({ request }) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  try {
    // Parse the request body
    const { answers, visibleQuestionAliases } =
      (await request.json()) as RequestBody;

    // Call the function with the provided data
    const result = getWorstBestZulaessigeHoechstmiete(
      answers,
      new Set(visibleQuestionAliases),
    );

    // Return the result as JSON
    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handle any errors
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

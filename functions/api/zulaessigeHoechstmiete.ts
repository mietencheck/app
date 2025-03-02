import { getWorstBestZulaessigeHoechstmiete } from "../../src/calculation/zulaessigeHoechstmiete.js";
import {
  FinalAnswers,
  getVisibleQuestionAliases,
} from "../../src/form/flow-machine.js";

export interface ZulaessigeHoechstmieteRequest {
  answers: FinalAnswers;
}

export interface ZulaessigeHoechstmieteResponse {
  zulaessigeHoechstmiete?: {
    worst: number;
    best: number;
  };
  error?: string;
}

function calculateZulaessigeHoechstmiete(answers: FinalAnswers): {
  worst: number;
  best: number;
} {
  const visibleQuestionAliases = getVisibleQuestionAliases(answers);

  return getWorstBestZulaessigeHoechstmiete(answers, visibleQuestionAliases);
}

export const onRequestPost: PagesFunction = async (context) => {
  try {
    // Parse the request body
    const request = context.request;
    const requestData: ZulaessigeHoechstmieteRequest = await request.json();

    // Validate the request
    if (!requestData.answers) {
      return new Response(
        JSON.stringify({
          error: "Missing required field: answers",
        } as ZulaessigeHoechstmieteResponse),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Allow CORS for the Chrome extension
          },
        },
      );
    }

    // Calculate the zulaessigeHoechstmiete
    const zulaessigeHoechstmiete = calculateZulaessigeHoechstmiete(
      requestData.answers,
    );

    // Return the result
    return new Response(
      JSON.stringify({
        zulaessigeHoechstmiete,
      } as ZulaessigeHoechstmieteResponse),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Allow CORS for the Chrome extension
        },
      },
    );
  } catch (error) {
    // Handle any errors
    console.error("Error calculating zulaessigeHoechstmiete:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while calculating the zulaessigeHoechstmiete",
      } as ZulaessigeHoechstmieteResponse),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Allow CORS for the Chrome extension
        },
      },
    );
  }
};

// Handle OPTIONS requests for CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
};

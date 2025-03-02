export interface MietencheckRequest {
  // Basic apartment information
  wohnflaeche: number;
  baujahr: number;
  wohnlage: "einfach" | "mittel" | "gut";

  // Current rent information
  aktuelleNettokaltmiete?: number;

  // Optional parameters for more accurate calculation
  ausstattung?: "einfach" | "mittel" | "gut";
  merkmale?: Record<string, boolean>;
  sondermerkmale?: Record<string, boolean>;
}

export interface MietencheckResponse {
  ortsueblicheVergleichsmiete?: {
    worst: number;
    best: number;
  };
  zulaessigeHoechstmiete?: {
    worst: number;
    best: number;
  };
  istMietpreisUeberhoeht?: boolean;
  ueberschreitungInProzent?: number;
  ueberschreitungInEuro?: number;
  error?: string;
}

/**
 * This is a simplified calculation of the ortsübliche Vergleichsmiete.
 * In a real implementation, you would use the actual calculation from your application.
 * This is just a placeholder that returns dummy values based on the input parameters.
 */
function calculateOrtsueblicheVergleichsmiete(request: MietencheckRequest): {
  worst: number;
  best: number;
} {
  // Base price per square meter based on location quality
  let basePrice = 0;
  switch (request.wohnlage) {
    case "einfach":
      basePrice = 7.5;
      break;
    case "mittel":
      basePrice = 10;
      break;
    case "gut":
      basePrice = 12.5;
      break;
  }

  // Age factor based on construction year
  let ageFactor = 1.0;
  if (request.baujahr < 1950) {
    ageFactor = 0.9;
  } else if (request.baujahr >= 1950 && request.baujahr < 1990) {
    ageFactor = 1.0;
  } else if (request.baujahr >= 1990 && request.baujahr < 2010) {
    ageFactor = 1.1;
  } else {
    ageFactor = 1.2;
  }

  // Calculate the price range
  const averagePrice = basePrice * ageFactor;

  // Return a range around the average price
  return {
    worst: Number((averagePrice * 0.9).toFixed(2)),
    best: Number((averagePrice * 1.1).toFixed(2)),
  };
}

/**
 * Calculates the zulässige Höchstmiete based on the ortsübliche Vergleichsmiete and Wohnfläche.
 * The zulässige Höchstmiete is 10% above the ortsübliche Vergleichsmiete.
 */
function calculateZulaessigeHoechstmiete(
  wohnflaeche: number,
  ortsueblicheVergleichsmiete: { worst: number; best: number },
): { worst: number; best: number } {
  return {
    worst: Number(
      (ortsueblicheVergleichsmiete.worst * wohnflaeche * 1.1).toFixed(2),
    ),
    best: Number(
      (ortsueblicheVergleichsmiete.best * wohnflaeche * 1.1).toFixed(2),
    ),
  };
}

/**
 * Checks if the current rent exceeds the legal maximum rent.
 */
function checkMietpreisUeberhoeht(
  aktuelleNettokaltmiete: number,
  zulaessigeHoechstmiete: { worst: number; best: number },
): {
  istUeberhoeht: boolean;
  ueberschreitungInProzent: number;
  ueberschreitungInEuro: number;
} {
  // We use the "best" (highest) value for the comparison
  const maxZulaessigeHoechstmiete = zulaessigeHoechstmiete.best;

  if (aktuelleNettokaltmiete <= maxZulaessigeHoechstmiete) {
    return {
      istUeberhoeht: false,
      ueberschreitungInProzent: 0,
      ueberschreitungInEuro: 0,
    };
  }

  const ueberschreitungInEuro = Number(
    (aktuelleNettokaltmiete - maxZulaessigeHoechstmiete).toFixed(2),
  );
  const ueberschreitungInProzent = Number(
    ((ueberschreitungInEuro / maxZulaessigeHoechstmiete) * 100).toFixed(2),
  );

  return {
    istUeberhoeht: true,
    ueberschreitungInProzent,
    ueberschreitungInEuro,
  };
}

export const onRequestPost: PagesFunction = async (context) => {
  try {
    // Parse the request body
    const request = context.request;
    const requestData: MietencheckRequest = await request.json();

    // Validate the request
    if (!requestData.wohnflaeche) {
      return new Response(
        JSON.stringify({
          error: "Missing required field: wohnflaeche",
        } as MietencheckResponse),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Allow CORS for the Chrome extension
          },
        },
      );
    }

    if (!requestData.baujahr) {
      return new Response(
        JSON.stringify({
          error: "Missing required field: baujahr",
        } as MietencheckResponse),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Allow CORS for the Chrome extension
          },
        },
      );
    }

    if (!requestData.wohnlage) {
      return new Response(
        JSON.stringify({
          error: "Missing required field: wohnlage",
        } as MietencheckResponse),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Allow CORS for the Chrome extension
          },
        },
      );
    }

    // Calculate the ortsueblicheVergleichsmiete
    const ortsueblicheVergleichsmiete =
      calculateOrtsueblicheVergleichsmiete(requestData);

    // Calculate the zulaessigeHoechstmiete
    const zulaessigeHoechstmiete = calculateZulaessigeHoechstmiete(
      requestData.wohnflaeche,
      ortsueblicheVergleichsmiete,
    );

    // Prepare the response
    const response: MietencheckResponse = {
      ortsueblicheVergleichsmiete,
      zulaessigeHoechstmiete,
    };

    // Check if the rent is too high, if the current rent is provided
    if (requestData.aktuelleNettokaltmiete) {
      const mietpreisCheck = checkMietpreisUeberhoeht(
        requestData.aktuelleNettokaltmiete,
        zulaessigeHoechstmiete,
      );

      response.istMietpreisUeberhoeht = mietpreisCheck.istUeberhoeht;
      response.ueberschreitungInProzent =
        mietpreisCheck.ueberschreitungInProzent;
      response.ueberschreitungInEuro = mietpreisCheck.ueberschreitungInEuro;
    }

    // Return the result
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow CORS for the Chrome extension
      },
    });
  } catch (error) {
    // Handle any errors
    console.error("Error calculating mietencheck:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing the mietencheck request",
      } as MietencheckResponse),
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

# Mietencheck API Documentation

This API provides endpoints for calculating the legal maximum rent for apartments in Germany based on the Mietpreisbremse law.

## Endpoints

### 1. `/api/mietencheck` (Recommended)

This is the main endpoint that provides a comprehensive rent check. It calculates the ortsübliche Vergleichsmiete (local comparative rent), the zulässige Höchstmiete (legal maximum rent), and checks if the current rent exceeds the legal maximum.

#### Request

```json
POST /api/mietencheck
Content-Type: application/json

{
  "wohnflaeche": 60,
  "baujahr": 1985,
  "wohnlage": "mittel",
  "aktuelleNettokaltmiete": 800,
  "ausstattung": "gut",
  "merkmale": {
    "balkon": true,
    "einbaukueche": true
  },
  "sondermerkmale": {
    "denkmalschutz": false
  }
}
```

| Parameter              | Type   | Required | Description                                          |
| ---------------------- | ------ | -------- | ---------------------------------------------------- |
| wohnflaeche            | number | Yes      | The apartment size in square meters                  |
| baujahr                | number | Yes      | The year the building was constructed                |
| wohnlage               | string | Yes      | The location quality: 'einfach', 'mittel', or 'gut'  |
| aktuelleNettokaltmiete | number | No       | The current net cold rent (without utilities)        |
| ausstattung            | string | No       | The apartment quality: 'einfach', 'mittel', or 'gut' |
| merkmale               | object | No       | A map of apartment features                          |
| sondermerkmale         | object | No       | A map of special features                            |

#### Response

```json
{
  "ortsueblicheVergleichsmiete": {
    "worst": 9.0,
    "best": 11.0
  },
  "zulaessigeHoechstmiete": {
    "worst": 594.0,
    "best": 726.0
  },
  "istMietpreisUeberhoeht": true,
  "ueberschreitungInProzent": 10.19,
  "ueberschreitungInEuro": 74.0
}
```

| Field                       | Type    | Description                                                             |
| --------------------------- | ------- | ----------------------------------------------------------------------- |
| ortsueblicheVergleichsmiete | object  | The local comparative rent per square meter                             |
| zulaessigeHoechstmiete      | object  | The legal maximum rent for the entire apartment                         |
| istMietpreisUeberhoeht      | boolean | Whether the current rent exceeds the legal maximum                      |
| ueberschreitungInProzent    | number  | The percentage by which the current rent exceeds the legal maximum      |
| ueberschreitungInEuro       | number  | The amount in euros by which the current rent exceeds the legal maximum |

### 2. `/api/ortsueblicheVergleichsmiete`

This endpoint calculates only the ortsübliche Vergleichsmiete (local comparative rent).

#### Request

```json
POST /api/ortsueblicheVergleichsmiete
Content-Type: application/json

{
  "wohnflaeche": 60,
  "baujahr": 1985,
  "wohnlage": "mittel",
  "ausstattung": "gut",
  "merkmale": {
    "balkon": true,
    "einbaukueche": true
  },
  "sondermerkmale": {
    "denkmalschutz": false
  }
}
```

#### Response

```json
{
  "ortsueblicheVergleichsmiete": {
    "worst": 9.0,
    "best": 11.0
  }
}
```

### 3. `/api/zulaessigeHoechstmiete`

This endpoint calculates only the zulässige Höchstmiete (legal maximum rent).

#### Request

```json
POST /api/zulaessigeHoechstmiete
Content-Type: application/json

{
  "wohnflaeche": 60,
  "ortsueblicheVergleichsmiete": {
    "worst": 9.0,
    "best": 11.0
  }
}
```

#### Response

```json
{
  "zulaessigeHoechstmiete": {
    "worst": 594.0,
    "best": 726.0
  }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in case of errors:

- 400 Bad Request: Missing required fields
- 500 Internal Server Error: Unexpected errors

Example error response:

```json
{
  "error": "Missing required field: wohnflaeche"
}
```

## CORS Support

All endpoints support CORS (Cross-Origin Resource Sharing) to allow requests from your Chrome extension. The following headers are included in all responses:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

## Notes

- The calculations in this API are simplified and may not reflect the exact legal requirements. For legal advice, please consult a lawyer.
- The "worst" and "best" values represent the lower and upper bounds of the calculated values, respectively.
- The API is designed to be used by a Chrome extension that extracts apartment information from listing websites.

import { expect, test, type Page } from "@playwright/test";

import type { MietenFlowDocument } from "../../src/api/mietencheck-backend/types";
import { getDefaultBeratungRecord } from "../../src/pages/beratung/mock-data";

const recordId = "beratung-test-record";
const detailPath = `/beratung/${recordId}`;

async function mockBeratung(
  page: Page,
  options: {
    failFirstSave?: boolean;
    loadStatus?: number;
    missing?: boolean;
  } = {},
) {
  let stored: MietenFlowDocument = {
    _id: recordId,
    folder_uuid: "test-folder",
    datasheet_uuid: "test-datasheet",
    lawAndOrgaURL: "https://example.invalid/test-record",
    flowData: { ...getDefaultBeratungRecord(), vertragsdatum: "2018-2020" },
  };
  const saves: unknown[] = [];
  await page.addInitScript(() => {
    // Seed once so an actual logout can clear the session across navigation.
    if (!sessionStorage.getItem("test-session-seeded")) {
      sessionStorage.setItem("test-session-seeded", "true");
      sessionStorage.setItem("mietencheck_api_token", "test-token");
      sessionStorage.setItem(
        "mietencheck_api_token_expires_at",
        String(Date.now() + 3600000),
      );
    }
  });
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname.startsWith("/api-mietencheck/")) {
      expect(url.pathname).toBe("/api-mietencheck/mieten-flow");
      expect(request.headers().authorization).toBe("Bearer test-token");
      if (request.method() === "GET") {
        await route.fulfill({
          status: options.loadStatus ?? 200,
          json: options.missing ? [] : [stored],
        });
      } else {
        expect(request.method()).toBe("PUT");
        const body = request.postDataJSON();
        saves.push(body);
        if (options.failFirstSave && saves.length === 1) {
          await route.fulfill({
            status: 500,
            json: { message: "Save failed" },
          });
        } else {
          stored = { ...stored, ...body };
          await route.fulfill({ json: stored });
        }
      }
    } else if (url.origin === "http://127.0.0.1:5174") {
      await route.continue();
    } else {
      // No production backend, analytics, or other external requests.
      await route.abort();
    }
  });
  await page.goto(detailPath);
  return saves;
}

async function selectAusstattung(
  page: Page,
  name: "Sammelheizung" | "Bad",
  value: "Ja" | "Nein",
) {
  await page.getByRole("combobox", { name, exact: true }).click();
  await page.getByRole("option", { name: value, exact: true }).click();
  await expect(page.getByRole("combobox", { name, exact: true })).toContainText(
    value,
  );
}

async function expectRent(page: Page, amount: string) {
  const table = page
    .getByRole("heading", { name: "Zulässige Höchstmiete", exact: true })
    .locator("..")
    .getByRole("table");
  const result = table
    .getByRole("row")
    .filter({ has: page.getByRole("cell", { name: "Ergebnis", exact: true }) });
  // Assert both ends of the displayed range against a known fixture amount.
  await expect(result.getByRole("cell").nth(1)).toContainText(amount);
  await expect(result.getByRole("cell").nth(2)).toContainText(amount);
}

test("edits Ausstattung, recalculates, saves the complete record, and reloads", async ({
  page,
}) => {
  const saves = await mockBeratung(page);
  await expectRent(page, "744,70");
  await selectAusstattung(page, "Sammelheizung", "Nein");
  await expectRent(page, "589,60");
  await selectAusstattung(page, "Bad", "Nein");
  await expectRent(page, "502,70");
  await page.getByRole("button", { name: "Speichern", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Änderungen wurden gespeichert.",
  );
  expect(saves).toEqual([
    {
      folder_uuid: "test-folder",
      datasheet_uuid: "test-datasheet",
      lawAndOrgaURL: "https://example.invalid/test-record",
      flowData: {
        ...getDefaultBeratungRecord(),
        vertragsdatum: "2018-2020",
        ausstattung: { sammelheizung: "Nein", bad: "Nein" },
      },
    },
  ]);
  await page.reload();
  for (const name of ["Sammelheizung", "Bad"]) {
    await expect(
      page.getByRole("combobox", { name, exact: true }),
    ).toContainText("Nein");
  }
  await expectRent(page, "502,70");
});

test("retains edits after a failed save and allows retry", async ({ page }) => {
  const saves = await mockBeratung(page, { failFirstSave: true });
  await selectAusstattung(page, "Bad", "Nein");
  await page.getByRole("button", { name: "Speichern", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "Speichern fehlgeschlagen. Bitte erneut versuchen.",
  );
  await expect(
    page.getByRole("combobox", { name: "Bad", exact: true }),
  ).toContainText("Nein");
  await expectRent(page, "589,60");
  await page.getByRole("button", { name: "Speichern", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Änderungen wurden gespeichert.",
  );
  expect(saves).toHaveLength(2);
  expect(saves[1]).toEqual(saves[0]);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Bad", exact: true }),
  ).toContainText("Nein");
  await expectRent(page, "589,60");
});

test("shows a missing record", async ({ page }) => {
  await mockBeratung(page, { missing: true });
  await expect(page.getByRole("alert")).toHaveText("Eintrag nicht gefunden.");
});

test("shows a loading failure", async ({ page }) => {
  await mockBeratung(page, { loadStatus: 500 });
  await expect(page.getByRole("alert")).toHaveText("Laden fehlgeschlagen.");
});

test("redirects to login when the backend rejects the session", async ({
  page,
}) => {
  await mockBeratung(page, { loadStatus: 401 });
  await expect(page).toHaveURL(/\/login\?next=/);
  expect(
    await page.evaluate(() => sessionStorage.getItem("mietencheck_api_token")),
  ).toBeNull();
});

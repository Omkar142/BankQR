import { test, expect } from "@playwright/test";
const account = "001234567890";
const payload = {
  v: 1,
  mode: "payment",
  merchantName: "Kiran Stores",
  accountHolderName: "Kiran Rao",
  accountNumber: account,
  ifsc: "HDFC0001234",
  amountPaise: 12500,
  createdAt: "2026-09-18T00:00:00.000Z",
};
const hash = (value: unknown) =>
  "#v1=" + Buffer.from(JSON.stringify(value)).toString("base64url");
test("skip navigation keeps payment fragment intact", async ({ page }) => {
  await page.goto("/pay/" + hash(payload));
  await page.getByRole("heading", { name: "Kiran Stores" }).waitFor();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Kiran Stores" }),
  ).toBeVisible();
  expect(new URL(page.url()).hash).toBe(hash(payload));
});
test("valid-to-valid fragment changes reset reveal and customer state", async ({
  page,
}) => {
  await page.goto("/pay/" + hash(payload));
  await page.getByRole("button", { name: "Show account number" }).click();
  await expect(page.getByText(account, { exact: true })).toBeVisible();
  await page.evaluate(
    (next) => {
      location.hash = next;
    },
    hash({
      ...payload,
      merchantName: "Next Store",
      accountNumber: "999999123456",
    }),
  );
  await expect(page.getByRole("heading", { name: "Next Store" })).toBeVisible();
  await expect(page.getByText("•••• •••• 3456")).toBeVisible();
  await expect(page.getByText(account, { exact: true })).toHaveCount(0);
});
test("complete payment generation, share fallback and profile reload", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined });
  });
  await page.goto("/create/");
  await page.getByRole("radio", { name: "Payment QR", exact: true }).check();
  await page.getByLabel("Merchant name", { exact: true }).fill("Kiran Stores");
  await page
    .getByLabel("Account holder name", { exact: true })
    .fill("Kiran Rao");
  await page.getByLabel("Account number", { exact: true }).fill(account);
  await page
    .getByLabel("Confirm account number", { exact: true })
    .fill(account);
  await page.getByLabel("IFSC", { exact: true }).fill("HDFC0001234");
  await page
    .getByLabel("I confirm these receiving details are correct.")
    .check();
  await page
    .getByRole("button", { name: "Generate BankQR", exact: true })
    .click();
  await expect(
    page.getByText(
      "Enter an amount greater than ₹0, with up to 2 decimal places.",
    ),
  ).toBeVisible();
  await page.getByLabel("Amount (₹)", { exact: true }).fill("125.00");
  await page.getByLabel("Reference (optional)").fill("INV-1");
  await page
    .getByRole("button", { name: "Generate BankQR", exact: true })
    .click();
  await page.getByRole("heading", { name: "Your BankQR is ready" }).waitFor();
  await page.getByRole("button", { name: "Share", exact: true }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(new URL(copied).search).toBe("");
  expect(copied).toContain("/pay/#c1=");
  await page.getByRole("button", { name: "Copy link", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(copied);
  await page.getByRole("button", { name: "Save on this device" }).click();
  const saved = await page.evaluate(() => Object.values(localStorage)[0]);
  expect(saved).not.toContain("amount");
  expect(saved).not.toContain("INV-1");
  await page.goto(copied);
  await expect(page.getByText("₹125.00", { exact: true })).toBeVisible();
  await expect(page.getByText("INV-1", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Amount to pay")).toHaveCount(0);
  await page.goto("/create/");
  await page.getByRole("button", { name: "Load saved profile" }).click();
  await expect(page.getByLabel("Account number", { exact: true })).toHaveValue(
    account,
  );
  await expect(
    page.getByLabel("I confirm these receiving details are correct."),
  ).not.toBeChecked();
});
test("blocked browser storage has recoverable guidance", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    });
  });
  await page.goto("/create/");
  await page.getByRole("button", { name: "Load saved profile" }).click();
  await expect(
    page.getByText("Local storage is unavailable in this browser."),
  ).toBeVisible();
  await expect(
    page.getByLabel("Merchant name", { exact: true }),
  ).toBeEditable();
});
test("production pay has no console errors or CSP violations", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/pay/" + hash(payload));
  await page.getByRole("heading", { name: "Kiran Stores" }).waitFor();
  await page
    .getByRole("button", { name: "How to make a bank transfer", exact: true })
    .click();
  await page.getByRole("dialog").waitFor();
  expect(errors).toEqual([]);
});

import { chromium, expect } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();
const siteUrl = (process.env.BANKQR_PAGES_URL ?? "http://127.0.0.1:4174/BankQR/").replace(
  /\/?$/,
  "/",
);
const siteOrigin = new URL(siteUrl).origin;
const siteBasePath = new URL(siteUrl).pathname.replace(/\/$/, "");
const failures = [];
page.on("pageerror", (error) => failures.push(`pageerror ${error.message}`));
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    failures.push(`console ${message.type()} ${message.text()}`);
  }
});
page.on("requestfailed", (request) =>
  failures.push(`requestfailed ${request.url()} ${request.failure()?.errorText ?? "unknown"}`),
);
page.on("response", (response) => {
  if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
});
await page.goto(siteUrl);
await page.getByRole("link", { name: "Create BankQR", exact: true }).click();
await expect(page).toHaveURL(`${siteOrigin}${siteBasePath}/create/`);
const merchantName = page.getByLabel("Merchant name", { exact: true });
await expect
  .poll(async () => {
    await merchantName.fill("Kiran Stores");
    return page.getByRole("heading", { name: "Kiran Stores", exact: true }).count();
  })
  .toBe(1);
await page.getByLabel("Account holder name", { exact: true }).fill("Kiran Rao");
await page.getByLabel("Account number", { exact: true }).fill("001234567890");
await page.getByLabel("Confirm account number", { exact: true }).fill("001234567890");
await page.getByLabel("IFSC", { exact: true }).fill("HDFC0001234");
const confirmation = page.getByLabel("I confirm these receiving details are correct.");
await confirmation.click();
await expect(confirmation).toBeChecked();
await page.getByRole("button", { name: "Generate BankQR", exact: true }).click();
const testPaymentLink = page.getByRole("link", { name: "Test payment page" });
try {
  await expect(testPaymentLink).toBeVisible();
} catch (error) {
  throw new Error(
    `Payment link did not appear. Browser failures:\n${failures.join("\n") || "none"}`,
    { cause: error },
  );
}
const testUrl = await testPaymentLink.getAttribute("href");
if (!testUrl?.startsWith(`${siteOrigin}${siteBasePath}/pay/#v1=`)) {
  throw new Error(`Unexpected generated Pages URL: ${testUrl}`);
}
await page.goto(testUrl);
await expect(page.getByRole("heading", { name: "Kiran Stores" })).toBeVisible();
if (failures.length) throw new Error(`Resource failures:\n${failures.join("\n")}`);
console.log("GitHub Pages base-path flow passed without resource errors.");
await browser.close();

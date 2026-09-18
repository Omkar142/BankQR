import { chromium, expect } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();
const failures = [];
page.on("pageerror", (error) => failures.push(`pageerror ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") failures.push(`console ${message.text()}`);
});
page.on("response", (response) => {
  if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
});
await page.goto("http://127.0.0.1:4174/BankQR/");
await page.getByRole("link", { name: "Create BankQR", exact: true }).click();
await expect(page).toHaveURL("http://127.0.0.1:4174/BankQR/create/");
await page.getByLabel("Merchant name", { exact: true }).fill("Kiran Stores");
await page.getByLabel("Account holder name", { exact: true }).fill("Kiran Rao");
await page.getByLabel("Account number", { exact: true }).fill("001234567890");
await page.getByLabel("Confirm account number", { exact: true }).fill("001234567890");
await page.getByLabel("IFSC", { exact: true }).fill("HDFC0001234");
const confirmation = page.getByLabel("I confirm these receiving details are correct.");
await confirmation.click();
await expect(confirmation).toBeChecked();
await page.getByRole("button", { name: "Generate BankQR", exact: true }).click();
const testUrl = await page.getByRole("link", { name: "Test payment page" }).getAttribute("href");
if (!testUrl?.startsWith("http://127.0.0.1:4174/BankQR/pay/#v1=")) {
  throw new Error(`Unexpected generated Pages URL: ${testUrl}`);
}
await page.goto(testUrl);
await expect(page.getByRole("heading", { name: "Kiran Stores" })).toBeVisible();
if (failures.length) throw new Error(`Resource failures:\n${failures.join("\n")}`);
console.log("GitHub Pages base-path flow passed without resource errors.");
await browser.close();

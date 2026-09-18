import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("response", (response) => {
  if (response.status() >= 400) console.log(response.status(), response.url());
});
await page.goto("http://127.0.0.1:4173/");
await page.getByRole("link", { name: "Create BankQR", exact: true }).click();
await page.getByLabel("Merchant name", { exact: true }).waitFor();
await browser.close();

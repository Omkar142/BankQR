import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("artifacts/screenshots", { recursive: true });
const browser = await chromium.launch();
const payload = {
  v: 2,
  upiId: "kiran@bank",
  mode: "payment",
  merchantName: "Kiran Stores",
  accountHolderName: "Kiran Rao",
  accountNumber: "001234567890",
  ifsc: "HDFC0001234",
  amountPaise: 12500,
  createdAt: "2026-09-18T00:00:00.000Z",
};
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["mobile", 390, 844],
  ["small", 320, 800],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  for (const [route, path] of [
    ["landing", "/"],
    ["create", "/create/"],
    [
      "pay",
      "/pay/#v2=" + Buffer.from(JSON.stringify(payload)).toString("base64url"),
    ],
  ]) {
    await page.goto("http://127.0.0.1:4173" + path);
    await page.locator("h1").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `artifacts/screenshots/${route}-${name}.png`,
      fullPage: true,
    });
    console.log(
      JSON.stringify({
        route,
        width,
        overflow: await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        errors,
      }),
    );
  }
  for (const [section, selector] of [
    ["guide", ".bank-transfer-guide"],
    ["details", ".payment-details"],
    ["upi", ".upi-action"],
  ]) {
    await page.locator(selector).screenshot({
      path: `artifacts/screenshots/${section}-${name}.png`,
    });
  }
  await page
    .getByRole("button", { name: "How to make a bank transfer", exact: true })
    .click();
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "Close bank guidance" }).focus();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    await expect
      .poll(() =>
        page
          .getByRole("dialog")
          .evaluate((el) => el.contains(document.activeElement)),
      )
      .toBe(true);
  }
  await page.screenshot({
    path: `artifacts/screenshots/bank-${name}.png`,
    fullPage: true,
  });
  await page.close();
}
await browser.close();

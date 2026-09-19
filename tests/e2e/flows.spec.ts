import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import { readFile } from "node:fs/promises";
const payload = {
  v: 1,
  mode: "payment",
  merchantName: "Kiran Stores",
  accountHolderName: "Kiran Rao",
  accountNumber: "001234567890",
  ifsc: "HDFC0001234",
  amountPaise: 12500,
  createdAt: "2026-09-18T00:00:00.000Z",
};
const hash = (data: unknown) => {
  const version =
    typeof data === "object" && data !== null && "v" in data
      ? String(data.v)
      : "1";
  return `#v${version}=` +
    Buffer.from(JSON.stringify(data)).toString("base64url");
};
test("merchant generates real scannable PNG, saves explicitly, edits invalidate QR", async ({
  page,
}) => {
  await page.goto("/create/");
  await page.getByLabel("Merchant name", { exact: true }).fill("Kiran Stores");
  await page
    .getByLabel("Account holder name", { exact: true })
    .fill("Kiran Rao");
  await page.getByLabel("Account number", { exact: true }).fill("001234567890");
  await page
    .getByLabel("Confirm account number", { exact: true })
    .fill("001234567899");
  await page.getByLabel("IFSC", { exact: true }).fill("hdfc0001234");
  await page
    .getByLabel("I confirm these receiving details are correct.")
    .check();
  await page
    .getByRole("button", { name: "Generate BankQR", exact: true })
    .click();
  await expect(
    page.getByText("The account numbers do not match."),
  ).toBeVisible();
  await page
    .getByLabel("Confirm account number", { exact: true })
    .fill("001234567890");
  await page
    .getByRole("button", { name: "Generate BankQR", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your BankQR is ready" }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download QR" }).click();
  const download = await downloadPromise;
  const png = PNG.sync.read(await readFile((await download.path())!));
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  expect(decoded).toBeTruthy();
  expect(decoded!.data).toContain("/pay/#c1=");
  expect(download.suggestedFilename()).toMatch(
    /^bankqr-kiran-stores-\d{8}\.png$/,
  );
  await page.getByRole("button", { name: "Save on this device" }).click();
  expect(await page.evaluate(() => localStorage.length)).toBe(1);
  await page.getByRole("button", { name: "Edit details" }).click();
  await expect(
    page.getByRole("heading", { name: "Your BankQR is ready" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Delete saved profile" }).click();
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});
test("payment mode requires amount and confirms destructive mode switch", async ({
  page,
}) => {
  await page.goto("/create/");
  await page.getByRole("radio", { name: "Payment QR", exact: true }).check();
  await page.getByLabel("Amount (₹)", { exact: true }).fill("125.00");
  await page.getByRole("radio", { name: "Static QR", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Keep payment QR" }).click();
  await expect(page.getByLabel("Amount (₹)", { exact: true })).toHaveValue(
    "125.00",
  );
});
test("merchant can offer an exact UPI app intent with manual transfer fallback", async ({
  page,
}) => {
  await page.goto("/create/");
  await page.getByRole("radio", { name: "Payment QR", exact: true }).check();
  await page.getByLabel("Merchant name", { exact: true }).fill("Kiran Stores");
  await page
    .getByLabel("Account holder name", { exact: true })
    .fill("Kiran Rao");
  await page.getByLabel("Account number", { exact: true }).fill("001234567890");
  await page
    .getByLabel("Confirm account number", { exact: true })
    .fill("001234567890");
  await page.getByLabel("IFSC", { exact: true }).fill("HDFC0001234");
  await page.getByLabel("UPI ID (optional)", { exact: true }).fill("kiran@bank");
  await page.getByLabel("Amount (₹)", { exact: true }).fill("125.00");
  await page.getByLabel("Reference (optional)").fill("INV-1");
  await page
    .getByLabel("I confirm these receiving details are correct.")
    .check();
  await page
    .getByRole("button", { name: "Generate BankQR", exact: true })
    .click();
  const paymentUrl = await page
    .getByRole("link", { name: "Test payment page" })
    .getAttribute("href");
  expect(paymentUrl).toContain("/pay/#c1=");
  await page.goto(paymentUrl!);
  const upiAction = page.getByRole("link", { name: "Pay with UPI app" });
  await expect(upiAction).toBeVisible();
  const intent = await upiAction.getAttribute("href");
  expect(intent).toContain("upi://pay?");
  expect(intent).toContain("pa=kiran%40bank");
  expect(intent).toContain("am=125.00");
  expect(intent).not.toContain("001234567890");
  expect(intent).not.toContain("HDFC0001234");
  await expect(
    page.getByRole("button", { name: "How to make a bank transfer" }),
  ).toBeVisible();
  const transferAction = page.getByRole("button", {
    name: "How to make a bank transfer",
  });
  await expect(transferAction).toHaveClass(/primary/);
  await expect(upiAction).toHaveClass(/secondary/);
  expect(
    await transferAction.evaluate(
      (button, upi) =>
        Boolean(
          button.compareDocumentPosition(upi) & Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      await upiAction.elementHandle(),
    ),
  ).toBe(true);
});
test("static UPI requires a valid customer amount before app launch", async ({
  page,
}) => {
  await page.goto(
    "/pay/" +
      hash({
        ...payload,
        v: 2,
        mode: "static",
        upiId: "kiran@bank",
        amountPaise: undefined,
      }),
  );
  await expect(
    page.getByRole("button", { name: "Enter an amount to use UPI" }),
  ).toBeDisabled();
  await page.getByLabel("Amount to pay").fill("1.001");
  await expect(page.getByText(/Enter an amount greater than/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Pay with UPI app" })).toHaveCount(0);
  await page.getByLabel("Amount to pay").fill("25.50");
  await expect(page.getByRole("link", { name: "Pay with UPI app" })).toHaveAttribute(
    "href",
    /upi:\/\/pay\?.*am=25\.50/,
  );
});
test("payer masks account, copies full value, traps sheet focus and changes hash fail closed", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/pay/" + hash(payload));
  await expect(
    page.getByRole("heading", { name: "Kiran Stores" }),
  ).toBeVisible();
  await expect(page.getByText("•••• •••• 7890")).toBeVisible();
  await expect(page.getByLabel("Amount to pay")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Copy account number", exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "001234567890",
  );
  await page
    .getByRole("button", { name: "How to make a bank transfer", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByText("Open your banking app manually", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "How to make a bank transfer", exact: true }),
  ).toBeFocused();
  await page.evaluate(() => {
    location.hash = "v1=bad";
  });
  await expect(
    page.getByText("This BankQR link is invalid or incomplete."),
  ).toBeVisible();
  await expect(page.getByText("Kiran Stores")).toHaveCount(0);
});
test("bank details are prominent and instructions avoid a fake app list", async ({
  page,
}) => {
  await page.goto("/pay/" + hash(payload));
  await expect(
    page.getByRole("heading", { name: "Bank transfer details" }),
  ).toBeVisible();
  await expect(
    page.getByText("Copy and paste one detail at a time. Your phone keeps only the last detail copied."),
  ).toBeVisible();
  const guide = page.getByRole("region", { name: "Pay by bank transfer" });
  await expect(guide).toBeVisible();
  await expect(guide).toContainText("IMPS or NEFT");
  await expect(guide).toContainText("touch and hold the matching box, then tap Paste");
  await expect(page.getByText("Paste into IFSC in your bank app.", { exact: true })).toBeVisible();
  const accountCopy = page.getByRole("button", {
    name: "Copy account number",
    exact: true,
  });
  await expect(accountCopy).toContainText("Copy");
  const ifscCopy = page.getByRole("button", {
    name: "Copy ifsc",
    exact: true,
  });
  await expect(ifscCopy).toContainText("Copy");
  await page
    .getByRole("button", { name: "How to make a bank transfer" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "account-and-IFSC transfer",
  );
  await expect(page.getByRole("dialog")).toContainText("Add the beneficiary");
  await expect(page.getByRole("dialog")).not.toContainText("State Bank of India");
});
test("optional UPI has Android recovery and exact manual-copy fallback", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/pay/" + hash({ ...payload, v: 2, upiId: "kiran@bank" }));
  const upi = page.getByRole("region", { name: "Or, you can pay via UPI" });
  await expect(upi).toContainText("Choose this if you prefer");
  await upi.getByText("UPI app not opening?", { exact: true }).click();
  await expect(upi.getByRole("link", { name: "Try opening UPI apps on Android" })).toHaveAttribute(
    "href",
    "intent://pay?pa=kiran%40bank&pn=Kiran+Rao&am=125.00&cu=INR#Intent;scheme=upi;end",
  );
  await upi.getByRole("button", { name: "Copy upi id", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("kiran@bank");
  await page.getByRole("button", { name: "Copy ifsc", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("HDFC0001234");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test("static amount, clipboard fallback, zero payload storage or request leakage", async ({
  page,
}) => {
  const urls: string[] = [];
  page.on("request", (r) => urls.push(r.url()));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("denied");
        },
      },
    });
  });
  const { amountPaise: _, ...staticPayload } = payload;
  void _;
  await page.goto("/pay/" + hash({ ...staticPayload, mode: "static" }));
  await page.getByLabel("Amount to pay").fill("25.50");
  await page
    .getByRole("button", { name: "Copy account number", exact: true })
    .click();
  await expect(page.getByLabel("Select account number")).toHaveValue(
    "001234567890",
  );
  expect(
    urls.every(
      (url) =>
        !url.includes(payload.accountNumber) && !url.includes(payload.ifsc),
    ),
  ).toBe(true);
  expect(
    urls.every((url) => new URL(url).origin === "http://127.0.0.1:4173"),
  ).toBe(true);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
});
test("accessible payer, reduced motion and 320px layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/pay/" + hash(payload));
  await expect(
    page.getByRole("heading", { name: "Kiran Stores" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page
    .getByRole("button", { name: "How to make a bank transfer", exact: true })
    .click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    await expect
      .poll(() =>
        page
          .getByRole("dialog")
          .evaluate((el) => el.contains(document.activeElement)),
      )
      .toBe(true);
  }
});
test("landing, creation and legal pages are reachable and accessible", async ({
  page,
}) => {
  for (const route of ["/", "/create/", "/privacy/", "/terms/"]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});

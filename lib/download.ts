export function qrFilename(merchant: string, date = new Date()): string {
  const slug =
    merchant
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50)
      .toLowerCase() || "merchant";
  return `bankqr-${slug}-${date.toISOString().slice(0, 10).replaceAll("-", "")}.png`;
}
export function downloadPng(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
}

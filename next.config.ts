import type { NextConfig } from "next";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  devIndicators: false,
  outputFileTracingRoot: process.cwd(),
  basePath,
};
export default config;

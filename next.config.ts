import type { NextConfig } from "next";

const config: NextConfig = {
  distDir: process.env.DIRECTORY_BUILD_DIR ?? ".next",
  async headers() { return [{ source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, noarchive" }] }]; },
  outputFileTracingIncludes: { "/api/contact": ["./src/content/**/*"] },
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};
export default config;

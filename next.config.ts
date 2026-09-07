import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ponytail: 127.0.0.1 hits get their /_next/hmr WebSocket blocked as cross-origin
  // (dev server only allowlists "localhost" by default), which silently kills client
  // hydration in this Next 16 canary. Allowlist both hosts used in dev/testing.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;

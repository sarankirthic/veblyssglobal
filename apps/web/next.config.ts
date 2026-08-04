import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root — there's an unrelated lockfile in $HOME that
  // Next.js would otherwise misdetect as the monorepo root.
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // Minimal self-contained server bundle for Docker/Coolify deploys
  // (Dockerfile.web). Vercel ignores this and uses its own build pipeline.
  output: "standalone",
  images: {
    // Only the R2 media bucket serves real images — a wildcard hostname here
    // would let Next's image optimizer fetch (and proxy) any https URL,
    // which is a known SSRF vector for the /_next/image endpoint.
    remotePatterns: [{ protocol: "https", hostname: "media.veblyssglobal.com" }],
  },
};

export default nextConfig;

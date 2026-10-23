import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Photo uploads go through server actions. Room for one 10 MB photo plus
    // form overhead, so src/lib/upload-rules.ts gives the "too large" message
    // instead of Next.js refusing the request (default limit: 1 MB).
    serverActions: { bodySizeLimit: "12mb" },
    proxyClientMaxBodySize: "12mb", // /admin requests pass through src/proxy.ts
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

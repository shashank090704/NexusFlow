import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // If optimizeFonts is not recognized, 
  // we use this to prevent the build from hanging on network requests
  experimental: {
    optimizePackageImports: ["@repo/db"], // Good for your monorepo
  },
};

export default nextConfig;
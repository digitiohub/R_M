import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained Node.js server for Docker/Coolify deployments.
  output: "standalone",
};

export default nextConfig;

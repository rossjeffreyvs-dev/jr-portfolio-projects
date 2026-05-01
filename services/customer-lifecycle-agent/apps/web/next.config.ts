import type { NextConfig } from "next";

const basePath = process.env.CUSTOMER_LIFECYCLE_BASE_PATH || "";

const nextConfig = {
  basePath,
  devIndicators: false,
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

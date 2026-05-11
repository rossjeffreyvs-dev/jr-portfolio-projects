/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: false,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8020"
  }
};

export default nextConfig;

const basePath = process.env.CUSTOMER_LIFECYCLE_BASE_PATH || "";

const nextConfig = {
  basePath,
  devIndicators: false,
};

export default nextConfig;

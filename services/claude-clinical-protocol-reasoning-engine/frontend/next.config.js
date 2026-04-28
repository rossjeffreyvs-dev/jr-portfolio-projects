const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "standalone",
  basePath: isProd ? "/claude-clinical-protocol-reasoning-engine" : "",
  assetPrefix: isProd ? "/claude-clinical-protocol-reasoning-engine" : "",
};

module.exports = nextConfig;

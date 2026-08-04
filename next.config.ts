import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const gatewayUrl = process.env.API_URL ?? "https://pulse-tech-beryl.vercel.app/backend-api";
    return [
      { source: "/backend-api/:path*", destination: `${gatewayUrl}/:path*` }
    ];
  },
};

export default nextConfig;

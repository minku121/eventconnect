import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb'
    },
  },
  images: {
    domains: ['blogger.googleusercontent.com','i.sstatic.net',],
  },
};

export default nextConfig;
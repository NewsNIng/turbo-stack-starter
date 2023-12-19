// https://nextjs.org/docs/api-reference/next.config.js/introduction

// import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";


/** @type {import('next').NextConfig} */

const config = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
     // config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    return config
  },
};


export default config;
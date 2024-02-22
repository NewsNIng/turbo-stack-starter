// https://nextjs.org/docs/api-reference/next.config.js/introduction

// import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";



import autoImportPlugin from 'unplugin-auto-import/webpack';

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

    config.plugins.push(autoImportPlugin({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      ],
      injectAtEnd: false,
      imports: [
        'react',
        {
          '@utils/api': ['api'],

        },
        {
          // 'tagged-classnames-free': ['cls', 'tw'],
        },
      ],
    }));



    return config
  },
  modularizeImports: {
    // 'antd': {
    //   transform: 'antd/lib/{{ kebabCase member }}',
    // },
    'lodash-es': {
      transform: 'lodash-es/{{member}}',
    },
  },
};


export default config;
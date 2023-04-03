const isProduction = process.env.NODE_ENV === 'production';

const basePath = isProduction ? '/suresheet' : undefined;
const assetPrefix = isProduction ? '/suresheet/' : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath,
  assetPrefix,
  publicRuntimeConfig: {
    basePath: basePath ?? '',
    assetPrefix: assetPrefix ?? '',
  },
};

module.exports = nextConfig;

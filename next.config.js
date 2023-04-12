// @ts-nocheck
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

require('dotenv').config()

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withBundleAnalyzer({
  env: {
    BASE_URL: process.env.BASE_URL,
    MORALIS_API_KEY: process.env.MORALIS_API_KEY,
    SOL_SCAN_TOKEN: process.env.SOL_SCAN_TOKEN,
  },
  images: {
    domains: ['ipfs.moralis.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.moralis.io',
        port: '',
        pathname: '**',
      },
    ],
  },
})

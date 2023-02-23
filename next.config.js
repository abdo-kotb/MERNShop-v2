/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_ROOT: process.env.API_ROOT,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.*',
      },
    ],
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack: (config, { webpack }) => {
    config.experiments = {
    ...config.experiments,
    topLevelAwait: true,
    }
    config.plugins.push(
    new webpack.ProvidePlugin({
    Buffer: ["buffer", "Buffer"],
    }),
    )
    return config
    },
  env: {
    NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    NEXT_PUBLIC_SUPABASE: process.env.SUPABASE_KEY,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
  },
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Next.js 16: Turbopack is default bundler
  // Phaser loaded client-side only via dynamic import — no SSR issues
}

module.exports = nextConfig

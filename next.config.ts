import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  // Додаємо ліміт для Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // Дозволяємо до 50МБ (вистачить на 10 фото по 5МБ)
    },
  },
};

export default nextConfig;

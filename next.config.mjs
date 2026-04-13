/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Masque le badge flottant « N » (contexte de route) en mode développement */
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
   
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'www.lego.com',
      'toysmart.co',
      'http2.mlstatic.com', // Para el dominio de Mercado Libre
      'm.media-amazon.com', // Para el dominio de Amazon
      // Añade cualquier otro dominio externo de imagen que utilices
    ],
    // O puedes usar 'remotePatterns' para una configuración más flexible y segura (recomendado para Next.js 13+)
    // Si estás usando Next.js 13 o superior, es preferible 'remotePatterns'
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'www.lego.com',
    //     port: '',
    //     pathname: '/cdn/cs/set/assets/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'toysmart.co',
    //     port: '',
    //     pathname: '/cdn/shop/products/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'http2.mlstatic.com',
    //     port: '',
    //     pathname: '/D_NQ_NP/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'm.media-amazon.com',
    //     port: '',
    //     pathname: '/images/I/**',
    //   },
    // ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
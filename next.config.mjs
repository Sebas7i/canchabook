/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'i.pravatar.cc', 'www.gstatic.com'],
  },
  experimental: {
    // Para asegurar compatibilidad extra con React 19 si es necesario
  }
};

export default nextConfig;

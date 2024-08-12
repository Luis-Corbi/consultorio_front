// next.config.js
const nextConfig = {
  productionBrowserSourceMaps: false, // Deshabilita los mapas en el navegador en producción
  // Configuraciones adicionales de Next.js
  webpack: (config, { isServer }) => {
    // Configuraciones específicas de Webpack
    return config;
  },
};

module.exports = nextConfig;


// tailwind.config.js

// Script para analizar el bundle size
// Ejecutar con: ANALYZE=true npm run build

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});


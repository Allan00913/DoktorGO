module.exports = {
  reactStrictMode: true,
  server: {
    port: process.env.PORT || 3001,
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api/v1',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3001',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'development-secret',
  },
};
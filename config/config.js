export const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'my_store',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    productionDbUrl: process.env.DB_POSTGRES_URL || null,
  },
  corsWhitelist: process.env.CORS_WHITELIST || '*',
};

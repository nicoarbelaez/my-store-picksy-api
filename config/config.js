import dotenv from 'dotenv';
dotenv.config();

export const config = {
  apikey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'http://localhost',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5431,
    database: process.env.DB_NAME || 'my_store',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  corsWhitelist: process.env.CORS_WHITELIST || '*',
  imgur: {
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
  },
  mail: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    from: process.env.SMTP_FROM_EMAIL,
  },
};

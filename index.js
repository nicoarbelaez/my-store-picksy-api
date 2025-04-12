import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { sequelize } from './lib/sequelize.js';
import { config } from './config/config.js';
import { initializeAuth } from './utils/auth/index.js';
import { checkApiKey } from './middlewares/auth.hanlder.js';
import routerApi from './routes/index.router.js';
import {
  errorHandler,
  logErrors,
  boomErrorHandler,
  sequelizeErrorHandler,
  multerErrorHandler,
} from './middlewares/error.handler.js';

// Configuración inicial
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

/** Configura CORS con lista blanca dinámica */
const configureCORS = () => {
  const whitelist =
    config.corsWhitelist === '*' ? [] : config.corsWhitelist.split(',');

  return cors({
    origin: (origin, callback) => {
      if (whitelist.length === 0 || whitelist.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
};

/** Configura los middlewares esenciales de la aplicación */
const configureAppMiddlewares = () => {
  app.use(express.json());
  app.use(configureCORS());
  app.use(initializeAuth());
};

/** Configura los archivos estáticos y ruta principal */
const configureStaticAssets = () => {
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));
  app.get('/', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));
};

/** Configura las rutas de la aplicación */
const configureRoutes = () => {
  // Ruta de ejemplo protegida
  app.get('/apikey', checkApiKey, (req, res) => {
    res.json({ apiKey: config.apikey });
  });

  // Rutas principales
  routerApi(app);
};

/** Configura los manejadores de errores */
const configureErrorHandling = () => {
  const errorMiddlewares = [
    logErrors,
    multerErrorHandler,
    sequelizeErrorHandler,
    boomErrorHandler,
    errorHandler,
  ];

  errorMiddlewares.forEach((middleware) => app.use(middleware));
};

/** Inicia el servidor después de validar la conexión a la DB */
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');

    app.listen(config.port, () => {
      console.log(
        `Server running on port ${config.port}\t http://${config.host}:${config.port}`,
      );
      console.log(`Environment: ${config.env}`);
      console.log(`CORS Whitelist: ${config.corsWhitelist}`);
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Secuencia de inicialización
(async () => {
  configureAppMiddlewares();
  configureStaticAssets();
  configureRoutes();
  configureErrorHandling();
  await startServer();
})();

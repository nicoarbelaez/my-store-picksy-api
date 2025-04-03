import express from 'express';
import { sequelize } from './lib/sequelize.js';
import routerApi from './routes/index.router.js';
import cors from 'cors';
import {
  errorHandler,
  logErrors,
  boomErrorHandler,
  sequelizeErrorHandler,
  multerErrorHandler,
} from './middlewares/error.handler.js';
import { config } from './config/config.js';

const app = express();
const PORT = config.port;

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
const whitelist =
  config.corsWhitelist === '*' ? [] : config.corsWhitelist.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.length === 0 || whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido'));
    }
  },
};
app.use(cors(corsOptions));

// Rutas de la API
routerApi(app);

// Middlewares de manejo de errores
app.use(logErrors);
app.use(multerErrorHandler);
app.use(sequelizeErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

// Probar la conexión a la base de datos y luego iniciar el servidor
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully!');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => {
    console.error(
      'Unable to connect to the database:',
      error.message + '\n',
      error,
    );
  });

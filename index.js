import express from 'express';
import path from 'path'; // Importa path para manejar rutas de archivos
import { fileURLToPath } from 'url'; // Necesario para obtener __dirname en ES Modules
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

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Servir archivos estáticos desde el directorio "public"
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para servir index.html en "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

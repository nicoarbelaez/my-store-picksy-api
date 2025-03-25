import express from 'express';
import routerApi from './routes/index.router.js';
import cors from 'cors';
import { errorHandler, logErrors, boomErrorHandler } from './middlewares/error.handler.js';

const app = express();
const PORT = 3000;

app.use(express.json());

const whitelist = ['http://localhost:8080'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido'));
    }
  },
}
app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>My Store</h1>');
});

app.get('/about', (req, res) => {
  res.send('<h1>About</h1>');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`);
});

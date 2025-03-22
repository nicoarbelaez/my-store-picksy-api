import express from 'express';
import routerApi from './routes/index.router.js';
import { errorHandler, logErrors } from './middlewares/error.handler.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>My Store</h1>');
});

app.get('/about', (req, res) => {
  res.send('<h1>About</h1>');
});

routerApi(app);

app.use(logErrors);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`);
});

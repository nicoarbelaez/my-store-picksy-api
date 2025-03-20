import express from 'express';
import routerApi from './routes/index.router.js';

const app = express();
const PORT = 3000;

app.get('/about', (req, res) => {
  res.send('<h1>My Store</h1>');
});

routerApi(app);

app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`);
});

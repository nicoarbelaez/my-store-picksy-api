import express from 'express';
import routerProducts from './products.router.js';

const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', routerProducts);
};

export default routerApi;

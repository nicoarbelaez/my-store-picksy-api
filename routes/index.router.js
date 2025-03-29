import express from 'express';
import routerProducts from './products.router.js';
import routerUsers from './users.router.js';
import routerCustomers from './customer.router.js';
import routerCategories from './category.router.js';

const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', routerProducts);
  router.use('/users', routerUsers);
  router.use('/customers', routerCustomers);
  router.use('/categories', routerCategories);
};

export default routerApi;

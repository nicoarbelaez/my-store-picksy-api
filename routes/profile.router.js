import express from 'express';
import UserService from '../services/user.service.js';
import OrderService from '../services/order.service.js';
import { passportMiddleware } from '../utils/auth/index.js';

const router = express.Router();
const userService = new UserService();
const orderService = new OrderService();

router.get(
  '/me',
  passportMiddleware.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const user = await userService.findOne(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/my-orders',
  passportMiddleware.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const orders = await orderService.findByUser(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },
);

export default router;

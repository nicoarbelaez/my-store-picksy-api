import express from 'express';
import OrderService from '../services/order.service.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import {
  getOrderSchema,
  createOrderSchema,
  updateOrderSchema,
} from '../schemas/order.schema.js';

const router = express.Router();
const service = new OrderService();

router.get('/', async (req, res, next) => {
  try {
    const orders = await service.find(req.query);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getOrderSchema, 'params'),
  async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id, 10);
      const order = await service.findOne(orderId);

      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  validatorHandler(createOrderSchema, 'body'),
  async (req, res, next) => {
    try {
      const newOrder = await service.create(req.body);

      res.status(201).json({
        status: 201,
        message: 'Order created successfully',
        order: newOrder,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  '/:id',
  validatorHandler(getOrderSchema, 'params'),
  validatorHandler(updateOrderSchema, 'body'),
  async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id, 10);
      const updatedOrder = await service.update(orderId, req.body);

      res.status(200).json({
        status: 200,
        message: 'Order updated successfully',
        order: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  validatorHandler(getOrderSchema, 'params'),
  validatorHandler(updateOrderSchema, 'body'),
  async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id, 10);
      const updatedOrder = await service.updatePartial(orderId, req.body);

      res.status(200).json({
        status: 200,
        message: 'Order partially updated successfully',
        order: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validatorHandler(getOrderSchema, 'params'),
  async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id, 10);
      const { id } = await service.delete(orderId);

      res.status(200).json({
        status: 200,
        message: 'Order deleted successfully',
        id,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

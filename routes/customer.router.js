import express from 'express';
import CustomerService from '../services/customer.service.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import {
  createCustomerSchema,
  getCustomerSchema,
  updateCustomerSchema,
} from '../schemas/customer.schemas.js';

const router = express.Router();
const service = new CustomerService();

router.get('/', async (req, res) => {
  res.json(await service.find());
});

router.get(
  '/:id',
  validatorHandler(getCustomerSchema, 'params'),
  async (req, res, next) => {
    try {
      const customer = await service.findOne(req.params.id);

      res.json(customer);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  validatorHandler(createCustomerSchema, 'body'),
  async (req, res) => {
    const newCustomer = await service.create(req.body);
    res.status(201).json({
      status: 201,
      message: 'Customer created successfully',
      customer: newCustomer,
    });
  },
);

router.put(
  '/:id',
  validatorHandler(getCustomerSchema, 'params'),
  validatorHandler(updateCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const customer = await service.update(req.params.id, req.body);

      res.status(200).json({
        status: 200,
        message: 'Customer update successfully',
        customer: customer,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  validatorHandler(getCustomerSchema, 'params'),
  validatorHandler(updateCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const customer = await service.updatePartial(req.params.id, req.body);

      res.status(200).json({
        status: 200,
        message: 'Customer update successfully',
        customer: customer,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validatorHandler(getCustomerSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = await service.delete(req.params.id);

      res.status(200).json({
        status: 200,
        message: 'Customer delete successfully',
        id,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

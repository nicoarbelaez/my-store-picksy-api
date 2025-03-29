import Joi from 'joi';

const id = Joi.number().integer().positive();
const customerId = Joi.number().integer().positive();
const createdAt = Joi.date().timestamp();
const status = Joi.string().valid('pending', 'completed', 'cancelled');

export const getOrderSchema = Joi.object({
  id: id.required(),
});

export const createOrderSchema = Joi.object({
  customerId: customerId.required(),
  createdAt,
  status,
});

export const updateOrderSchema = Joi.object({
  customerId,
  createdAt,
  status,
});

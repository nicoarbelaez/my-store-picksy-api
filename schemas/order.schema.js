import Joi from 'joi';

const id = Joi.number().integer().positive();
const customerId = Joi.string().uuid();
const createdAt = Joi.date().timestamp();
const status = Joi.string().valid('pending', 'completed', 'cancelled');
const orderId = Joi.number().integer().positive();
const productId = Joi.number().integer().positive();
const amount = Joi.number().integer().positive().min(1);

export const getOrderSchema = Joi.object({
  id: id.required(),
});

export const createOrderSchema = Joi.object({
  customerId,
  createdAt,
  status,
});

export const updateOrderSchema = Joi.object({
  customerId,
  createdAt,
  status,
});

export const addItemSchema = Joi.object({
  orderId: orderId.required(),
  productId: productId.required(),
  amount: amount.required(),
});

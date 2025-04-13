import Joi from 'joi';
import { createUserSchema } from './user.schemas.js';

const id = Joi.number().integer().positive();
const name = Joi.string().min(3).max(30);
const lastName = Joi.string().min(3).max(30);
const phone = Joi.string().min(10).max(14);
const createdAt = Joi.date().timestamp();
const userId = Joi.string().uuid();

export const createCustomerSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  phone: phone.required(),
  userId,
  user: createUserSchema,
});

export const updateCustomerSchema = Joi.object({
  name,
  lastName,
  phone,
  createdAt,
  userId,
});

export const getCustomerSchema = Joi.object({
  id: id.required(),
});

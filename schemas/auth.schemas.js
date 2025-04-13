import Joi from 'joi';
import { email, password } from './user.schemas.js';

export const token = Joi.string()
  .min(30) // Longitud mínima típica para JWT
  .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);

export const loginAuthSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

export const recoveryAuthSchema = Joi.object({
  email: email.required(),
});

export const changePasswordAuthSchema = Joi.object({
  token: token.required(),
  password: password.required(),
});

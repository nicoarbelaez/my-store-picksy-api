import Joi from 'joi';

const id = Joi.string().uuid();
const email = Joi.string().min(3).max(30);
const password = Joi.string().min(8).max(30);
const role = Joi.string().min(5);

export const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  role: role.required(),
});

export const updateUserSchema = Joi.object({
  email,
  role,
});

export const getUserSchema = Joi.object({
  id: id.required(),
});

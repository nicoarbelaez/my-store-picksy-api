import Joi from 'joi';

const id = Joi.string().uuid();
const email = Joi.string().min(3).max(30);
const phone = Joi.string().length(12);
const password = Joi.string().min(8).max(30);
const firstName = Joi.string().min(3).max(30);
const lastname = Joi.string().min(3).max(30);
const image = Joi.string().uri();
const rol = Joi.string().min(5);
const isBlock = Joi.boolean();

export const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  phone,
  firstName: firstName.required(),
  lastname: lastname.required(),
  image,
  // rol: rol.required(),
  isBlock,
});

export const updateUserSchema = Joi.object({
  firstName,
  email,
  phone,
  lastname,
  image,
  // rol,
  isBlock,
});

export const getUserSchema = Joi.object({
  id: id.required(),
});

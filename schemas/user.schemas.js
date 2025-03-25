import Joi from 'joi';

const id = Joi.string().uuid();
const email = Joi.string().min(3).max(30);
const phone = Joi.string().length(12);
const firstName = Joi.string().min(3).max(30);
const lastname = Joi.string().min(3).max(30);
const image = Joi.string().uri();
const isBlock = Joi.boolean();

export const createUserSchema = Joi.object({
  email: email.required(),
  phone,
  firstName: firstName.required(),
  lastname: lastname.required(),
  image,
  isBlock,
});

export const updateUserSchema = Joi.object({
  id,
  firstName,
  email,
  phone,
  lastname,
  image,
  isBlock,
});

export const getUserSchema = Joi.object({
  id: id.required(),
});

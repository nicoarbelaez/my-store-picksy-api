import Joi from 'joi';

const id = Joi.number().integer().positive();
const name = Joi.string().min(3).max(30);
const image = Joi.string().uri();
const price = Joi.number().positive();
const description = Joi.string().min(10).max(250);
const categoryId = Joi.number().integer().positive();
const stock = Joi.number().integer().min(0).max(100);
const rating = Joi.number().min(1).max(5).precision(1);
const isBlock = Joi.boolean();

export const createProductSchema = Joi.object({
  name: name.required(),
  image: image.required(),
  price: price.required(),
  description: description.required(),
  categoryId: categoryId.required(),
  stock,
  isBlock,
});

export const updateProductSchema = Joi.object({
  name,
  image,
  price,
  description,
  categoryId,
  stock,
  rating,
  isBlock,
});

export const getProductSchema = Joi.object({
  id: id.required(),
});

export const querySchema = Joi.object({
  page: Joi.number().integer().positive(),
  size: Joi.number().integer().positive(),
});

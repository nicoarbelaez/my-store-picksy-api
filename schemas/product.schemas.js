import Joi from 'joi';

const id = Joi.number().integer().positive();
const name = Joi.string().min(3).max(30);
const image = Joi.string().uri();
const price = Joi.number().positive();
const description = Joi.string().min(10).max(250);
const categoryId = Joi.number().integer().positive();
const stock = Joi.number().integer().min(0).max(100);
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
  isBlock,
});

export const getProductSchema = Joi.object({
  id: id.required(),
});

export const querySchema = Joi.object({
  page: Joi.number().integer().positive(),
  size: Joi.number().integer().positive(),
  order: Joi.string().valid('asc', 'desc'),
  sort: Joi.string().valid('name', 'price', 'stock'),
  minPrice: Joi.number().positive(),
  maxPrice: Joi.number().positive(),
  search: Joi.string().min(3),
})
  .rename('minPrice', 'min_price', { ignoreUndefined: true })
  .rename('maxPrice', 'max_price', { ignoreUndefined: true });

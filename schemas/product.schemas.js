import Joi from 'joi';

const id = Joi.number().integer().positive();
const name = Joi.string().min(3).max(30);
const price = Joi.number().positive();
const description = Joi.string().min(10).max(250);
const categoryId = Joi.number().integer().positive();
const stock = Joi.number().integer().min(0).max(100);
const discount = Joi.number().integer().min(0).max(100);
const characteristics = Joi.array().items(Joi.string());
const enabled = Joi.boolean();
const created_at = Joi.date();
const updated_at = Joi.date();

export const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  description: description.required(),
  categoryId: categoryId.required(),
  stock,
  discount,
  characteristics,
  enabled,
  created_at,
  updated_at,
});

export const updateProductSchema = Joi.object({
  name,
  price,
  description,
  categoryId,
  stock,
  discount,
  characteristics,
  enabled,
  created_at,
  updated_at,
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

export const productResponseSchema = Joi.object({
  id: id.required(),
  name: name.required(),
  price: price.required(),
  description: description.required(),
  categoryId: categoryId.required(),
  stock: stock.required(),
  discount: discount.required(),
  characteristics: characteristics.required(),
  enabled: enabled.required(),
  created_at: created_at.required(),
  updated_at: updated_at.required(),
});

import Joi from 'joi';

// id: i + 1,
// name: faker.commerce.productName(),
// image: faker.image.url(),
// price: parseFloat(faker.commerce.price()),
// description: faker.commerce.productDescription(),
// category: faker.commerce.department(),
// stock: faker.number.int({ min: 0, max: 100 }),
// rating: parseFloat(
//   faker.number.float({ min: 1, max: 5, precision: 0.1 }).toFixed(1),
// ),
// isBlock: faker.datatype.boolean(),

const id = Joi.number().integer().positive();
const name = Joi.string().min(3).max(30);
const image = Joi.string().uri();
const price = Joi.number().positive();
const description = Joi.string().min(10).max(250);
const category = Joi.string().min(3).max(30);
const stock = Joi.number().integer().min(0).max(100);
const rating = Joi.number().min(1).max(5).precision(1);
const isBlock = Joi.boolean();

export const createProductSchema = Joi.object({
  name: name.required(),
  image: image.required(),
  price: price.required(),
  description: description.required(),
  category: category.required(),
  stock,
  isBlock,
});

export const updateProductSchema = Joi.object({
  name,
  image,
  price,
  description,
  category,
  stock,
  rating,
  isBlock,
});

export const getProductSchema = Joi.object({
  id: id.required(),
});

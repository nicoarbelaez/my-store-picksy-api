import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';

export default class ProductService {
  constructor() {}

  async create(newProduct) {
    const existingProduct = await models.Product.findOne({
      where: { email: newProduct.email },
    });
    if (existingProduct) {
      throw boom.conflict('Product already exists');
    }

    const newProductCreate = await models.Product.create(newProduct);
    return newProductCreate;
  }

  async find({
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    limit,
    offset,
  }) {
    const data = await models.Product.findAll();
    return data;
  }

  async findOne(productId) {
    const product = await models.Product.findByPk(productId);
    if (!product) {
      throw boom.notFound('Product not found');
    }
    return product;
  }

  async update(productId, newProduct) {
    const product = await models.Product.findByPk(productId);
    if (!product) {
      throw boom.notFound('Product not found');
    }

    const updateProduct = await models.Product.update(newProduct, {
      where: { id: productId },
      returning: true,
    });
    return updateProduct;
  }

  async updatePartial(productId, newProduct) {
    return this.update(productId, newProduct);
  }

  async delete(productId) {
    const product = await models.Product.findByPk(productId);
    if (!product) {
      throw boom.notFound('Product not found');
    }

    await product.destroy(product);
    return { id: productId };
  }
}

import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';
import { response } from 'express';

export default class ProductService {
  constructor() {}

  async create(newProduct) {
    const existingCategory = await models.Category.findByPk(
      newProduct.categoryId,
    );
    if (!existingCategory) {
      throw boom.notFound(
        `Category not found with id: ${newProduct.categoryId}`,
      );
    }

    const newProductCreate = await models.Product.create(newProduct);
    newProductCreate.dataValues.category = existingCategory;
    return newProductCreate;
  }

  async find({ page = 1, size = 10 }) {
    const totalElements = await models.Product.count();
    const totalPages = Math.ceil(totalElements / size);
    size = size > totalElements ? totalElements : size;
    page = page > totalPages ? totalPages : page;

    const offset = (page - 1) * size;
    const limit = size;
    const options = {
      include: ['category'],
      offset,
      limit,
    };

    const products = await models.Product.findAll(options);
    const response = {
      content: products,
      page,
      size,
      totalElements,
      totalPages,
    };
    return response;
  }

  async findOne(productId) {
    const product = await models.Product.findByPk(productId, {
      include: ['category'],
    });
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

    const existingCategory = await models.Category.findByPk(
      newProduct.categoryId,
    );
    if (!existingCategory) {
      throw boom.notFound(
        `Category not found with id: ${newProduct.categoryId}`,
      );
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

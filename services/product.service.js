import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';
import { Op } from 'sequelize';

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

  async find({
    page = 1,
    size = 10,
    order = 'asc',
    sort,
    min_price,
    max_price,
    search,
  }) {
    const conditions = [];

    if (min_price !== undefined) {
      conditions.push({ price: { [Op.gte]: min_price } });
    }
    if (max_price !== undefined) {
      conditions.push({ price: { [Op.lte]: max_price } });
    }

    if (search) {
      conditions.push({
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    const where = conditions.length > 0 ? { [Op.and]: conditions } : {};

    const options = {
      include: ['category'],
      where,
    };

    if (sort) {
      options.order = [[sort, order.toUpperCase()]];
    }

    const totalElements = await models.Product.count({ where });
    const totalPages = Math.ceil(totalElements / size);
    size = Math.min(size, totalElements);
    page = Math.min(page, totalPages) || 1;

    const offset = (page - 1) * size;
    options.offset = offset;
    options.limit = size;

    const products = await models.Product.findAll(options);

    return {
      content: products,
      page,
      size,
      totalElements,
      totalPages,
    };
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

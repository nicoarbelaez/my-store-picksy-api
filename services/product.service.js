import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';
import { Op } from 'sequelize';
import {
  deleteImagesForProduct,
  createImagesForProduct,
} from './product-image.service.js';

export default class ProductService {
  constructor() {}

  async create(newProduct, newProductImages) {
    const existingCategory = await models.Category.findByPk(
      newProduct.categoryId,
    );
    if (!existingCategory) {
      throw boom.notFound(
        `Category not found with id: ${newProduct.categoryId}`,
      );
    }

    const createdProduct = await models.Product.create(newProduct);
    const { categoryId, ...product } = createdProduct.toJSON();

    const createdImages =
      newProductImages && newProductImages.length > 0
        ? await createImagesForProduct(product.id, newProductImages)
        : [];

    const response = {
      ...product,
      images: createdImages.map((img) => {
        const { productId, ...image } = img.toJSON();
        return image;
      }),
      category: existingCategory.toJSON(),
    };

    return response;
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
      attributes: { exclude: ['categoryId'] },
      include: [
        'category',
        {
          association: 'images',
          attributes: { exclude: ['productId'] },
        },
      ],
      where,
    };

    if (sort) {
      options.order = [[sort, order.toUpperCase()]];
    }

    const totalElements = await models.Product.count({ where });
    const totalPages = Math.ceil(totalElements / size);
    size = Math.min(size, totalElements);
    page = Math.min(page, totalPages) || 1;
    options.offset = (page - 1) * size;
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
      attributes: { exclude: ['categoryId'] },
      include: [
        'category',
        {
          association: 'images',
          attributes: { exclude: ['productId'] },
        },
      ],
    });
    if (!product) {
      throw boom.notFound('Product not found');
    }
    return product;
  }

  async update(productId, newProduct, newProductImages) {
    const { imagesToRemove, ...productData } = newProduct;

    const product = await models.Product.findByPk(productId);
    if (!product) {
      throw boom.notFound('Product not found');
    }

    if (productData.categoryId) {
      const existingCategory = await models.Category.findByPk(
        productData.categoryId,
      );
      if (!existingCategory) {
        throw boom.notFound(
          `Category not found with id: ${productData.categoryId}`,
        );
      }
    }

    if (imagesToRemove && imagesToRemove.length > 0) {
      await deleteImagesForProduct(productId, imagesToRemove);
    }

    const [updateCount] = await models.Product.update(productData, {
      where: { id: productId },
      returning: true,
    });

    if (updateCount === 0) {
      throw boom.badRequest('Product update failed.');
    }

    let createdImages = [];
    if (newProductImages && newProductImages.length > 0) {
      createdImages = await createImagesForProduct(productId, newProductImages);
    }

    const updatedProduct = await models.Product.findByPk(productId, {
      attributes: { exclude: ['categoryId'] },
      include: [
        'category',
        {
          association: 'images',
          attributes: { exclude: ['productId'] },
        },
      ],
    });

    return updatedProduct;
  }

  async updatePartial(productId, newProduct, newProductImages) {
    return await this.update(productId, newProduct, newProductImages);
  }

  async delete(productId) {
    const product = await models.Product.findByPk(productId);
    if (!product) {
      throw boom.notFound('Product not found');
    }
    await product.destroy();
    return { id: productId };
  }
}

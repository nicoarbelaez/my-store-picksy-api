import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';
import { Op } from 'sequelize';
import {
  deleteImagesForProduct,
  createImagesForProduct,
  validateMaxImages,
  validateCoverImage,
  updateCoverImage,
  unsetCurrentCoverImage,
} from './product-image.service.js';

export default class ProductService {
  constructor() {}

  async validateCategory(categoryId) {
    const category = await models.Category.findByPk(categoryId);
    if (!category) {
      throw boom.notFound(`Category not found with id: ${categoryId}`);
    }
    return category;
  }

  prepareImages(images, coverImageIndex) {
    return images.map((file, index) => ({
      ...file,
      isCover: index === Number(coverImageIndex),
    }));
  }

  async create(newProduct, newProductImages) {
    const { categoryId, coverImageIndex, ...productData } = newProduct;
    await this.validateCategory(categoryId);

    if (newProductImages?.length > 0) {
      if (coverImageIndex === undefined) {
        throw boom.badRequest(`The field "coverImageIndex" is required.`);
      }
      if (coverImageIndex >= newProductImages.length) {
        throw boom.badRequest(
          `The field "coverImageIndex" must be less than the number of images.`,
        );
      }
    }

    const createdProduct = await models.Product.create(productData);
    const preparedImages = this.prepareImages(
      newProductImages || [],
      coverImageIndex,
    );

    const createdImages =
      preparedImages.length > 0
        ? await createImagesForProduct(createdProduct.id, preparedImages)
        : [];

    return {
      ...createdProduct.toJSON(),
      images: createdImages.map((img) => {
        const { productId, ...image } = img.toJSON();
        return image;
      }),
    };
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
    const { imagesToRemove, coverImageId, coverImageIndex, ...productData } =
      newProduct;

    const product = await models.Product.findByPk(productId);
    if (!product) {
      throw boom.notFound('Product not found');
    }

    if (productData.categoryId) {
      await this.validateCategory(productData.categoryId);
    }

    // Validar si se van a eliminar imágenes
    if (imagesToRemove?.length > 0) {
      const imagesToDelete = await models.ProductImage.findAll({
        where: {
          id: { [Op.in]: imagesToRemove },
          isCover: true,
          productId,
        },
      });

      const hasCoverImageToRemove = imagesToDelete > 0;

      // Validar si se elimina la imagen de portada
      if (hasCoverImageToRemove) {
        if (!(coverImageId || coverImageIndex)) {
          throw boom.badRequest(
            `Cannot remove a cover image without providing a replacement. Please specify either "coverImageId" or "coverImageIndex" to set a new cover image.`,
          );
        }

        // Validar coverImageIndex si se proporciona
        if (
          coverImageIndex &&
          (!newProductImages || coverImageIndex >= newProductImages.length)
        ) {
          throw boom.badRequest(
            `The field "coverImageIndex" must be less than the number of new images.`,
          );
        }

        // Validar coverImageId si se proporciona
        if (coverImageId) {
          await validateCoverImage(productId, coverImageId);
        }
      }

      await deleteImagesForProduct(productId, imagesToRemove);
    }

    // Validar y crear nuevas imágenes si se proporcionan
    if (newProductImages?.length > 0) {
      await validateMaxImages(productId, newProductImages.length);
      await unsetCurrentCoverImage(productId);

      const preparedImages = this.prepareImages(
        newProductImages,
        coverImageIndex,
      );
      await createImagesForProduct(productId, preparedImages);
    }

    const [updateCount] = await models.Product.update(productData, {
      where: { id: productId },
      returning: true,
    });

    if (updateCount === 0) {
      throw boom.badRequest('Product update failed.');
    }

    // Actualizar la imagen de portada si es necesario
    if (coverImageId) {
      await updateCoverImage(productId, coverImageId);
    }

    return this.findOne(productId);
  }

  async updatePartial(productId, newProduct, newProductImages) {
    return await this.update(productId, newProduct, newProductImages);
  }

  async delete(productId) {
    const product = await models.Product.findByPk(productId, {
      attributes: ['id'],
      include: [
        {
          association: 'images',
          attributes: ['id'],
        },
      ],
    });
    if (!product) {
      throw boom.notFound('Product not found');
    }

    await deleteImagesForProduct(
      productId,
      product.images.map((img) => img.id),
    );
    await product.destroy();
    return { id: productId };
  }
}

import { Op } from 'sequelize';
import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';
import {
  deleteImageFromImgur,
  uploadImageToImgur,
} from '../utils/uploadToImgur.js';
import { MAX_IMAGE_PER_PRODUCT } from '../utils/consts.js';

export const validateImagesBelongToProduct = async (productId, imageIds) => {
  const images = await models.ProductImage.findAll({
    where: {
      id: { [Op.in]: imageIds },
      productId,
    },
  });

  if (images.length !== imageIds.length) {
    const invalidIds = imageIds.filter(
      (id) => !images.some((image) => image.id === id),
    );
    throw boom.badRequest(
      `Some images do not belong to this product. Invalid image IDs: ${invalidIds.join(', ')}`,
    );
  }

  return images;
};

export const validateCoverImage = async (productId, coverImageId) => {
  const coverImage = await models.ProductImage.findOne({
    where: {
      id: coverImageId,
      productId,
    },
  });

  if (!coverImage) {
    throw boom.badRequest(
      `The specified cover image does not belong to this product.`,
    );
  }
};

export const validateMaxImages = async (productId, additionalImages) => {
  const currentImageCount = await models.ProductImage.count({
    where: { productId },
  });

  if (currentImageCount + additionalImages > MAX_IMAGE_PER_PRODUCT) {
    throw boom.badRequest(
      `A product cannot have more than ${MAX_IMAGE_PER_PRODUCT} images.`,
    );
  }
};

export const deleteImagesForProduct = async (productId, imagesToRemove) => {
  const images = await validateImagesBelongToProduct(productId, imagesToRemove);

  const deletedCount = await models.ProductImage.destroy({
    where: {
      id: { [Op.in]: imagesToRemove },
      productId,
    },
  });

  if (deletedCount !== imagesToRemove.length) {
    throw boom.badRequest('Not all specified images could be deleted.');
  }

  try {
    await Promise.all(
      images.map((image) => deleteImageFromImgur(image.deletehash)),
    );
  } catch (error) {
    throw boom.badRequest(
      `There was a problem deleting the images: ${error.message}`,
    );
  }

  return deletedCount;
};

export const createImagesForProduct = async (productId, newProductImages) => {
  try {
    const imgurResponses = await Promise.all(
      newProductImages.map((file) => uploadImageToImgur(file.buffer)),
    );

    const consolidatedImages = imgurResponses.map((imgurData, index) => {
      const fileData = newProductImages[index];
      return {
        imgurId: imgurData.id,
        deletehash: imgurData.deletehash,
        mimetype: imgurData.type,
        width: imgurData.width,
        height: imgurData.height,
        size: imgurData.size,
        link: imgurData.link,
        datetime: imgurData.datetime,
        originalname: fileData.originalname,
        isCover: fileData.isCover || false,
        productId,
      };
    });

    const createdImages = await models.ProductImage.bulkCreate(
      consolidatedImages,
      { individualHooks: true },
    );
    return createdImages;
  } catch (error) {
    throw boom.badRequest(
      `There was a problem uploading the images: ${error.message}`,
    );
  }
};

export const unsetCurrentCoverImage = async (productId) => {
  await models.ProductImage.update(
    { isCover: false },
    {
      where: {
        productId,
        isCover: true,
      },
    },
  );
};

export const setNewCoverImage = async (productId, coverImageId) => {
  await models.ProductImage.update(
    { isCover: true },
    {
      where: {
        id: coverImageId,
        productId,
      },
    },
  );
};

export const updateCoverImage = async (productId, coverImageId) => {
  await unsetCurrentCoverImage(productId);
  await setNewCoverImage(productId, coverImageId);
};

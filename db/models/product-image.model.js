import { DataTypes, Model } from 'sequelize';
import { PRODUCT_TABLE } from './product.model.js';
import { MAX_IMAGE_PER_PRODUCT } from '../../utils/consts.js';

export const PRODUCT_IMAGE_TABLE = 'product_images';

export const ProductImageSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  imgurId: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'imgur_id',
  },
  deletehash: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  mimetype: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  width: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  height: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  size: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  link: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  datetime: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  originalname: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  productId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'product_id',
    references: {
      model: PRODUCT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  isCover: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_cover',
  },
};

export class ProductImage extends Model {
  static modelName = 'ProductImage';

  static associate(models) {
    this.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' });
  }

  static async validateMaxImages(productImage, sequelize) {
    const { ProductImage } = sequelize.models;
    const imageCount = await ProductImage.count({
      where: { productId: productImage.productId },
    });
    if (imageCount >= MAX_IMAGE_PER_PRODUCT) {
      throw new Error(
        `A product cannot have more than ${MAX_IMAGE_PER_PRODUCT} images.`,
      );
    }
  }

  static async validateSingleCoverImage(productImage, sequelize) {
    const { ProductImage } = sequelize.models;
    if (productImage.isCover === true) {
      const coverCount = await ProductImage.count({
        where: {
          productId: productImage.productId,
          isCover: true,
        },
      });
      if (coverCount > 0) {
        throw new Error('There is already a cover image for this product.');
      }
    }
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_IMAGE_TABLE,
      modelName: this.modelName,
      timestamps: false,
      hooks: {
        beforeCreate: async (productImage, options) => {
          await ProductImage.validateMaxImages(productImage, sequelize);
          await ProductImage.validateSingleCoverImage(productImage, sequelize);
        },
        beforeUpdate: async (productImage, options) => {
          await ProductImage.validateSingleCoverImage(productImage, sequelize);
        },
      },
    };
  }
}

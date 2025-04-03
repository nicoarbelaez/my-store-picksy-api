import { DataTypes, Model } from 'sequelize';
import { PRODUCT_TABLE } from './product.model.js';

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
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'product_id',
    references: {
      model: PRODUCT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
};

export class ProductImage extends Model {
  static modelName = 'ProductImage';

  static associate(models) {
    this.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_IMAGE_TABLE,
      modelName: this.modelName,
      timestamps: false,
      hooks: {
        beforeCreate: async (productImage, options) => {
          const { ProductImage } = sequelize.models;
          const imageCount = await ProductImage.count({
            where: { productId: productImage.productId },
          });
          if (imageCount >= 5) {
            throw new Error('A product cannot have more than 5 images.');
          }
        },
      },
    };
  }
}

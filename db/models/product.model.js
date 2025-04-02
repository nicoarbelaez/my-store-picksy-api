import { DataTypes, Model, Sequelize } from 'sequelize';
import { CATEGORY_TABLE } from './category.model.js';

export const PRODUCT_TABLE = 'products';

export const ProductSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  price: {
    allowNull: false,
    type: DataTypes.FLOAT,
  },
  description: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  categoryId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'category_id',
    references: {
      model: CATEGORY_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  stock: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  discount: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  characteristics: {
    allowNull: true,
    type: DataTypes.JSON,
  },
  enabled: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  },
};

export class Product extends Model {
  static modelName = 'Product';

  static associate(models) {
    this.hasMany(models.ProductImage, {
      as: 'images',
      foreignKey: 'productId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_TABLE,
      modelName: this.modelName,
      timestamps: false,
    };
  }
}

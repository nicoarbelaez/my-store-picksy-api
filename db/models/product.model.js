import { DataTypes, Model, Sequelize } from 'sequelize';

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
  image: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  price: {
    allowNull: false,
    type: DataTypes.FLOAT,
  },
  description: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  category: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  stock: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  },
};

export class Product extends Model {
  static modelName = 'Product';

  static associate() {
    // associate
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

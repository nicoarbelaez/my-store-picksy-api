import { DataTypes, Model, Sequelize } from 'sequelize';

export const CATEGORY_TABLE = 'categories';

export const CategorySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

export class Category extends Model {
  static modelName = 'Category';

  static associate(models) {
    this.hasMany(models.Product, { foreignKey: 'categoryId', as: 'products' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORY_TABLE,
      modelName: this.modelName,
      timestamps: false,
    };
  }
}

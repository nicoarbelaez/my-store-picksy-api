import { DataTypes, Sequelize, Model } from 'sequelize';
import { CUSTOMER_TABLE } from './customer.model.js';

export const ORDER_TABLE = 'orders';

export const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  customerId: {
    field: 'customer_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  status: {
    allowNull: true,
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  total: {
    type: DataTypes.VIRTUAL,
    get() {
      if (!this.items) {
        return 0;
      }
      if (this.items.length > 0) {
        return this.items.reduce((total, item) => {
          return total + item.price * item.OrderProduct.amount;
        }, 0);
      }
      return 0;
    },
  },
};

export class Order extends Model {
  static modelName = 'Order';

  static associate(models) {
    this.belongsTo(models.Customer, {
      as: 'customer',
    });
    this.belongsToMany(models.Product, {
      as: 'items',
      through: models.OrderProduct,
      foreignKey: 'orderId',
      otherKey: 'productId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: this.modelName,
      timestamps: false,
    };
  }
}

'use strict';

import { DataTypes, Sequelize } from 'sequelize';
import { ORDER_TABLE } from '../models/order.model.js';
import { ORDER_PRODUCT_TABLE } from '../models/order-producto.model.js';
import { CUSTOMER_TABLE } from '../models/customer.model.js';
import { PRODUCT_TABLE } from '../models/product.model.js';

export async function up(queryInterface) {
  await queryInterface.createTable(ORDER_TABLE, {
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
  });

  await queryInterface.createTable(ORDER_PRODUCT_TABLE, {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: Sequelize.NOW,
    },
    amount: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    orderId: {
      field: 'order_id',
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: ORDER_TABLE,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    productId: {
      field: 'product_id',
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: PRODUCT_TABLE,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable(ORDER_TABLE);
  await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
}

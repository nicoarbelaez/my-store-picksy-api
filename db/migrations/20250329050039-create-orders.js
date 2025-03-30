'use strict';

import { DataTypes, Sequelize } from 'sequelize';
import { ORDER_TABLE } from '../models/order.model.js';
import { CUSTOMER_TABLE } from '../models/customer.model.js';

/** @type {import('sequelize-cli').Migration} */
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
}

export async function down(queryInterface) {
  await queryInterface.dropTable(ORDER_TABLE);
}

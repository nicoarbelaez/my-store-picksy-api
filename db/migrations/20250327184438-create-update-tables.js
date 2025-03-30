'use strict';

import { DataTypes, Sequelize } from 'sequelize';
import { CATEGORY_TABLE } from '../models/category.model.js';
import { CUSTOMER_TABLE } from '../models/customer.model.js';
import { USER_TABLE } from '../models/user.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.createTable(CATEGORY_TABLE, {
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
  });
  await queryInterface.createTable(CUSTOMER_TABLE, {
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
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'last_name',
    },
    phone: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: Sequelize.NOW,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'user_id',
      references: {
        model: USER_TABLE,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable(CATEGORY_TABLE);
  await queryInterface.dropTable(CUSTOMER_TABLE);
}

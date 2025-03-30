'use strict';

import { DataTypes, Sequelize } from 'sequelize';
import { PRODUCT_TABLE } from '../models/product.model.js';
import { CATEGORY_TABLE } from '../models/category.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.createTable(PRODUCT_TABLE, {
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
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'create_at',
      defaultValue: Sequelize.NOW,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable(PRODUCT_TABLE);
}

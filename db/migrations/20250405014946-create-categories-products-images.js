'use strict';

import { DataTypes, Sequelize } from 'sequelize';
import { PRODUCT_TABLE } from '../models/product.model.js';
import { PRODUCT_IMAGE_TABLE } from '../models/product-image.model.js';
import { CATEGORY_TABLE } from '../models/category.model.js';

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
    price: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    categoryId: {
      allowNull: true,
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
  });
  await queryInterface.createTable(PRODUCT_IMAGE_TABLE, {
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
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable(PRODUCT_IMAGE_TABLE);
  await queryInterface.dropTable(PRODUCT_TABLE);
  await queryInterface.dropTable(CATEGORY_TABLE);
}

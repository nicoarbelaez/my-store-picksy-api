'use strict';

import { DataTypes, Sequelize } from 'sequelize';
import { PRODUCT_IMAGE_TABLE } from '../models/product-image.model.js';
import { PRODUCT_TABLE } from '../models/product.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
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
  });

  await queryInterface.removeColumn(PRODUCT_TABLE, 'image');

  await queryInterface.addColumn(PRODUCT_TABLE, 'discount', {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  });
  await queryInterface.addColumn(PRODUCT_TABLE, 'characteristics', {
    allowNull: true,
    type: DataTypes.JSON,
  });
  await queryInterface.addColumn(PRODUCT_TABLE, 'enabled', {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  });
  await queryInterface.addColumn(PRODUCT_TABLE, 'updatedAt', {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  });
  // Para evitar errores en la migración
  await queryInterface.sequelize.query(
    'UPDATE "products" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;',
  );
  await queryInterface.changeColumn(PRODUCT_TABLE, 'updatedAt', {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  });
  // ==================================

  await queryInterface.changeColumn(PRODUCT_TABLE, 'description', {
    allowNull: false,
    type: DataTypes.TEXT,
  });
  await queryInterface.changeColumn(PRODUCT_TABLE, 'createdAt', {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable(PRODUCT_IMAGE_TABLE);

  await queryInterface.addColumn(PRODUCT_TABLE, 'image', {
    allowNull: false,
    type: DataTypes.STRING,
  });

  await queryInterface.removeColumn(PRODUCT_TABLE, 'discount');
  await queryInterface.removeColumn(PRODUCT_TABLE, 'characteristics');
  await queryInterface.removeColumn(PRODUCT_TABLE, 'enabled');
  await queryInterface.removeColumn(PRODUCT_TABLE, 'updatedAt');

  await queryInterface.changeColumn(PRODUCT_TABLE, 'description', {
    allowNull: false,
    type: DataTypes.TEXT,
  });
  await queryInterface.changeColumn(PRODUCT_TABLE, 'createdAt', {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  });
}

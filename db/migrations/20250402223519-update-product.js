'use strict';

import { DataTypes, Sequelize } from 'sequelize';
import { PRODUCT_TABLE } from '../models/product.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn(PRODUCT_TABLE, 'updated_at', {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  });
  // Para evitar errores en la migración
  await queryInterface.sequelize.query(
    'UPDATE "products" SET "updated_at" = NOW() WHERE "updated_at" IS NULL;',
  );
  await queryInterface.changeColumn(PRODUCT_TABLE, 'updated_at', {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  });
  // ==================================
  await queryInterface.renameColumn(PRODUCT_TABLE, 'create_at', 'created_at');
}

export async function down(queryInterface) {
  await queryInterface.removeColumn(PRODUCT_TABLE, 'updated_at');
  await queryInterface.renameColumn(PRODUCT_TABLE, 'created_at', 'create_at');
}

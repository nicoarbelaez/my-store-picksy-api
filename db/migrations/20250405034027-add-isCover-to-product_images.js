'use strict';

import { DataTypes } from 'sequelize';
import { PRODUCT_IMAGE_TABLE } from '../models/product-image.model.js';

export async function up(queryInterface) {
  await queryInterface.addColumn(PRODUCT_IMAGE_TABLE, 'is_cover', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn(PRODUCT_IMAGE_TABLE, 'is_cover');
}

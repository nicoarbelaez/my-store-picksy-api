'use strict';

import { PRODUCT_TABLE, ProductSchema } from '../models/product.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.createTable(PRODUCT_TABLE, ProductSchema);
}

export async function down(queryInterface) {
  await queryInterface.dropTable(PRODUCT_TABLE);
}

'use strict';

import {
  ORDER_PRODUCT_TABLE,
  OrderProductSchema,
} from '../models/order-producto.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.createTable(ORDER_PRODUCT_TABLE, OrderProductSchema);
}

export async function down(queryInterface) {
  await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
}

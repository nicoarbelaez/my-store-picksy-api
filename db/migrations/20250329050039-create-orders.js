'use strict';

import { ORDER_TABLE, OrderSchema } from '../models/order.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.createTable(ORDER_TABLE, OrderSchema);
}

export async function down(queryInterface) {
  await queryInterface.dropTable(ORDER_TABLE);
}

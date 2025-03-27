'use strict';

import { USER_TABLE, UserSchema } from '../models/user.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.createTable(USER_TABLE, UserSchema);
}

export async function down(queryInterface) {
  await queryInterface.dropTable(USER_TABLE);
}

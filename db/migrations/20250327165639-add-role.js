'use strict';

import { USER_TABLE, UserSchema } from '../models/user.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn(USER_TABLE, 'role', UserSchema.role);
}

export async function down(queryInterface) {
  await queryInterface.removeColumn(USER_TABLE, 'role');
}

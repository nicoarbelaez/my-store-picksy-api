'use strict';

import { Sequelize } from 'sequelize';
import { USER_TABLE } from '../models/user.model.js';

export async function up(queryInterface) {
  await queryInterface.addColumn(USER_TABLE, 'recovery_token', {
    allowNull: true,
    type: Sequelize.STRING,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn(USER_TABLE, 'recovery_token');
}

'use strict';

import { DataTypes } from 'sequelize';
import { USER_TABLE } from '../models/user.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.addColumn(USER_TABLE, 'role', {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'customer',
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn(USER_TABLE, 'role');
}

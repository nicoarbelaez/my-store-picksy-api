'use strict';

import { DataTypes, Sequelize } from 'sequelize';
import { CUSTOMER_TABLE } from '../models/customer.model.js';
import { USER_TABLE } from '../models/user.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.changeColumn(CUSTOMER_TABLE, 'user_id', {
    allowNull: false,
    type: DataTypes.UUID,
    field: 'user_id',
    unique: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.changeColumn(CUSTOMER_TABLE, 'user_id', {
    allowNull: false,
    type: Sequelize.INTEGER,
    field: 'user_id',
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
}

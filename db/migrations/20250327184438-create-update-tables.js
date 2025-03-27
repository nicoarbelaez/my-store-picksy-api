'use strict';

import { CATEGORY_TABLE, CategorySchema } from '../models/category.model.js';
import { CUSTOMER_TABLE, CustomerSchema } from '../models/customer.model.js';
import { USER_TABLE, UserSchema } from '../models/user.model.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.createTable(CATEGORY_TABLE, CategorySchema);
  await queryInterface.createTable(CUSTOMER_TABLE, CustomerSchema);

  await queryInterface.removeColumn(USER_TABLE, 'phone');
  await queryInterface.removeColumn(USER_TABLE, 'firstName');
  await queryInterface.removeColumn(USER_TABLE, 'lastname');
  await queryInterface.removeColumn(USER_TABLE, 'image');
  await queryInterface.removeColumn(USER_TABLE, 'isBlock');

  await queryInterface.changeColumn(USER_TABLE, 'id', UserSchema.id);
  await queryInterface.changeColumn(USER_TABLE, 'email', UserSchema.email);
  await queryInterface.changeColumn(USER_TABLE, 'role', UserSchema.role);
}

export async function down(queryInterface) {
  await queryInterface.dropTable(CATEGORY_TABLE);
  await queryInterface.dropTable(CUSTOMER_TABLE);

  await queryInterface.addColumn(USER_TABLE, 'phone', {
    allowNull: true,
    type: DataTypes.STRING,
    validate: {
      len: [12, 12],
    },
  });
  await queryInterface.addColumn(USER_TABLE, 'firstName', {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      len: [3, 30],
    },
  });
  await queryInterface.addColumn(USER_TABLE, 'lastname', {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      len: [3, 30],
    },
  });
  await queryInterface.addColumn(USER_TABLE, 'image', {
    allowNull: true,
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  });
  await queryInterface.addColumn(USER_TABLE, 'is_block', {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  });

  await queryInterface.changeColumn(USER_TABLE, 'email', {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate: {
      len: [3, 30],
    },
  });
  await queryInterface.changeColumn(USER_TABLE, 'role', {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      len: [5, 50],
    },
    defaultValue: 'customer',
  });
}

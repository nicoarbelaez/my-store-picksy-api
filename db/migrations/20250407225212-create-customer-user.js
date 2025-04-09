'use strict';

import { DataTypes, Sequelize } from 'sequelize';
import { USER_TABLE } from '../models/user.model.js';
import { CUSTOMER_TABLE } from '../models/customer.model.js';

export async function up(queryInterface) {
  await queryInterface.createTable(USER_TABLE, {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'customer',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.createTable(CUSTOMER_TABLE, {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'last_name',
    },
    phone: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: Sequelize.NOW,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'user_id',
      unique: true,
      references: {
        model: USER_TABLE,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable(USER_TABLE);
  await queryInterface.dropTable(CUSTOMER_TABLE);
}

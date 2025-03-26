import { DataTypes, Model, Sequelize } from "sequelize";

export const USER_TABLE = 'users';

export const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
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
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  },
};

export class User extends Model {
  static modelName = 'User';

  static associate() {
    // associate
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: this.modelName,
      timestamps: false,
    };
  }
}

import { DataTypes, Model, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export const USER_TABLE = 'users';

export const UserSchema = {
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
    validate: {
      len: [3, 30],
    },
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  phone: {
    allowNull: true,
    type: DataTypes.STRING,
    validate: {
      len: [12, 12],
    },
  },
  firstName: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      len: [3, 30],
    },
  },
  lastname: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      len: [3, 30],
    },
  },
  image: {
    allowNull: true,
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
  // rol: {
  //   allowNull: false,
  //   type: DataTypes.STRING,
  //   validate: {
  //     len: [5, 50],
  //   },
  // },
  isBlock: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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

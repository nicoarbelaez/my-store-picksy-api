import boom from '@hapi/boom';
import bcrypt from 'bcryptjs';
import { models } from '../lib/sequelize.js';

export default class UserService {
  constructor() {}

  async create(newUser) {
    const existingUser = await models.User.findOne({
      where: { email: newUser.email },
    });
    if (existingUser) {
      throw boom.conflict('User already exists');
    }

    const password = await bcrypt.hash(newUser.password, 10);
    const newUserCreate = await models.User.create({ ...newUser, password });
    delete newUserCreate.dataValues.password;
    return newUserCreate;
  }

  async find() {
    const data = models.User.findAll({
      include: ['customer'],
      attributes: {
        exclude: ['password'],
      },
    });
    return data;
  }

  async findByEmail(email) {
    const data = models.User.findOne({
      where: { email },
      attributes: {
        exclude: ['recoveryToken'],
      },
    });
    return data;
  }

  comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  async findOne(userId) {
    const user = await models.User.findByPk(userId, {
      attributes: {
        exclude: ['password'],
      },
    });
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  }

  async update(userId, newUser) {
    const user = await models.User.findByPk(userId);
    if (!user) {
      throw boom.notFound('User not found');
    }

    const updateUser = await models.User.update(newUser, {
      where: { id: userId },
      returning: true,
    });
    return updateUser;
  }

  async updatePartial(userId, newUser) {
    return this.update(userId, newUser);
  }

  async delete(userId) {
    const user = await models.User.findByPk(userId);
    if (!user) {
      throw boom.notFound('User not found');
    }

    await user.destroy();
    return { id: userId };
  }
}

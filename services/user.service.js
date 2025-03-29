import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';

export default class UserService {
  constructor() {}

  static async create(newUser) {
    const existingUser = await models.User.findOne({
      where: { email: newUser.email },
    });
    if (existingUser) {
      throw boom.conflict('User already exists');
    }

    const newUserCreate = await models.User.create(newUser);
    return newUserCreate;
  }

  async find() {
    const data = models.User.findAll({
      include: ['customer'],
    });
    return data;
  }

  async findOne(userId) {
    const user = await models.User.findByPk(userId);
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

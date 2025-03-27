import { faker } from '@faker-js/faker';
import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';

export default class UserService {
  constructor() {
    this._users = this.#generateUsers(100);
  }

  get users() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this._users);
      }, 1000);
    });
  }

  #generateUsers(numUsers) {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
      users.push({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: 'international' }),
        firstName: faker.person.firstName(),
        lastname: faker.person.lastName(),
        image: faker.image.avatar(),
        isBlock: faker.datatype.boolean(),
      });
    }
    return users;
  }

  async create(newUser) {
    const existingUser = await models.User.findOne({
      where: { email: newUser.email },
    });
    if (existingUser) {
      throw boom.notFound('User already exists');
    }

    const newUserCreate = await models.User.create(newUser);
    return newUserCreate;
  }

  async find() {
    const data = models.User.findAll();
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

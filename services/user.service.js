import { faker } from '@faker-js/faker';
import boom from '@hapi/boom';

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
    newUser.id = faker.string.uuid();
    this._users.push(newUser);
    return newUser;
  }

  async find() {
    return this.users;
  }

  async findOne(userId) {
    const users = await this.users;
    const user = users.find((p) => p.id === userId);
    if (!user) {
      throw boom.notFound('User not found');
    }
    if (user.isBlock) {
      throw boom.conflict('User is blocked');
    }
    return user;
  }

  async update(userId, newUser) {
    const users = await this.users;
    const userIndex = users.findIndex((p) => p.id === userId);
    if (userIndex === -1) {
      throw boom.notFound('User not found');
    }

    this._users[userIndex] = {
      ...this._users[userIndex],
      ...newUser,
    };
    return this._users[userIndex];
  }

  async updatePartial(userId, newUser) {
    return this.update(userId, newUser);
  }

  async delete(userId) {
    const users = await this.users;
    const userIndex = users.findIndex((p) => p.id === userId);
    if (userIndex === -1) {
      throw boom.notFound('User not found');
    }
    this._users.splice(userIndex, 1);
    return { id: userId };
  }
}

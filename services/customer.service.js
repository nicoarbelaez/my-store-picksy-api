import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';

export default class UserService {
  constructor() {}

  async create(newCustomer) {
    const existingCustomer = await models.Customer.findOne({
      where: { userId: newCustomer.userId },
    });
    if (existingCustomer) {
      throw boom.conflict(
        `Customer already exists with userId: ${newCustomer.userId}`,
      );
    }

    const existingUser = await models.User.findByPk(newCustomer.userId);
    if (!existingUser) {
      throw boom.notFound(`User not found with id: ${newCustomer.userId}`);
    }

    const customer = await models.Customer.create(newCustomer);
    return customer;
  }

  async find() {
    const customers = models.Customer.findAll();
    return customers;
  }

  async findOne(customerId) {
    const customer = await models.Customer.findByPk(customerId);
    if (!customer) {
      throw boom.notFound('Customer not found');
    }
    return customer;
  }

  async update(customerId, newCustomer) {
    const customer = await models.Customer.findByPk(customerId);
    if (!customer) {
      throw boom.notFound('Customer not found');
    }

    const updateCustomer = await models.Customer.update(newCustomer, {
      where: { id: customerId },
      returning: true,
    });
    return updateCustomer;
  }

  async updatePartial(customerId, newCustomer) {
    return this.update(customerId, newCustomer);
  }

  async delete(customerId) {
    const customer = await models.Customer.findByPk(customerId);
    if (!customer) {
      throw boom.notFound('Customer not found');
    }

    await customer.destroy();
    return { id: customerId };
  }
}

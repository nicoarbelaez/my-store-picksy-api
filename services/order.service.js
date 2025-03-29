import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';

export default class OrderService {
  constructor() {}

  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async addItem(data) {
    const newItem = await models.OrderProduct.create(data);
    return newItem;
  }

  async find() {
    const orders = await models.Order.findAll({
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
        'items',
      ],
    });
    return orders;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
      ],
    });
    if (!order) {
      throw boom.notFound('Order not found');
    }
    return order;
  }

  async update(id, changes) {
    const order = await models.Order.findByPk(id);
    if (!order) {
      throw boom.notFound('Order not found');
    }

    const updatedOrder = await order.update(changes);
    return updatedOrder;
  }

  async delete(id) {
    const order = await models.Order.findByPk(id);
    if (!order) {
      throw boom.notFound('Order not found');
    }

    await order.destroy();
    return { id };
  }
}

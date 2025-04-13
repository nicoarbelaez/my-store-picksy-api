import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';

export default class OrderService {
  constructor() {}

  async create(data) {
    let newOrder = null;
    if (!data.userId && data.customerId) {
      try {
        newOrder = await models.Order.create(data);
      } catch (error) {
        throw boom.boomify(error);
      }
    } else {
      const customer = await models.Customer.findOne({
        include: [
          {
            association: 'user',
            where: { id: data.userId },
            required: true,
          },
        ],
      });

      if (!customer) {
        throw boom.notFound('Customer not found');
      }

      newOrder = await models.Order.create({
        customerId: customer.id,
      });
    }

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

  async findByUser(userId) {
    try {
      const orders = await models.Order.findAll({
        include: [
          {
            association: 'customer',
            required: true,
            where: { userId: userId },
          },
        ],
      });

      return orders;
    } catch (error) {
      throw boom.boomify(error);
    }
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

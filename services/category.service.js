import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';

export default class CategoryService {
  constructor() {}

  async create(newCategory) {
    const existingCategory = await models.Category.findOne({
      where: { name: newCategory.name },
    });
    if (existingCategory) {
      throw boom.conflict('Category already exists');
    }

    const newCategoryCreate = await models.Category.create(newCategory);
    return newCategoryCreate;
  }

  async find() {
    const data = await models.Category.findAll({
      include: ['products'],
    });
    return data;
  }

  async findOne(categoryId) {
    const category = await models.Category.findByPk(categoryId, {
      include: ['products'],
    });
    if (!category) {
      throw boom.notFound('Category not found');
    }
    return category;
  }

  async update(categoryId, newCategory) {
    const category = await models.Category.findByPk(categoryId);
    if (!category) {
      throw boom.notFound('Category not found');
    }

    const updatedCategory = await models.Category.update(newCategory, {
      where: { id: categoryId },
      returning: true,
    });
    return updatedCategory;
  }

  async updatePartial(categoryId, newCategory) {
    return this.update(categoryId, newCategory);
  }

  async delete(categoryId) {
    const category = await models.Category.findByPk(categoryId);
    if (!category) {
      throw boom.notFound('Category not found');
    }

    await category.destroy();
    return { id: categoryId };
  }
}

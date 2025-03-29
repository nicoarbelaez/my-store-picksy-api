import express from 'express';
import CategoryService from '../services/category.service.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from '../schemas/category.schemas.js';

const router = express.Router();
const service = new CategoryService();

router.get('/', async (req, res) => {
  res.json(await service.find(req.query));
});

router.get(
  '/:id',
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await service.findOne(categoryId);

      res.json(category);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const newCategory = await service.create(req.body);
      res.status(201).json({
        status: 201,
        message: 'Category created successfully',
        category: newCategory,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  '/:id',
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await service.update(categoryId, req.body);

      res.status(200).json({
        status: 200,
        message: 'Category updated successfully',
        category: category,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await service.updatePartial(categoryId, req.body);

      res.status(200).json({
        status: 200,
        message: 'Category updated successfully',
        category: category,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const { id } = await service.delete(categoryId);

      res.status(200).json({
        status: 200,
        message: 'Category deleted successfully',
        id,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

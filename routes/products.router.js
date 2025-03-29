import express from 'express';
import ProductService from '../services/product.service.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import {
  createProductSchema,
  getProductSchema,
  updateProductSchema,
} from '../schemas/product.schemas.js';

const router = express.Router();
const service = new ProductService();

router.get('/', async (req, res) => {
  res.json(await service.find(req.query));
});

router.get(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await service.findOne(productId);

      res.json(product);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const newProduct = await service.create(req.body);
      res.status(201).json({
        status: 201,
        message: 'Product created successfully',
        product: newProduct,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await service.update(productId, req.body);

      res.status(200).json({
        status: 200,
        message: 'Product update successfully',
        product: product,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await service.updatePartial(productId, req.body);

      res.status(200).json({
        status: 200,
        message: 'Product update successfully',
        product: product,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id, 10);
      const { id } = await service.delete(productId);

      res.status(200).json({
        status: 200,
        message: 'Product delete successfully',
        id,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

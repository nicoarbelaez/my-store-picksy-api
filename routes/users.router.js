import express from 'express';
import UserService from '../services/user.service.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from '../schemas/user.schemas.js';

const router = express.Router();
const service = new UserService();

router.get('/', async (req, res) => {
  res.json(await service.find());
});

router.get(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const user = await service.findOne(req.params.id);

      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const newUser = await service.create(req.body);
      res.status(201).json({
        status: 201,
        message: 'User created successfully',
        user: newUser,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const user = await service.update(req.params.id, req.body);

      res.status(200).json({
        status: 200,
        message: 'User update successfully',
        user: user,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const user = await service.updatePartial(req.params.id, req.body);

      res.status(200).json({
        status: 200,
        message: 'User update successfully',
        user: user,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = await service.delete(req.params.id);

      res.status(200).json({
        status: 200,
        message: 'User delete successfully',
        id,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

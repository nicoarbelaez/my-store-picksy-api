import express from 'express';
import { passportMiddleware } from '../utils/auth/index.js';
import AuthService from '../services/auth.service.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import {
  changePasswordAuthSchema,
  loginAuthSchema,
  recoveryAuthSchema,
} from '../schemas/auth.schemas.js';

const router = express.Router();
const authService = new AuthService();

router.post(
  '/login',
  validatorHandler(loginAuthSchema, 'body'),
  passportMiddleware.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const jwt = await authService.createSignToken(user);
      res.json({
        user: user,
        token: jwt,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/recovery',
  validatorHandler(recoveryAuthSchema, 'body'),
  async (req, res, next) => {
    const { email } = req.body;
    try {
      const result = await authService.sendRecoveryEmail(email);
      res.json({
        status: result.success ? 'success' : 'error',
        message: result.message,
        messageId: result.messageId,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/change-password',
  validatorHandler(changePasswordAuthSchema, 'body'),
  async (req, res, next) => {
    const { token, password } = req.body;
    try {
      const result = await authService.changePassword(token, password);
      res.json({
        token,
        password,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

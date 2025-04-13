import express from 'express';
import { passportMiddleware } from '../utils/auth/index.js';
import AuthService from '../services/auth.service.js';

const router = express.Router();
const authService = new AuthService();

router.post(
  '/login',
  passportMiddleware.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const jwt = await authService.createSingToken(user);
      res.json({
        user: user,
        token: jwt,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post('/recovery', async (req, res, next) => {
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
});

export default router;

import express from 'express';
import { passportMiddleware } from '../utils/auth/index.js';
import { signToken } from '../utils/auth/jwt.js';

const router = express.Router();

router.post(
  '/login',
  passportMiddleware.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const payload = {
        sub: user.id,
        role: user.role,
      };
      const jwt = signToken(payload);
      res.json({
        user: user,
        token: jwt,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

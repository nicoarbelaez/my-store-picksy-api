import express from 'express';
import { passportMiddleware } from '../utils/auth/index.js';

const router = express.Router();

router.post(
  '/login',
  passportMiddleware.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      res.json({
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

import express from 'express';
import { passportMiddleware } from '../utils/auth/index.js';
import { signToken } from '../utils/auth/jwt.js';
import UserService from '../services/user.service.js';
import boom from '@hapi/boom';
import { sendRecoveryEmail } from '../utils/mail.js';

const router = express.Router();
const userService = new UserService();

router.post(
  '/login',
  passportMiddleware.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const jwt = signToken(user);
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
    const user = await userService.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const token = signToken(user, { expiresIn: '10m' });

    await sendRecoveryEmail(email, token);

    res.json({
      message: 'Recovery email sent',
    });
  } catch (error) {
    next(error);
  }
});

export default router;

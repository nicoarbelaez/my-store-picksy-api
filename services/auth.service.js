import boom from '@hapi/boom';
import jwt from 'jsonwebtoken';
import { recoveryToken, signToken, verifyToken } from '../utils/auth/jwt.js';
import UserService from './user.service.js';
import { sendRecoveryEmail } from '../utils/mail.js';

const userService = new UserService();

export default class AuthService {
  constructor() {}

  async sendRecoveryEmail(email) {
    try {
      const user = await userService.findByEmail(email);
      if (!user) {
        throw boom.unauthorized('User not found');
      }

      const token = recoveryToken(user);
      await userService.update(user.id, {
        recoveryToken: token,
      });
      const emailResponse = await sendRecoveryEmail(email, token);

      return {
        success: true,
        message: 'Recovery email sent successfully',
        messageId: emailResponse.messageId,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      if (error.isBoom) throw error;
      throw boom.serverUnavailable('Error sending recovery email');
    }
  }

  async createSignToken(user) {
    return signToken(user);
  }

  async changePassword(token, password) {
    try {
      const { payload } = verifyToken(token);

      if (!payload.recovery || payload.scope !== 'password_reset') {
        throw boom.unauthorized('Invalid token type');
      }

      const userId = payload.sub;
      const user = await userService.findOne(userId);

      if (user.recoveryToken !== token) {
        throw boom.unauthorized('Token mismatch');
      }

      const hashedPassword = await userService.hashPassword(password);
      await userService.update(userId, {
        password: hashedPassword,
        recoveryToken: null,
      });

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw boom.unauthorized('Invalid token signature');
      }

      if (error.isBoom) {
        throw error;
      }

      throw boom.boomify(error, {
        message: 'Password change failed',
        statusCode: 500,
      });
    }
  }
}

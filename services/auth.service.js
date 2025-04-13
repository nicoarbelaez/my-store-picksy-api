import boom from '@hapi/boom';
import { recoveryToken, signToken } from '../utils/auth/jwt.js';
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
}

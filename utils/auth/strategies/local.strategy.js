import { Strategy } from 'passport-local';
import UserService from '../../../services/user.service.js';
import boom from '@hapi/boom';

const service = new UserService();

export const LocalStrategy = new Strategy(
  { usernameField: 'email', passwordField: 'password' },
  async (username, password, done) => {
    try {
      const user = await service.findByEmail(username);
      if (!user) {
        return done(boom.unauthorized(), false);
      }

      const isMatch = await service.comparePassword(password, user.password);
      if (!isMatch) {
        return done(boom.unauthorized(), false);
      }
      delete user.dataValues.password;
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);

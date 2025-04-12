import { Strategy, ExtractJwt } from 'passport-jwt';
import UserService from '../../../services/user.service.js';
import boom from '@hapi/boom';
import { config } from '../../../config/config.js';

const service = new UserService();
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

export const JwtStrategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await service.findOne(payload.sub);
    if (!user) {
      return done(boom.unauthorized(), false);
    }
    delete user.password;
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

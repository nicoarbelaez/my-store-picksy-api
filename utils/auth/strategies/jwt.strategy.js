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
  done(null, payload);
});

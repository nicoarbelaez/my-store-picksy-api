import { Strategy, ExtractJwt } from 'passport-jwt';
import { config } from '../../../config/config.js';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

export const JwtStrategy = new Strategy(options, async (payload, done) => {
  done(null, payload);
});

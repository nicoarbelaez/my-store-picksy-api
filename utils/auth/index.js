import passport from 'passport';
import { LocalStrategy } from './strategies/local.strategy.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

export const initializeAuth = () => {
  passport.use(LocalStrategy);
  passport.use(JwtStrategy);

  return passport.initialize();
};

export const passportMiddleware = passport;

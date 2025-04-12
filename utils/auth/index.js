import passport from 'passport';
import { LocalStrategy } from './strategies/local.strategy.js';

export const initializeAuth = () => {
  passport.use(LocalStrategy);

  return passport.initialize();
};

export const passportMiddleware = passport;

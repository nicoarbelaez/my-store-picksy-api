import boom from '@hapi/boom';
import { config } from '../config/config.js';

export const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (apiKey === config.apikey) {
    next();
  } else {
    next(boom.unauthorized('API key is invalid'));
  }
};

export const checkRoles =
  (...roles) =>
  (req, res, next) => {
    const user = req.user;
    if (!user) {
      return next(boom.notFound());
    }
    if (roles.includes(user.role)) {
      next();
    } else {
      next(boom.forbidden('You do not have permission to perform this action'));
    }
  };

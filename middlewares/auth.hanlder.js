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

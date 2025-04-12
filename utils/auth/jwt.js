import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';

export const signToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1m' });
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
};

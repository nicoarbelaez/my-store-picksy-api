import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';

export const signToken = (user, options = { expiresIn: '1h' }) => {
  const payload = {
    sub: user.id,
    role: user.role,
  };
  return jwt.sign(payload, config.jwtSecret, options);
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

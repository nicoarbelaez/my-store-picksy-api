import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import boom from '@hapi/boom';

export const createJwt = (payload, options = {}) => {
  if (!payload?.sub) {
    throw boom.badRequest('Subject (sub) is required in JWT payload');
  }

  try {
    return jwt.sign(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
      },
      config.jwtSecret,
      {
        algorithm: 'HS256',
        ...options,
      },
    );
  } catch (error) {
    throw boom.boomify(error, {
      message: 'JWT creation failed',
      statusCode: 500,
    });
  }
};

export const recoveryToken = (user, options) => {
  if (!user?.id) {
    throw boom.badRequest('Invalid user for recovery token');
  }

  const payload = {
    sub: user.id,
    recovery: true,
    scope: 'password_reset',
  };

  return createJwt(payload, {
    expiresIn: '15m',
    ...options,
  });
};

export const signToken = (user, options) => {
  if (!user?.id || !user?.role) {
    throw boom.badRequest('Invalid user for authentication token');
  }

  const payload = {
    sub: user.id,
    role: user.role,
    scope: 'access',
  };

  return createJwt(payload, {
    expiresIn: '1h',
    ...options,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
      complete: true,
    });
  } catch (error) {
    const boomError =
      error instanceof jwt.TokenExpiredError
        ? boom.unauthorized('Token expired')
        : boom.unauthorized('Invalid token');

    boomError.output.payload.code = error.name;
    throw boomError;
  }
};

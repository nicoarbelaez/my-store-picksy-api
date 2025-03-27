import { Sequelize } from 'sequelize';

export const logErrors = (err, req, res, next) => {
  console.error(`Error Log \t ${err.stack}`);
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    message: 'Something broke!',
    error: err.message,
    stack: err.stack,
  });
};

export const boomErrorHandler = (err, req, res, next) => {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
    return;
  }
  next(err);
};

export const sequelizeErrorHandler = (err, req, res, next) => {
  if (err instanceof Sequelize.ValidationError) {
    return res.status(400).json({
      message: err.errors.map((e) => e.message),
    });
  } else {
    next(err);
  }
};

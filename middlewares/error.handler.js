import multer from 'multer';
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

export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        res
          .status(400)
          .json({ message: 'File size exceeds the allowed limit.' });
        break;
      case 'LIMIT_FILE_COUNT':
        res.status(400).json({ message: 'Too many files uploaded.' });
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        res.status(400).json({ message: 'Unexpected field in the form.' });
        break;
      default:
        res.status(400).json({ message: `Multer error: ${err.message}` });
    }
  } else {
    next(err);
  }
};

const logErrors = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    message: 'Something broke!',
    error: err.message,
    stack: err.stack,
  });
};

export { logErrors, errorHandler };

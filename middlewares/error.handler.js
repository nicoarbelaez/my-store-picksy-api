const logErrors = (err, req, res, next) => {
  console.error(`Error Log \t ${err.stack}`);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    message: 'Something broke!',
    error: err.message,
    stack: err.stack,
  });
};

const boomErrorHandler = (err, req, res, next) => {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
    return;
  }
  next(err);
};

export { logErrors, errorHandler, boomErrorHandler };

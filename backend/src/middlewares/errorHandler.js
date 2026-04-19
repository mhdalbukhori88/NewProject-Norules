function notFoundHandler(req, _res, next) {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
    details: error.details || null,
  });
}

module.exports = { notFoundHandler, errorHandler };

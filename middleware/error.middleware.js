const { logger } = require("../utils/logger");

// Central error handling middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log error
  logger.error(`Error: ${err.message}, Stack: ${err.stack}`);

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { errorHandler };

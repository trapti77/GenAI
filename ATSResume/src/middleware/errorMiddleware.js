import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  // Log error
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Development vs Production error response
  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      success: false,
      error: message,
      stack: err.stack,
      details: err.details || null,
    });
  } else {
    // Production - don't leak error details
    res.status(statusCode).json({
      success: false,
      error: statusCode === 500 ? "Internal Server Error" : message,
    });
  }
};

export { errorMiddleware };

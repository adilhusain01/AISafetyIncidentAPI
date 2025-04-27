const winston = require("winston");
const config = require("../config/logger.config");

// Application logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "incident-log-api" },
  transports: [
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "./logs/app.log",
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
  exitOnError: false,
});

// HTTP request logger
const httpLogger = {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    },
  },
};

module.exports = { logger, httpLogger };

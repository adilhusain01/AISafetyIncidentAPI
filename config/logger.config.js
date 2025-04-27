module.exports = {
  file: {
    level: "info",
    filename: "./logs/app.log",
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: "combined",
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: "simple",
  },
};

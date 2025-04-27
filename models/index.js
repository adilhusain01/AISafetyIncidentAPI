const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const { logger } = require("../utils/logger");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  logging: (msg) => logger.debug(msg),
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.incidents = require("./incident.model")(sequelize, Sequelize);

module.exports = db;

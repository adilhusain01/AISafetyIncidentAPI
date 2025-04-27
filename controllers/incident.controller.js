const db = require("../models");
const { logger } = require("../utils/logger");
const Incident = db.incidents;
const Redis = require("redis");
const redisConfig = require("../config/redis.config");

let redisClient;

(async () => {
  try {
    redisClient = Redis.createClient({
      socket: {
        host: redisConfig.HOST,
        port: redisConfig.PORT,
      },
    });

    await redisClient.connect();
    logger.info("Redis client connected successfully");

    redisClient.on("error", (err) => {
      logger.error("Redis client error:", err);
    });
  } catch (err) {
    logger.error("Failed to connect to Redis:", err);
    redisClient = null;
  }
})();

exports.create = async (req, res, next) => {
  try {
    const incident = {
      title: req.body.title,
      description: req.body.description,
      severity: req.body.severity,
    };

    const data = await Incident.create(incident);

    if (redisClient) {
      await redisClient.del("all_incidents");
    }

    logger.info(`Created new incident with ID: ${data.id}`);
    res.status(201).json(data);
  } catch (err) {
    logger.error(`Error creating incident: ${err.message}`);
    next(err);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    let data;

    if (redisClient) {
      const cachedData = await redisClient.get("all_incidents");
      if (cachedData) {
        logger.info("Retrieved incidents from cache");
        return res.status(200).json(JSON.parse(cachedData));
      }
    }

    data = await Incident.findAll();

    if (redisClient) {
      await redisClient.setEx("all_incidents", 300, JSON.stringify(data));
    }

    logger.info("Retrieved all incidents");
    res.status(200).json(data);
  } catch (err) {
    logger.error(`Error retrieving incidents: ${err.message}`);
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  const id = req.params.id;

  try {
    let data;

    if (redisClient) {
      const cachedData = await redisClient.get(`incident_${id}`);
      if (cachedData) {
        logger.info(`Retrieved incident ${id} from cache`);
        return res.status(200).json(JSON.parse(cachedData));
      }
    }

    data = await Incident.findByPk(id);

    if (!data) {
      logger.warn(`Incident with id=${id} not found`);
      return res.status(404).json({
        status: "error",
        message: `Incident with id=${id} was not found`,
      });
    }

    if (redisClient) {
      await redisClient.setEx(`incident_${id}`, 300, JSON.stringify(data));
    }

    logger.info(`Retrieved incident with id=${id}`);
    res.status(200).json(data);
  } catch (err) {
    logger.error(`Error retrieving incident with id=${id}: ${err.message}`);
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const id = req.params.id;

  try {
    const num = await Incident.destroy({
      where: { id: id },
    });

    if (num !== 1) {
      logger.warn(
        `Cannot delete Incident with id=${id}. Maybe Incident was not found!`
      );
      return res.status(404).json({
        status: "error",
        message: `Cannot delete Incident with id=${id}. Maybe Incident was not found!`,
      });
    }

    if (redisClient) {
      await Promise.all([
        redisClient.del(`incident_${id}`),
        redisClient.del("all_incidents"),
      ]);
    }

    logger.info(`Deleted incident with id=${id}`);
    res.status(200).json({
      status: "success",
      message: "Incident was deleted successfully!",
    });
  } catch (err) {
    logger.error(`Error deleting incident with id=${id}: ${err.message}`);
    next(err);
  }
};

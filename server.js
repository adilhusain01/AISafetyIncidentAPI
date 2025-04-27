require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/error.middleware");
const { httpLogger } = require("./utils/logger");
const db = require("./models");
const incidentRoutes = require("./routes/incident.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined", { stream: httpLogger.stream }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});
app.use("/incidents", incidentRoutes);

app.use(errorHandler);

db.sequelize
  .sync()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

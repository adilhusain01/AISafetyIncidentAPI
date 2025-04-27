const router = require("express").Router();
const incidents = require("../controllers/incident.controller");
const {
  validateCreateIncident,
  validateIncidentId,
} = require("../middleware/validator.middleware");

router.post("/", validateCreateIncident, incidents.create);

router.get("/", incidents.findAll);

router.get("/:id", validateIncidentId, incidents.findOne);

router.delete("/:id", validateIncidentId, incidents.delete);

module.exports = router;

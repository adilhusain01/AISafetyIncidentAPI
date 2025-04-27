const router = require("express").Router();
const incidents = require("../controllers/incident.controller");
const {
  validateCreateIncident,
  validateIncidentId,
} = require("../middleware/validator.middleware");

// Create a new Incident
router.post("/", validateCreateIncident, incidents.create);

// Retrieve all Incidents
router.get("/", incidents.findAll);

// Retrieve a single Incident with id
router.get("/:id", validateIncidentId, incidents.findOne);

// Delete an Incident with id
router.delete("/:id", validateIncidentId, incidents.delete);

module.exports = router;

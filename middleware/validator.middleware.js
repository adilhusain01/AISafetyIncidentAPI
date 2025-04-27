const { body, param, validationResult } = require("express-validator");

const validateCreateIncident = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),
  body("severity")
    .notEmpty()
    .withMessage("Severity is required")
    .isIn(["Low", "Medium", "High"])
    .withMessage("Severity must be Low, Medium, or High"),
  validateResults,
];

const validateIncidentId = [
  param("id").isInt().withMessage("Incident ID must be an integer"),
  validateResults,
];

function validateResults(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.array(),
    });
  }
  next();
}

module.exports = {
  validateCreateIncident,
  validateIncidentId,
};

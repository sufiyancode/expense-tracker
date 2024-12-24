const { body, validationResult } = require("express-validator");

const collaborationValidationRules = () => {
  return [
    body("fullName").notEmpty().withMessage("Full Name is required"),
    body("phoneNumber").notEmpty().withMessage("Phone Number is required"),
    body("emailAddress")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("skills").notEmpty().withMessage("Skills description is required"),
    body("partnershipType")
      .notEmpty()
      .withMessage("Partnership type is required"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = errors
    .array()
    .map((err) => ({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  collaborationValidationRules,
  validate,
};

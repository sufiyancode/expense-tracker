const mongoose = require("mongoose");
const validator = require("validator");

/**
 * Collection of validation utility functions
 */
const validators = {
  /**
   * Validates MongoDB ObjectId
   * @param {string} id - The ID to validate
   * @returns {boolean} True if valid ObjectId, false otherwise
   */
  validateObjectId: (id) => {
    if (!id) return false;
    return mongoose.Types.ObjectId.isValid(id);
  },

  /**
   * Validates email address
   * @param {string} email - The email to validate
   * @returns {boolean} True if valid email, false otherwise
   */
  validateEmail: (email) => {
    if (!email) return false;
    return validator.isEmail(email);
  },

  /**
   * Validates required fields in an object
   * @param {Object} body - The object to check
   * @param {Array<string>} requiredFields - Array of required field names
   * @returns {Object} Object with isValid boolean and missing fields array
   */
  validateRequired: (body, requiredFields) => {
    const missingFields = requiredFields.filter((field) => {
      const value = body[field];
      return value === undefined || value === null || value === "";
    });

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  },

  /**
   * Validates string length
   * @param {string} str - The string to validate
   * @param {Object} options - Min and max length options
   * @returns {boolean} True if string length is within range, false otherwise
   */
  validateLength: (str, { min = 0, max = Infinity } = {}) => {
    if (!str || typeof str !== "string") return false;
    const length = str.trim().length;
    return length >= min && length <= max;
  },

  /**
   * Validates if the value is one of the allowed values
   * @param {any} value - The value to check
   * @param {Array} allowedValues - Array of allowed values
   * @returns {boolean} True if value is allowed, false otherwise
   */
  validateEnum: (value, allowedValues) => {
    return allowedValues.includes(value);
  },

  /**
   * Validates date string
   * @param {string} dateStr - The date string to validate
   * @param {Object} options - Options for date validation
   * @returns {boolean} True if valid date, false otherwise
   */
  validateDate: (dateStr, { allowFuture = true, allowPast = true } = {}) => {
    if (!dateStr || !validator.isISO8601(dateStr)) return false;

    const date = new Date(dateStr);
    const now = new Date();

    if (!allowFuture && date > now) return false;
    if (!allowPast && date < now) return false;

    return true;
  },

  /**
   * Validates a URL
   * @param {string} url - The URL to validate
   * @param {Object} options - Options for URL validation
   * @returns {boolean} True if valid URL, false otherwise
   */
  validateUrl: (
    url,
    { protocols = ["http", "https"], requireProtocol = true } = {}
  ) => {
    if (!url) return false;
    return validator.isURL(url, {
      protocols,
      require_protocol: requireProtocol,
    });
  },

  /**
   * Validates phone number
   * @param {string} phone - The phone number to validate
   * @param {string} locale - Locale for phone validation (e.g., 'en-IN' for India)
   * @returns {boolean} True if valid phone number, false otherwise
   */
  validatePhone: (phone, locale = "en-IN") => {
    if (!phone) return false;
    return validator.isMobilePhone(phone, locale);
  },

  /**
   * Custom validation helper for complex validations
   * @param {Function} validationFn - Custom validation function
   * @param {any} value - Value to validate
   * @returns {Object} Validation result with isValid and error message
   */
  customValidation: (validationFn, value) => {
    try {
      const result = validationFn(value);
      return {
        isValid: !!result,
        error: result === true ? null : result,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
      };
    }
  },
};

// Example usage as middleware
const validationMiddleware = {
  /**
   * Middleware to validate MongoDB ObjectId in request parameters
   */
  validateObjectIdParam: (paramName = "id") => {
    return (req, res, next) => {
      const id = req.params[paramName];
      if (!validators.validateObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${paramName} format`,
        });
      }
      next();
    };
  },

  /**
   * Middleware to validate required fields in request body
   */
  validateRequiredFields: (requiredFields) => {
    return (req, res, next) => {
      const { isValid, missingFields } = validators.validateRequired(
        req.body,
        requiredFields
      );
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
          details: missingFields,
        });
      }
      next();
    };
  },
};

module.exports = {
  ...validators,
  validationMiddleware,
};

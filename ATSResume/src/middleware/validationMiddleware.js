import { body, param, validationResult } from "express-validator"

class ValidationMiddleware {
  validateAnalysisRequest = [
    body("jobDescription")
      .notEmpty()
      .withMessage("Job description is required")
      .isLength({ min: 50, max: 5000 })
      .withMessage("Job description must be between 50 and 5000 characters")
      .trim()
      .escape(),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      next();
    },
  ];

  validateId = [
    param("id").isMongoId().withMessage("Invalid analysis ID format"),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      next();
    },
  ];

  validatePagination = [
    param("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),

    param("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      next();
    },
  ];
}

export const validationMiddleware = new ValidationMiddleware();

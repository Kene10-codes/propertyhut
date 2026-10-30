import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const sigupValidation = [
  // Validate last name
  body("lastName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Last Name field cannot be empty"),

  // Validate first name
  body("firstName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("First Name field cannot be empty"),

  // Validate email
  body("email")
    .isString()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .notEmpty()
    .withMessage("Email field cannot be empty")
    .normalizeEmail(),

  // Validate email
  body("phone")
    .isMobilePhone("en-NG")
    .trim()
    .notEmpty()
    .withMessage("Phone cannot be empty"),

  // Validate role
  body("role").toString(),

  // Validate status
  body("status").toString(),

  // Validate password
  body("password")
    .matches(/A-Z/)
    .withMessage("Password must have atleast one uppercase letter")
    .matches(/0-9/)
    .withMessage("Password must have atleast one number")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isEmpty()
    .withMessage("Password field cannot be empty"),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if(!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        })
      }

      next()
    }
];


module.exports = { sigupValidation }
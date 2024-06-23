import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.js";
import User from "../../models/user.js";

export const updateUserValidator = [
  check("username")
    .optional()
    .isLength({ max: 42, min: 6 })
    .withMessage("username must be 6 to 42 lenght"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invaild email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already exitsts"));
        }
      })
    ),
  check("password")
    .optional()
    .isLength({ min: 8, max: 32 })
    .withMessage("password must be 8 to 32 lenght"),
  validatorMiddleware,
];

export const mongoIdValidator = [
  check("id").isMongoId().withMessage("invalid mongo Id"),

  validatorMiddleware,
];

import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.js";
import User from "../../models/user.js";

export const signUpValidator = [
  check("username")
    .isLength({ max: 42, min: 6 })
    .withMessage("username must be 6 to 42 lenght"),
  check("email")
    .isEmail()
    .withMessage("invaild email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already exitsts"));
        }
      })
    ),
  check("password")
    .isLength({ min: 8, max: 32 })
    .withMessage("password must be 8 to 32 lenght"),
  validatorMiddleware,
];

export const signInValidator = [
  check("email")
    .notEmpty()
    .withMessage("email reqired")
    .isEmail()
    .withMessage("invaild email address"),
  check("password")
    .notEmpty()
    .withMessage("password reqired")
    .isLength({ min: 8, max: 32 })
    .withMessage("password must be 8 to 32 lenght"),
  validatorMiddleware,
];
export const signInWithGoogleValidator = [
  check("email").custom((email) =>
    User.findOne({ email }).then((user) => {
      if (user) {
        return Promise.reject(new Error("email already exitsts"));
      }
    })
  ),
  validatorMiddleware,
];

import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.js";
import slugify from "slugify";
import Post from "../../models/user.js";

export const createPostValidation = [
  check("content").notEmpty().withMessage("content is empty"),
  check("title")
    .notEmpty()
    .withMessage("content is empty")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      req.body.author = req.user._id.toString();
      return true;
    }),
  validatorMiddleware,
];

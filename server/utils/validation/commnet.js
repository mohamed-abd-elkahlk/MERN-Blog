import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.js";
import { ApiError } from "../index.js";

export const createCommentValidation = [
  check("content").notEmpty().withMessage("content is empty"),
  check("userId")
    .isMongoId()
    .withMessage("invaild id")
    .custom((userId, { req }) => {
      if (req.user._id.toString() !== userId) {
        return Promise.reject(
          new ApiError("you are not allowed to preform this action", 403)
        );
      }
      return true;
    }),
  check("postId").isMongoId().withMessage("invaild id"),

  validatorMiddleware,
];

import { Router } from "express";
import {
  createCommnet,
  getAllCommentToPost,
} from "../services/coments.service.js";
import passport from "passport";
import { createCommentValidation } from "../utils/validation/commnet.js";

const router = Router();
router.route("/create").post(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  }),
  createCommentValidation,
  createCommnet
);

router.get("/:postId", getAllCommentToPost);
export default router;

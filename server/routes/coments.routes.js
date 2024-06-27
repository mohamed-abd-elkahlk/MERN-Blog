import { Router } from "express";
import {
  createCommnet,
  deleteCommnet,
  getAllCommentToPost,
  updateCommnet,
} from "../services/coments.service.js";
import passport from "passport";
import {
  createCommentValidation,
  deleteCommentValidation,
  updateCommentValidation,
} from "../utils/validation/commnet.js";

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
router.route("/update/:id").put(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  }),
  updateCommentValidation,
  updateCommnet
);

router.route("/delete/:id").delete(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  }),
  deleteCommnet
);

router.get("/:postId", getAllCommentToPost);
export default router;

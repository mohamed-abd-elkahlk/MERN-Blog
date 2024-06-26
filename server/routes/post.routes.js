import { Router } from "express";
import {
  createPost,
  deleteOnePost,
  getAllPosts,
  getAllPostsForUser,
  getOnePost,
  updatePost,
} from "../services/post.service.js";
import { allowedTo } from "../services/auth.service.js";
import passport from "passport";
import { createPostValidation } from "../utils/validation/post.js";

const router = Router();

router.get(
  "/getpost",
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  }),
  allowedTo("admin"),
  getAllPostsForUser
);
router.delete(
  "/delete-post/:id",
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  }),
  allowedTo("admin"),
  deleteOnePost
);
router.post(
  "/create",
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  }),
  allowedTo("admin"),
  createPostValidation,
  createPost
);
router.put(
  "/update-post/:id",
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  }),
  allowedTo("admin"),
  updatePost
);
router.get("/", getAllPosts);
router.get("/:id", getOnePost);

export default router;

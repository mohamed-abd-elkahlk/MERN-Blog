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

router.get("/", getAllPosts);
router.get("/:id", getOnePost);
router.use(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  }),
  allowedTo("admin")
);
router.get("/getpost", getAllPostsForUser);
router.delete("/delete-post/:id", deleteOnePost);
router.post("/create", createPostValidation, createPost);
router.put("/update-post/:id", updatePost);

export default router;

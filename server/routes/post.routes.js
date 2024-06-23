import { Router } from "express";
import { createPost } from "../services/post.service.js";
import { allowedTo } from "../services/auth.service.js";
import passport from "passport";
import { createPostValidation } from "../utils/validation/post.js";

const router = Router();

router.use(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  }),
  allowedTo("admin")
);

router.post("/create", createPostValidation, createPost);

export default router;

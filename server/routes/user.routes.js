import { Router } from "express";
import { updateUser } from "../services/user.service.js";
import { updateUserValidator } from "../utils/validation/user.js";
import passport from "passport";

const router = Router();
router.use(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  })
);

router.put("/update:id", updateUserValidator, updateUser);

export default router;

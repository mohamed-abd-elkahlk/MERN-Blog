import { Router } from "express";
import {
  deleteUser,
  getOneUser,
  getUsers,
  updateUser,
  userSignOut,
} from "../services/user.service.js";
import { allowedTo } from "../services/auth.service.js";
import {
  mongoIdValidator,
  updateUserValidator,
} from "../utils/validation/user.js";
import passport from "passport";

const router = Router();
router.post("/sign-out", userSignOut);

router.use(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  })
);

router.put("/update/:id", updateUserValidator, updateUser);

router.delete("/delete/:id", mongoIdValidator, deleteUser);

router.use(allowedTo("admin"));

router.delete("/delete-user/:id", mongoIdValidator, deleteUser);
router.route("/").get(getUsers);
router.get("/:id", getOneUser);

export default router;

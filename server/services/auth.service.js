import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { createOne } from "./handler.js";
import { ApiError } from "../utils/index.js";
import { issueJWT } from "../utils/auth/index.js";
export const signUp = createOne(User);

export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError("incorrect email or password ", 404));
  const passwordValidation = bcrypt.compareSync(password, user.password);
  if (!passwordValidation)
    return next(new ApiError("incorrect email or password ", 404));

  const token = issueJWT(user);
  res
    .status(200)
    .cookie("jwt", token, { httpOnly: true })
    .json({ ok: true, message: "sign in successfully" });
});

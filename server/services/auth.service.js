import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { createOne } from "./handler.js";
import { ApiError } from "../utils/index.js";
import { issueJWT } from "../utils/auth/index.js";
export const signUp = asyncHandler(async (req, res, next) => {
  // TODO: handle image url logic
  const user = await User.create(req.body);
  const token = issueJWT(user);
  res
    .status(200)
    .cookie("jwt", token, { httpOnly: true, sameSite: "strict" })
    .json({
      ok: true,
      data: {
        username: user.username,
        email: user.email,
        id: user._id,
        authType: user.authType,
        imageUrl: user.imageUrl,
      },
    });
});
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
    .cookie("jwt", token, { httpOnly: true, sameSite: "strict" })
    .json({
      ok: true,
      data: {
        username: user.username,
        email: user.email,
        id: user._id,
        authType: user.authType,
        imageUrl: user.imageUrl,
      },
    });
});

export const signInWithGoogle = asyncHandler(async (req, res, next) => {
  const { name, email, imageUrl } = req.body;
  console.log(req);

  const user = await User.findOne({ email, authType: "google" });
  if (user) {
    const token = issueJWT(user);
    res
      .status(200)
      .cookie("jwt", token, { sameSite: "strict", httpOnly: true })
      .json({ data: user, ok: true });
  }

  const newUser = await User.create({
    username: name,
    email,
    imageUrl,
    authType: "google",
  });
  if (!newUser)
    return next(new ApiError("faild to create record with google data", 500));

  const newToken = issueJWT(newUser);
  res
    .status(200)
    .cookie("jwt", newToken, { sameSite: "strict", httpOnly: true })
    .json({ data: newUser, ok: true });
});

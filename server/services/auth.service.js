import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
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
        role: user.role,
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
    .cookie("jwt", token, { sameSite: "strict" })
    .json({
      ok: true,
      data: {
        username: user.username,
        email: user.email,
        _id: user._id,
        authType: user.authType,
        imageUrl: user.imageUrl,
        role: user.role,
      },
    });
});

export const signInWithGoogle = asyncHandler(async (req, res, next) => {
  const { name, email, imageUrl } = req.body;
  const user = await User.findOne({ email, authType: "google" });
  if (user) {
    const token = issueJWT(user);
    return res
      .status(200)
      .cookie("jwt", token)
      .json({
        data: {
          username: user.username,
          email: user.email,
          _id: user._id,
          authType: user.authType,
          imageUrl: user.imageUrl,
          role: user.role,
        },
        ok: true,
      });
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
    .cookie("jwt", newToken)
    .json({
      data: {
        username: newUser.username,
        email: newUser.email,
        _id: newUser._id,
        authType: newUser.authType,
        imageUrl: newUser.imageUrl,
        role: user.role,
      },
      ok: true,
    });
});

export const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

import User from "../models/user.js";
import { ApiError } from "../utils/index.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { deleteOne, getAll, getOne } from "./handler.js";
export const getUsers = getAll(User);
export const getOneUser = getOne(User);
export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.user._id.toString() !== id)
    return next(
      new ApiError("you don't have permission to access action", 403)
    );
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  }
  const user = await User.findByIdAndUpdate(id, req.body, { new: true });

  if (!user) {
    return next(new ApiError(`no user with this id :${id}`, 404));
  }

  res.status(200).json({
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

export const deleteUser = deleteOne(User);

export const userSignOut = asyncHandler(async (req, res) => {
  res.status(200).clearCookie("jwt").send({ ok: true });
});

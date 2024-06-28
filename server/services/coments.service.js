import asyncHandler from "express-async-handler";
import Comment from "../models/comment.js";
import { createOne, deleteOne, getAll, updateOne } from "./handler.js";
import { ApiError } from "../utils/index.js";
export const createCommnet = createOne(Comment);
export const updateCommnet = updateOne(Comment);
export const deleteCommnet = deleteOne(Comment);
export const getAllComments = getAll(Comment);

export const getAllCommentToPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  if (!postId) {
    return next(new ApiError("post id params not found", 400));
  }
  const comments = await Comment.find({ postId }).sort({ createAt: -1 });
  if (!comments) {
    return next(new ApiError("no comments for this post", 404));
  }
  res.status(200).json({ data: comments, ok: true });
});

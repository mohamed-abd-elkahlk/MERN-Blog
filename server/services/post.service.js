import asyncHandler from "express-async-handler";
import Post from "../models/post.js";
import { createOne, getAll } from "./handler.js";
import { ApiError, ApiFeatures } from "../utils/index.js";
export const createPost = createOne(Post);
export const getAllPosts = getAll(Post);

export const getAllPostsForUser = asyncHandler(async (req, res, next) => {
  const docCounts = await Post.countDocuments();
  const apiFutures = new ApiFeatures(
    Post.find({ author: req.user._id.toString() }),
    req.query
  )
    .filter()
    .limitFildes()
    .pagenate(docCounts)
    .serch()
    .sort();
  const { mongooseQuery, pagenation } = apiFutures;
  const document = await mongooseQuery;
  if (document.length === 0)
    return next(new ApiError("no data to display", 400));

  if (!document) {
    return next(new ApiError(`no posts found`, 404));
  }
  res
    .status(200)
    .json({ results: document.length, pagenation, data: document });
});

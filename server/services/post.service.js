import Post from "../models/post.js";
import { createOne } from "./handler.js";
export const createPost = createOne(Post);

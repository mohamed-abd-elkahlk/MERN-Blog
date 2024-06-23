import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    imageUrl: { type: String },
    category: {
      type: String,
      default: "uncategorized",
    },

    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;

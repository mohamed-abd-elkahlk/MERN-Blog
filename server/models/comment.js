import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "comment must have a content to be add!"],
    },
    postId: {
      ref: "Post",
      type: mongoose.Schema.ObjectId,
    },
    userId: {
      ref: "User",
      type: mongoose.Schema.ObjectId,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

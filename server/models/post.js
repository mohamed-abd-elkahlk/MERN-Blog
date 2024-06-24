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
    imageUrl: {
      type: String,
      default:
        "https://thecsrjournal.in/wp-content/uploads/2018/10/speed-post-640x518.png",
    },
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

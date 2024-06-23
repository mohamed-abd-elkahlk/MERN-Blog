import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    imageUrl: { type: String },
    authType: {
      type: String,
      enum: ["normal", "google"],
      default: "normal",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  }
);
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  const password = bcrypt.hashSync(this.password, 8);
  this.password = password;
  next();
});

const User = mongoose.model("User", userSchema);
export default User;

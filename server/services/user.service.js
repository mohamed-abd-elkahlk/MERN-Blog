import User from "../models/user.js";

export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(req.user);
  if (req.user._id.toString() !== id)
    return next(
      new ApiError("you don't have permission to access action", 403)
    );
  const user = await User.findByIdAndUpdate(id, req.body, { new: true });

  if (!user) {
    return next(new ApiError(`no user with this id :${id}`, 404));
  }

  res.status(200).json({ data: user });
});

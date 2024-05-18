import jwt from "jsonwebtoken";

export const issueJWT = (user) => {
  const id = user._id;
  const expiresIn = "5d";
  const { role } = user || "user";

  const payload = {
    sub: id,
    role,
    iat: Date.now(),
  };

  const token = jwt.sign(payload, process.env.JWT_SCREAT, {
    expiresIn,
  });

  return token;
};

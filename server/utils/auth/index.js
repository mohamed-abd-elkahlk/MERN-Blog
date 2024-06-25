import jwt from "jsonwebtoken";

export const issueJWT = (user) => {
  const id = user._id;
  const { role } = user || "user";
  const expiresIn = "10d";
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
export const varifyToken = (jwtToken) => {
  const decoded = jwt.verify(jwtToken, PUP_KEY);
  return decoded;
};

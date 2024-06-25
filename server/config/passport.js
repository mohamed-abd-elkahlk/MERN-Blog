import { Strategy } from "passport-jwt";
import User from "../models/user.js";
// my owne token
const cookiesExtractor = (req) => {
  let jwt;
  if (!req.cookies["jwt"]) {
    return (jwt = null);
  }

  return (jwt = req.cookies.jwt);
};
// const opts = {
//   jwtFromRequest: cookiesExtractor,
//   secretOrKey,
// };

export const strategy = new Strategy(
  {
    jwtFromRequest: cookiesExtractor,
    secretOrKey: process.env.JWT_SCREAT,
    ignoreExpiration: false,
  },
  (payload, done) => {
    User.findById(payload.sub)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(new Error("user not found try to register"), false);
      })
      .catch((err) => done(err, false));
  }
);

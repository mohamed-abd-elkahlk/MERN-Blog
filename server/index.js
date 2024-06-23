import dotenvLoad from "./config/envLoader.js";
import dbConnction from "./config/db.js";
import express from "express";
import routes from "./routes/index.js";
import { globalError } from "./middleware/error.js";
import { ApiError } from "./utils/index.js";
import passport from "passport";

import cookieParser from "cookie-parser";
import { strategy } from "./config/passport.js";
const app = express();
dbConnction();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
passport.use(strategy);

app.use("/api", routes);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 404));
});
app.use(globalError);
const server = app.listen(3000, () => {
  console.log("server on :http://localhost:3000");
});

process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Errors ${err.name} || ${err.message}`);
  server.close(() => {
    console.error(`Shtuing down...!`);
    process.exit(1);
  });
});

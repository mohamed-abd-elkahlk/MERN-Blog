import express from "express";
import dbConnction from "./config/db.js";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { globalError } from "./middleware/error.js";
import { ApiError } from "./utils/index.js";
dotenv.config();

const app = express();
app.use(express.json());
dbConnction();

app.use("/api", routes);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 404));
});
app.use(globalError);
app.listen(3000, () => {
  console.log("server on :http://localhost:3000");
});

process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Errors ${err.name} || ${err.message}`);
  server.close(() => {
    console.error(`Shtuing down...!`);
    process.exit(1);
  });
});

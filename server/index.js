import express from "express";
import dbConnction from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
dbConnction();
app.listen(3000, () => {
  console.log("server on :http://localhost:3000");
});

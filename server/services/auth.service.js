import User from "../models/user.js";
import { createOne } from "./handler.js";
export const signUp = createOne(User);

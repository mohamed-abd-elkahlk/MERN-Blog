import { Router } from "express";
import { signUp } from "../services/auth.service.js";
import { signupValidator } from "../utils/validation/auth.js";
const router = Router();
router.post("/sign-up", signupValidator, signUp);

export default router;

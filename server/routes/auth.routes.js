import { Router } from "express";
import { signUp, signIn } from "../services/auth.service.js";
import { signUpValidator, signInValidator } from "../utils/validation/auth.js";
const router = Router();
router.post("/sign-up", signUpValidator, signUp);
router.post("/sign-in", signInValidator, signIn);

export default router;

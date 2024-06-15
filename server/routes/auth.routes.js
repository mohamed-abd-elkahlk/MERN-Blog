import { Router } from "express";
import { signUp, signIn, signInWithGoogle } from "../services/auth.service.js";
import { signUpValidator, signInValidator } from "../utils/validation/auth.js";
const router = Router();
router.post("/sign-up", signUpValidator, signUp);
router.post("/sign-in", signInValidator, signIn);
router.post("/google", signInWithGoogle);

export default router;

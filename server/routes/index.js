import { Router } from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import postRouter from "./post.routes.js";
import commentRouter from "./coments.routes.js";
const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);
export default router;

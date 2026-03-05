import { Router } from "express";
//all routes will be imported here
import authRouter from "./auth.routes";
// import usersRouter from "./users.routes";
import memberRoutes from "./member.routes";
import plansRouter from "./plans.routes";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use("/auth", authRouter);

// PROTECTED ROUTES: all routes that require authentication will be imported here
router.use("/members", authMiddleware, memberRoutes);
router.use("/plans", authMiddleware, plansRouter);

router.get("/health", (req: any, res: any) => {
  res.status(200).json({ status: "API is Healthy" });
});

export default router;

import { Router } from "express";
//all routes will be imported here
import authRouter from "./auth.routes";
// import usersRouter from "./users.routes";
import memberRoutes from "./member.routes";
import plansRouter from "./plans.routes";
import paymentRoutes from "./payments.routes";
import attendanceRoutes from "./attendance.routes";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use("/auth", authRouter);

// PROTECTED ROUTES: all routes that require authentication will be imported here
router.use("/members", authMiddleware, memberRoutes);
router.use("/plans", authMiddleware, plansRouter);
router.use("/payments", authMiddleware, paymentRoutes);
router.use("/members", authMiddleware, attendanceRoutes);
router.use("/attendance", authMiddleware, attendanceRoutes);

router.get("/health", (req: any, res: any) => {
  res.status(200).json({ status: "API is Healthy" });
});

export default router;

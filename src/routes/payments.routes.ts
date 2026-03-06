import { Router } from "express";
import { authorize } from "../middleware/role.middleware";
import { Role } from "@prisma/client";
import { createPaymentController } from "../controllers/payment.controllers";

const router = Router();

router.post(
  "/create-payment/:id",
  authorize(Role.OWNER, Role.MANAGER),
  createPaymentController,
);

export default router;

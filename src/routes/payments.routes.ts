import { Router } from "express";
import { authorize } from "../middleware/role.middleware";
import { Role } from "@prisma/client";
import { getPaymentsController } from "../controllers/payment.controllers";

const router = Router();

router.get(
  "/get-payments",
  authorize(Role.OWNER, Role.MANAGER),
  getPaymentsController,
);

export default router;

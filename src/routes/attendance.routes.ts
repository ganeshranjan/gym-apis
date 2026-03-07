import { Role } from "@prisma/client";
import { Router } from "express";
import { authorize } from "../middleware/role.middleware";
import { checkInMemberController } from "../controllers/attendance.controllers";

const router = Router();

router.post(
  "/:id/attendance",
  authorize(Role.OWNER, Role.MANAGER, Role.MEMBER),
  checkInMemberController,
);

export default router;

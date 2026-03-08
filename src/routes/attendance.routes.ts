import { Role } from "@prisma/client";
import { Router } from "express";
import { authorize } from "../middleware/role.middleware";
import {
  checkInMemberController,
  getMemberAttendanceController,
  getAttendanceController,
  getTodayAttendanceController,
} from "../controllers/attendance.controllers";

const router = Router();

router.post(
  "/:id/attendance",
  authorize(Role.OWNER, Role.MANAGER, Role.MEMBER),
  checkInMemberController,
);

router.get(
  "/:id/attendance",
  authorize(Role.OWNER, Role.MANAGER, Role.MEMBER),
  getMemberAttendanceController,
);

router.get("/", authorize(Role.OWNER, Role.MANAGER), getAttendanceController);

router.get(
  "/today",
  authorize(Role.OWNER, Role.MANAGER),
  getTodayAttendanceController,
);

export default router;

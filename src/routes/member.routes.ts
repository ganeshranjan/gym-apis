import { Router } from "express";
import { authorize } from "../middleware/role.middleware";
import {
  createMemberController,
  getMembersController,
  getMemberByIdController,
  updateMemberController,
  changePlanController,
  deleteMemberByIdController,
  // getMemberPaymentsController,
} from "../controllers/member.controllers";
import { Role } from "@prisma/client";

const router = Router();

router.post(
  "/create-member",
  authorize(Role.OWNER, Role.MANAGER),
  createMemberController,
);

router.get("/", authorize(Role.OWNER, Role.MANAGER), getMembersController);

router.get(
  "/:id",
  authorize(Role.OWNER, Role.MANAGER),
  getMemberByIdController,
);

router.patch(
  "/:id",
  authorize(Role.OWNER, Role.MANAGER),
  updateMemberController,
);

router.patch(
  "/:id/change-plan",
  authorize(Role.OWNER, Role.MANAGER),
  changePlanController,
);

router.delete(
  "/:id",
  authorize(Role.OWNER, Role.MANAGER),
  deleteMemberByIdController,
);

router.get(
  "/:id/payments",
  authorize(Role.OWNER, Role.MANAGER),
  // getMemberPaymentsController,
);

export default router;

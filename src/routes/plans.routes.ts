import { Router } from "express";
import { authorize } from "../middleware/role.middleware";
import {
  createPlanController,
  getPlansController,
  updatePlanController,
  getPlanByIdController,
  deletePlanByIdController,
} from "../controllers/plans.controllers";
import { Role } from "@prisma/client";

const router = Router();

router.post("/create-plan", authorize(Role.OWNER), createPlanController);
router.get("/", authorize(Role.OWNER, Role.MANAGER), getPlansController);
router.patch("/:id", authorize(Role.OWNER), updatePlanController);
router.get("/:id", authorize(Role.OWNER, Role.MANAGER), getPlanByIdController);
router.delete("/:id", authorize(Role.OWNER), deletePlanByIdController);

export default router;

// const express = require("express");
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import {
  registerGym,
  login,
  getCurrentUserController,
} from "../controllers/auth.controllers";
const router = Router();

router.post("/register-gym", registerGym);
router.post("/login", login);

/* Get current logged-in user */
router.get("/me", authMiddleware, getCurrentUserController);

export default router;

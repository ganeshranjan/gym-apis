// const express = require("express");
import { Router } from "express";

import { registerGym, login } from "../controllers/auth.controllers";
const router = Router();

router.post("/register-gym", registerGym);
router.post("/login", login);

// router.post('login', loginUser);
// router.post('logout', logoutUser);
// router.post('forgot-password', forgotPassword);
// router.post('reset-password', resetPassword);
// router.post('verify-email', verifyEmail);
// router.post('resend-verification-email', resendVerificationEmail);
// router.post('send-password-reset-email', sendPasswordResetEmail);
// router.post('reset-password', resetPassword);

export default router;

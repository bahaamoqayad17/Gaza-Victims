import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  verifyOTPController,
  resetPasswordController,
} from "@/Controllers/AuthController";
import CatchAsync from "@/Utils/CatchAsync";
import {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateOTPVerification,
  validatePasswordReset,
} from "@/Utils/validationMiddleware";

const router = express.Router();

// Authentication routes with validation
router.post("/register", validateRegistration, CatchAsync(registerController));
router.post("/login", validateLogin, CatchAsync(loginController));
router.post(
  "/forgot-password",
  validateForgotPassword,
  CatchAsync(forgotPasswordController)
);
router.post(
  "/verify-otp",
  validateOTPVerification,
  CatchAsync(verifyOTPController)
);
router.post(
  "/reset-password",
  validatePasswordReset,
  CatchAsync(resetPasswordController)
);

export default router;

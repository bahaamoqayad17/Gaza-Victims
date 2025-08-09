import express from "express";
import {
  getAllUsersController,
  addUserController,
} from "@/Controllers/UserController";
import CatchAsync from "@/Utils/CatchAsync";
import { protect, restrictTo } from "@/Utils/authMiddleware";

const router = express.Router();

// Protected routes (require authentication and admin role)
router.get(
  "/",
  protect,
  restrictTo("admin"),
  CatchAsync(getAllUsersController)
);
router.post("/", protect, restrictTo("admin"), CatchAsync(addUserController));

export default router;

import express from "express";
import {
  getAllUsersController,
  addUserController,
  addModeratorController,
  getModerators,
  getThirdPartyModerators,
  getDigitalForensicsModerators,
} from "@/Controllers/UserController";
import CatchAsync from "@/Utils/CatchAsync";
import { protect, restrictTo } from "@/Utils/authMiddleware";

const router = express.Router();

// Protected routes (require authentication and admin role)
router.use(protect, restrictTo("admin", "senior_moderator"));

router.get("/", CatchAsync(getAllUsersController));
router.post("/", CatchAsync(addUserController));
router.post("/add-moderator", CatchAsync(addModeratorController));

router.get("/moderators", CatchAsync(getModerators));
router.get("/third-party-moderators", CatchAsync(getThirdPartyModerators));
router.get(
  "/digital-forensics-moderators",
  CatchAsync(getDigitalForensicsModerators)
);

export default router;

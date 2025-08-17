import express from "express";
import {
  getAllUsersController,
  addUserController,
  addModeratorController,
  getModerators,
  getThirdPartyModerators,
  getDigitalForensicsModerators,
  getUserRecords,
  deleteUserController,
  deactiveUserController,
  activateUserController,
} from "@/Controllers/UserController";
import CatchAsync from "@/Utils/CatchAsync";
import { protect, restrictTo } from "@/Utils/authMiddleware";

const router = express.Router();

// Protected routes (require authentication and admin role)
router.use(protect, restrictTo("admin", "senior_moderator"));

router.get("/", CatchAsync(getAllUsersController));
router.post("/", protect, restrictTo("admin"), CatchAsync(addUserController));
router.post(
  "/add-moderator",
  protect,
  restrictTo("admin", "senior_moderator"),
  CatchAsync(addModeratorController)
);

router.get("/moderators", protect, CatchAsync(getModerators));
router.get(
  "/third-party-moderators",
  protect,
  restrictTo("admin", "senior_moderator"),
  CatchAsync(getThirdPartyModerators)
);
router.get(
  "/digital-forensics-moderators",
  protect,
  restrictTo("admin", "senior_moderator"),
  CatchAsync(getDigitalForensicsModerators)
);

router.get("/user-records/:id", protect, CatchAsync(getUserRecords));

router.delete(
  "/:id",
  protect,
  restrictTo("admin", "senior_moderator"),
  CatchAsync(deleteUserController)
);

router.patch(
  "/deactivate/:id",
  protect,
  restrictTo("admin", "senior_moderator"),
  CatchAsync(deactiveUserController)
);

router.patch(
  "/activate/:id",
  protect,
  restrictTo("admin", "senior_moderator"),
  CatchAsync(activateUserController)
);

export default router;

import express from "express";
import {
  createDeleteRequest,
  getAllDeleteRequests,
  getDeleteRequestById,
  updateDeleteRequestStatus,
  deleteDeleteRequest,
} from "../Controllers/DeleteRequestController";
import { protect, restrictTo } from "../Utils/authMiddleware";

const router = express.Router();

// Public routes
router.post("/", createDeleteRequest);

// Protected routes (admin only)
router.use(protect);
router.use(restrictTo("admin", "senior_moderator"));

router.get("/", getAllDeleteRequests);
router.get("/:id", getDeleteRequestById);
router.patch("/:id/status", updateDeleteRequestStatus);
router.delete("/:id", deleteDeleteRequest);

export default router;

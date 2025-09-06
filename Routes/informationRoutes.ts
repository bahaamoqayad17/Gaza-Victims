import express from "express";
import {
  createInformation,
  getAllInformation,
  getInformationById,
  updateInformationStatus,
  deleteInformation,
  getInformationByCaseId,
} from "../Controllers/InformationController";
import { protect, restrictTo } from "../Utils/authMiddleware";
import { parseFormData } from "../Utils/formDataParser";

const router = express.Router();

// Public routes
router.post("/", parseFormData, createInformation);
router.get("/case/:caseId", getInformationByCaseId);

// Protected routes (admin only)
router.use(protect);
router.use(restrictTo("admin", "senior_moderator"));

router.get("/", getAllInformation);
router.get("/:id", getInformationById);
router.patch("/:id/status", updateInformationStatus);
router.delete("/:id", deleteInformation);

export default router;

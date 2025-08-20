import express from "express";
import {
  createReportController,
  getReportsController,
} from "@/Controllers/ReportController";
import CatchAsync from "@/Utils/CatchAsync";
import { protect, restrictTo } from "@/Utils/authMiddleware";
import { validateReportCreation } from "@/Utils/validationMiddleware";

const router = express.Router();

// POST /api/reports - Create a new report
router.post("/", validateReportCreation, CatchAsync(createReportController));
router.get(
  "/",
  protect,
  restrictTo("admin", "senior_moderator"),
  CatchAsync(getReportsController)
);

export default router;

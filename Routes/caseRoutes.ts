import express from "express";
import {
  getAllCasesController,
  getCaseController,
  createCaseController,
  getCasesLocationsController,
  getHomePageController,
  getCasesForThirdPartyReview,
  getPendingCases,
  getCasesForDigitalForensicsReview,
  getCasesUnderReview,
  assignCase,
  getDashboardStats,
  getVerifiedCases,
  verifyCase,
} from "@/Controllers/CaseController";
import CatchAsync from "@/Utils/CatchAsync";
import { validateCaseCreation } from "@/Utils/validationMiddleware";
import { parseFormData } from "@/Utils/formDataParser";
import { protect, restrictTo } from "@/Utils/authMiddleware";

const router = express.Router();

// Public routes
router.get("/", CatchAsync(getAllCasesController));
router.get("/locations", CatchAsync(getCasesLocationsController));
router.get("/homepage", CatchAsync(getHomePageController));

// Protected dashboard stats route
router.get(
  "/dashboard-stats",
  protect,
  restrictTo(
    "admin",
    "senior_moderator",
    "moderator",
    "third_party_moderator",
    "digital_forensics_moderator"
  ),
  CatchAsync(getDashboardStats)
);

// Case creation (anonymous submission allowed)
router.post(
  "/",
  parseFormData,
  validateCaseCreation,
  CatchAsync(createCaseController)
);

router.get(
  "/third-party-review",
  protect,
  restrictTo("third_party_moderator", "admin", "senior_moderator"),
  CatchAsync(getCasesForThirdPartyReview)
);

router.get(
  "/pending-cases",
  protect,
  restrictTo("moderator", "admin", "senior_moderator"),
  CatchAsync(getPendingCases)
);

router.get(
  "/cases-under-review",
  protect,
  restrictTo("admin", "senior_moderator"),
  CatchAsync(getCasesUnderReview)
);

router.get(
  "/digital-forensics-review",
  protect,
  restrictTo("digital_forensics_moderator", "admin", "senior_moderator"),
  CatchAsync(getCasesForDigitalForensicsReview)
);

router.post(
  "/assign-case/:id",
  protect,
  restrictTo("admin", "senior_moderator"),
  CatchAsync(assignCase)
);

router.get(
  "/verified-cases",
  protect,
  restrictTo("admin", "senior_moderator"),
  CatchAsync(getVerifiedCases)
);

router.patch(
  "/verify/:id",
  protect,
  restrictTo(
    "moderator",
    "third_party_moderator",
    "digital_forensics_moderator"
  ),
  CatchAsync(verifyCase)
);

router.get("/:id", CatchAsync(getCaseController));

export default router;

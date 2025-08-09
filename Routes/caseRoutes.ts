import express from "express";
import {
  getAllCasesController,
  getCaseController,
  createCaseController,
  getCasesLocationsController,
  getHomePageController,
} from "@/Controllers/CaseController";
import CatchAsync from "@/Utils/CatchAsync";
import { validateCaseCreation } from "@/Utils/validationMiddleware";
import { parseFormData } from "@/Utils/formDataParser";

const router = express.Router();

// Public routes
router.get("/", CatchAsync(getAllCasesController));
router.get("/locations", CatchAsync(getCasesLocationsController));
router.get("/homepage", CatchAsync(getHomePageController));
router.get("/:id", CatchAsync(getCaseController));

// Case creation (anonymous submission allowed)
router.post(
  "/",
  parseFormData,
  validateCaseCreation,
  CatchAsync(createCaseController)
);

export default router;

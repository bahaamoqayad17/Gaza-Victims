import express from "express";
import {
  getAllContactsController,
  createContactController,
} from "@/Controllers/ContactController";
import CatchAsync from "@/Utils/CatchAsync";
import { protect, restrictTo } from "@/Utils/authMiddleware";
import { validateContactCreation } from "@/Utils/validationMiddleware";

const router = express.Router();

// POST /api/contacts - Create a new contact
router.post("/", validateContactCreation, CatchAsync(createContactController));
router.get(
  "/",
  protect,
  restrictTo("admin", "senior_moderator"),
  CatchAsync(getAllContactsController)
);

export default router;

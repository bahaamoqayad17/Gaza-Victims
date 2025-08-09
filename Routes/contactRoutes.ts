import express from "express";
import {
  getAllContactsController,
  getContactController,
  createContactController,
  updateContactController,
  deleteContactController,
  getContactStatsController,
  searchContactsController,
} from "@/Controllers/ContactController";
import CatchAsync from "@/Utils/CatchAsync";
import { protect, restrictTo } from "@/Utils/authMiddleware";
import { validateContactCreation } from "@/Utils/validationMiddleware";

const router = express.Router();

// Public routes
// POST /api/contacts - Create a new contact (public endpoint for contact form)
router.post("/", validateContactCreation, CatchAsync(createContactController));

// Search contacts (can be public for basic search functionality)
router.get("/search", CatchAsync(searchContactsController));

// Protected routes (require authentication)
// GET /api/contacts - Get all contacts (admin/moderator only)
router.get(
  "/",
  protect,
  restrictTo("admin", "moderator"),
  CatchAsync(getAllContactsController)
);

// GET /api/contacts/stats - Get contact statistics (admin/moderator only)
router.get(
  "/stats",
  protect,
  restrictTo("admin", "moderator"),
  CatchAsync(getContactStatsController)
);

// GET /api/contacts/:id - Get specific contact (admin/moderator only)
router.get(
  "/:id",
  protect,
  restrictTo("admin", "moderator"),
  CatchAsync(getContactController)
);

// PUT /api/contacts/:id - Update contact (admin only)
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  CatchAsync(updateContactController)
);

// DELETE /api/contacts/:id - Delete contact (admin only)
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  CatchAsync(deleteContactController)
);

export default router;

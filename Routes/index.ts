import express from "express";
import authRoutes from "./authRoutes";
import caseRoutes from "./caseRoutes";
import userRoutes from "./userRoutes";
import contactRoutes from "./contactRoutes";

const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/cases", caseRoutes);
router.use("/users", userRoutes);
router.use("/contacts", contactRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running!",
    timestamp: new Date().toISOString(),
  });
});

export default router;

import express from "express";
import authRoutes from "./authRoutes";
import caseRoutes from "./caseRoutes";
import userRoutes from "./userRoutes";
import contactRoutes from "./contactRoutes";
import reportRoutes from "./reportsRoutes";
import deleteRequestRoutes from "./deleteRequestRoutes";
import informationRoutes from "./informationRoutes";

const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/cases", caseRoutes);
router.use("/users", userRoutes);
router.use("/contacts", contactRoutes);
router.use("/reports", reportRoutes);
router.use("/delete-requests", deleteRequestRoutes);
router.use("/information", informationRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running!",
    timestamp: new Date().toISOString(),
  });
});

export default router;

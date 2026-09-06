import { Router } from "express";

import {
  getDashboard,
} from "../controllers/dashboardController.js";

import {
  authenticateToken,
} from "../middleware/authMiddleware.js";

import {
  requireRole,
} from "../middleware/roleMiddleware.js";

const router = Router();

// ==================================================
// GET DASHBOARD
// ==================================================

router.get(
  "/",
  authenticateToken,
  requireRole("admin"),
  getDashboard
);

export default router;
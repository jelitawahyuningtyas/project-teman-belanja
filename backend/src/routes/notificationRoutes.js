import { Router } from "express";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";

import {
  authenticateToken,
} from "../middleware/authMiddleware.js";

import {
  requireRole,
} from "../middleware/roleMiddleware.js";

const router = Router();

// =========================
// GET NOTIFICATIONS
// =========================

router.get(
  "/",
  authenticateToken,
  requireRole("customer"),
  getMyNotifications
);

// =========================
// MARK ALL AS READ
// =========================

router.patch(
  "/read-all",
  authenticateToken,
  requireRole("customer"),
  markAllNotificationsAsRead
);

// =========================
// MARK ONE AS READ
// =========================

router.patch(
  "/:id/read",
  authenticateToken,
  requireRole("customer"),
  markNotificationAsRead
);

export default router;
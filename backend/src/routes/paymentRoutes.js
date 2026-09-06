import { Router } from "express";

import {
  updatePaymentStatus,
} from "../controllers/paymentController.js";

import {
  authenticateToken,
} from "../middleware/authMiddleware.js";

import {
  requireRole,
} from "../middleware/roleMiddleware.js";

const router = Router();

// ==================================================
// UPDATE PAYMENT STATUS
// ==================================================

router.patch(
  "/:orderId/status",
  authenticateToken,
  requireRole("customer"),
  updatePaymentStatus
);

export default router;
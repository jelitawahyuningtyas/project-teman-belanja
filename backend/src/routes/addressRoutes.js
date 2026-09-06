import { Router } from "express";

import {
  getAddresses,
  createAddress,
} from "../controllers/addressController.js";

import {
  authenticateToken,
} from "../middleware/authMiddleware.js";

import {
  requireRole,
} from "../middleware/roleMiddleware.js";

const router = Router();

// =========================
// GET ADDRESSES
// =========================

router.get(
  "/",
  authenticateToken,
  requireRole("customer"),
  getAddresses
);

// =========================
// CREATE ADDRESS
// =========================

router.post(
  "/",
  authenticateToken,
  requireRole("customer"),
  createAddress
);

export default router;
import { Router } from "express";

import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

import {
  authenticateToken,
} from "../middleware/authMiddleware.js";

import {
  requireRole,
} from "../middleware/roleMiddleware.js";

const router = Router();

// ==================================================
// ADMIN
// ==================================================

router.get(
  "/admin",
  authenticateToken,
  requireRole("admin"),
  getAllOrders
);

router.get(
  "/admin/:id",
  authenticateToken,
  requireRole("admin"),
  getOrderByIdAdmin
);

router.patch(
  "/:id/status",
  authenticateToken,
  requireRole("admin"),
  updateOrderStatus
);

router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  deleteOrder
);

// ==================================================
// CUSTOMER
// ==================================================

router.post(
  "/",
  authenticateToken,
  requireRole("customer"),
  createOrder
);

router.get(
  "/",
  authenticateToken,
  requireRole("customer"),
  getMyOrders
);

router.get(
  "/:id",
  authenticateToken,
  requireRole("customer"),
  getMyOrderById
);

export default router;
import { Router } from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  authenticateToken,
} from "../middleware/authMiddleware.js";

import {
  requireRole,
} from "../middleware/roleMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = Router();

// =========================
// GET SEMUA PRODUK
// =========================

router.get(
  "/",
  getProducts
);

// =========================
// GET DETAIL PRODUK
// =========================

router.get(
  "/:id",
  getProductById
);

// =========================
// CREATE PRODUCT
// ADMIN ONLY
// =========================

router.post(
  "/",
  authenticateToken,
  requireRole("admin"),
  upload.single("image"),
  createProduct
);

// =========================
// DELETE PRODUCT
// ADMIN ONLY
// =========================

router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  deleteProduct
);

export default router;
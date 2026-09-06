import { Router } from "express";

import {
  getCategories,
  getCategoryBySlug,
} from "../controllers/productController.js";

const router = Router();

// GET semua kategori
router.get("/", getCategories);

// GET kategori berdasarkan slug
router.get("/:slug", getCategoryBySlug);

export default router;
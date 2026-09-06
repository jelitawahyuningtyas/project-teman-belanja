import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";

import {
  authenticateToken,
} from "./middleware/authMiddleware.js";

import {
  requireRole,
} from "./middleware/roleMiddleware.js";

import path from "path";
import { fileURLToPath } from "url";

import orderRoutes from "./routes/orderRoutes.js";

import paymentRoutes from "./routes/paymentRoutes.js";

import notificationRoutes from "./routes/notificationRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// =========================
// STATIC UPLOADS
// =========================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// =========================
// AUTH
// =========================

app.use(
  "/api/auth",
  authRoutes
);

// =========================
// PRODUCTS
// =========================

app.use(
  "/api/products",
  productRoutes
);

// =========================
// CATEGORIES
// =========================

app.use(
  "/api/categories",
  categoryRoutes
);

// =========================
// ADDRESSES
// =========================

app.use(
  "/api/addresses",
  addressRoutes
);

// =========================
// HEALTH CHECK
// =========================

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message:
        "TemanBelanja backend berjalan!",
    });
  }
);

// =========================
// ORDER
// =========================

app.use(
  "/api/orders",
  orderRoutes
);

// =========================
// PAYMENTS
// =========================

app.use(
  "/api/payments",
  paymentRoutes
);

// =========================
// NOTIFICATIONS
// =========================

app.use(
  "/api/notifications",
  notificationRoutes
);

// =========================
// DASHBOARD
// =========================

app.use(
  "/api/dashboard",
  dashboardRoutes
);

// =========================
// TEST JWT
// =========================

app.get(
  "/api/test-auth",
  authenticateToken,
  (req, res) => {
    res.json({
      success: true,
      message: "JWT valid.",
      user: req.user,
    });
  }
);

// =========================
// TEST ADMIN
// =========================

app.get(
  "/api/test-admin",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    res.json({
      success: true,
      message:
        "Kamu memiliki akses admin.",
      user: req.user,
    });
  }
);

export default app;
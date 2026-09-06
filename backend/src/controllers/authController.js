import "dotenv/config";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../lib/prisma.js";

// =========================
// JWT SECRET
// =========================
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET belum ditemukan di file .env"
  );
}

// =========================
// REGISTER
// =========================
export async function register(req, res) {
  try {
    const {
      name,
      phone,
      username,
      email,
      password,
    } = req.body;

    // =========================
    // VALIDASI INPUT
    // =========================
    if (
      !name ||
      !phone ||
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password minimal 6 karakter.",
      });
    }

    const normalizedUsername =
      username.trim().toLowerCase();

    const normalizedEmail =
      email.trim().toLowerCase();

    // =========================
    // CEK USERNAME
    // =========================
    const existingUsername =
      await prisma.user.findUnique({
        where: {
          username: normalizedUsername,
        },
      });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message:
          "Username sudah digunakan.",
      });
    }

    // =========================
    // CEK EMAIL
    // =========================
    const existingEmail =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message:
          "Email sudah digunakan.",
      });
    }

    // =========================
    // HASH PASSWORD
    // =========================
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =========================
    // CREATE CUSTOMER
    // =========================
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,

        // Semua user yang daftar
        // otomatis CUSTOMER
        role: "CUSTOMER",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Akun berhasil dibuat.",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        username: user.username,
        email: user.email,
        role: "customer",
      },
    });
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Terjadi kesalahan pada server.",
    });
  }
}

// =========================
// LOGIN
// =========================
export async function login(req, res) {
  try {
    const {
      username,
      password,
    } = req.body;

    // =========================
    // VALIDASI INPUT
    // =========================
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Username dan password wajib diisi.",
      });
    }

    const normalizedUsername =
      username.trim().toLowerCase();

    // =========================
    // CARI USER
    // =========================
    const user =
      await prisma.user.findUnique({
        where: {
          username: normalizedUsername,
        },
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Username atau password salah.",
      });
    }

    // =========================
    // CEK PASSWORD
    // =========================
    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message:
          "Username atau password salah.",
      });
    }

    // =========================
    // ROLE
    // =========================
    const role =
      user.role === "ADMIN"
        ? "admin"
        : "customer";

    // =========================
    // JWT
    // =========================
    const token = jwt.sign(
      {
        userId: user.id,
        role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // =========================
    // RESPONSE
    // =========================
    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      token,

      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        username: user.username,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Terjadi kesalahan pada server.",
    });
  }
}
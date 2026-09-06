import prisma from "../lib/prisma.js";

// ==================================================
// GET ALL ADDRESSES
// GET /api/addresses
// CUSTOMER ONLY
// ==================================================

export async function getAddresses(req, res) {
  try {
    const userId = req.user.userId;

    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },

      orderBy: [
        {
          isMain: "desc",
        },
        {
          id: "asc",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data alamat.",
    });
  }
}

// ==================================================
// CREATE ADDRESS
// POST /api/addresses
// CUSTOMER ONLY
// ==================================================

export async function createAddress(req, res) {
  try {
    const userId = req.user.userId;

    const {
      label,
      recipientName,
      phone,
      address,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!label?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama alamat wajib diisi.",
      });
    }

    if (!recipientName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama penerima wajib diisi.",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nomor telepon wajib diisi.",
      });
    }

    if (!address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Alamat lengkap wajib diisi.",
      });
    }

    // =========================
    // CHECK EXISTING ADDRESS
    // =========================

    const existingAddress =
      await prisma.address.findFirst({
        where: {
          userId,
        },
      });

    // Alamat pertama otomatis menjadi
    // alamat utama
    const isMain = !existingAddress;

    // =========================
    // CREATE ADDRESS
    // =========================

    const newAddress =
      await prisma.address.create({
        data: {
          userId,
          label: label.trim(),
          recipientName: recipientName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          isMain,
        },
      });

    return res.status(201).json({
      success: true,
      message: "Alamat berhasil ditambahkan.",
      data: newAddress,
    });
  } catch (error) {
    console.error("Create address error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menambahkan alamat.",
    });
  }
}
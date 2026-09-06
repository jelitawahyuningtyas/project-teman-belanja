import prisma from "../lib/prisma.js";

// ==================================================
// UPDATE PAYMENT STATUS
// PATCH /api/payments/:orderId/status
// CUSTOMER ONLY
// ==================================================

export async function updatePaymentStatus(
  req,
  res
) {
  try {
    const userId =
      req.user.userId;

    const orderId =
      req.params.orderId;

    const { status } =
      req.body;

    // =========================
    // VALID STATUS
    // =========================

    const validStatuses = [
      "PAID",
      "FAILED",
      "EXPIRED",
      "CANCELLED",
    ];

    if (
      !validStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status pembayaran tidak valid.",
      });
    }

    // =========================
    // FIND ORDER
    // =========================

    const order =
      await prisma.order.findFirst({
        where: {
          id: orderId,
          userId,
        },

        include: {
          payment: true,
        },
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Pesanan tidak ditemukan.",
      });
    }

    // =========================
    // PAYMENT MUST EXIST
    // =========================

    if (!order.payment) {
      return res.status(404).json({
        success: false,
        message:
          "Data pembayaran tidak ditemukan.",
      });
    }

    // =========================
    // ONLY QRIS
    // =========================

    if (
      order.paymentMethod !==
      "QRIS"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status pembayaran ini hanya dapat diperbarui untuk pesanan QRIS.",
      });
    }

    // =========================
    // PAYMENT ALREADY FINAL
    // =========================

    const finalStatuses = [
      "PAID",
      "FAILED",
      "EXPIRED",
      "CANCELLED",
    ];

    if (
      finalStatuses.includes(
        order.paymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status pembayaran sudah final dan tidak dapat diubah lagi.",
      });
    }

    // =========================
    // UPDATE PAYMENT + ORDER
    // =========================

    const updatedOrder =
      await prisma.$transaction(
        async (tx) => {
          // =========================
          // UPDATE PAYMENT
          // =========================

          await tx.payment.update({
            where: {
              orderId:
                order.id,
            },

            data: {
              status,

              paidAt:
                status === "PAID"
                  ? new Date()
                  : null,
            },
          });

          // =========================
          // UPDATE ORDER
          // =========================

          const updated =
            await tx.order.update({
              where: {
                id:
                  order.id,
              },

              data: {
                paymentStatus:
                  status,
              },

              include: {
                address: true,

                items: {
                  include: {
                    product: true,
                  },
                },

                payment: true,
              },
            });

          // =========================
          // PAYMENT NOTIFICATION
          // =========================

          if (
            status ===
            "PAID"
          ) {
            await tx.notification.create({
              data: {
                userId:
                  order.userId,

                type:
                  "payment",

                title:
                  "Pembayaran Berhasil",

                message:
                  "Pembayaran QRIS berhasil.",

                orderId:
                  order.id,
              },
            });
          }

          if (
            status ===
            "FAILED"
          ) {
            await tx.notification.create({
              data: {
                userId:
                  order.userId,

                type:
                  "payment",

                title:
                  "Pembayaran Gagal",

                message:
                  "Pembayaran QRIS gagal dilakukan.",

                orderId:
                  order.id,
              },
            });
          }

          if (
            status ===
            "EXPIRED"
          ) {
            await tx.notification.create({
              data: {
                userId:
                  order.userId,

                type:
                  "payment",

                title:
                  "Pembayaran Kedaluwarsa",

                message:
                  "Waktu pembayaran QRIS telah habis.",

                orderId:
                  order.id,
              },
            });
          }

          if (
            status ===
            "CANCELLED"
          ) {
            await tx.notification.create({
              data: {
                userId:
                  order.userId,

                type:
                  "payment",

                title:
                  "Pembayaran Dibatalkan",

                message:
                  "Pembayaran QRIS dibatalkan.",

                orderId:
                  order.id,
              },
            });
          }

          return updated;
        }
      );

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      success: true,

      message:
        "Status pembayaran berhasil diperbarui.",

      data:
        updatedOrder,
    });
  } catch (error) {
    console.error(
      "Update payment status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal memperbarui status pembayaran.",
    });
  }
}
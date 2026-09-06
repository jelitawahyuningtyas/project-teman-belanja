import prisma from "../lib/prisma.js";

// ==================================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// CUSTOMER ONLY
// ==================================================

export async function getMyNotifications(req, res) {
  try {
    const userId = req.user.userId;

    const notifications =
      await prisma.notification.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil notifikasi.",
    });
  }
}

// ==================================================
// MARK AS READ
// PATCH /api/notifications/:id/read
// CUSTOMER ONLY
// ==================================================

export async function markNotificationAsRead(
  req,
  res
) {
  try {
    const userId = req.user.userId;

    const notification =
      await prisma.notification.findFirst({
        where: {
          id: Number(req.params.id),
          userId,
        },
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notifikasi tidak ditemukan.",
      });
    }

    const updatedNotification =
      await prisma.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          isRead: true,
        },
      });

    return res.status(200).json({
      success: true,
      data: updatedNotification,
    });
  } catch (error) {
    console.error(
      "Mark notification as read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal memperbarui notifikasi.",
    });
  }
}

// ==================================================
// MARK ALL AS READ
// PATCH /api/notifications/read-all
// CUSTOMER ONLY
// ==================================================

export async function markAllNotificationsAsRead(
  req,
  res
) {
  try {
    const userId = req.user.userId;

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "Semua notifikasi telah dibaca.",
    });
  } catch (error) {
    console.error(
      "Mark all notifications as read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal memperbarui notifikasi.",
    });
  }
}
import prisma from "../lib/prisma.js";

// ==================================================
// GET ADMIN DASHBOARD
// GET /api/dashboard
// ADMIN ONLY
// ==================================================

export async function getDashboard(req, res) {
  try {
    // =========================
    // TOTAL PESANAN
    // =========================

    const totalOrders =
      await prisma.order.count();

    // =========================
    // TOTAL CUSTOMER
    // =========================

    const totalCustomers =
      await prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      });

    // =========================
    // TOTAL PENDAPATAN
    // HANYA PESANAN YANG SUDAH PAID
    // =========================

    const revenueResult =
      await prisma.order.aggregate({
        _sum: {
          total: true,
        },

        where: {
          paymentStatus: "PAID",
        },
      });

    const totalRevenue =
      revenueResult._sum.total || 0;

    // =========================
    // GET PAID ORDERS
    // UNTUK PRODUK TERLARIS
    // =========================

    const paidOrders =
      await prisma.order.findMany({
        where: {
          paymentStatus: "PAID",
        },

        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

    // =========================
    // HITUNG PRODUK TERJUAL
    // =========================

    const productSales = {};

    for (const order of paidOrders) {
      for (const item of order.items) {
        const productId =
          item.productId;

        if (!productSales[productId]) {
          productSales[productId] = {
            id: productId,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            sold: 0,
          };
        }

        productSales[productId].sold +=
          item.quantity;
      }
    }

    // =========================
    // SORT PRODUK TERLARIS
    // =========================

    const bestSellingProducts =
      Object.values(productSales)
        .sort(
          (a, b) =>
            b.sold - a.sold
        )
        .slice(0, 5);

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      success: true,

      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        bestSellingProducts,
      },
    });
  } catch (error) {
    console.error(
      "Get dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil data dashboard.",
    });
  }
}
import prisma from "../lib/prisma.js";

// ==================================================
// GENERATE ORDER NUMBER
// ==================================================

function generateOrderNumber() {
  const now = new Date();

  const datePart =
    `${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}`;

  const timePart =
    String(now.getTime()).slice(-6);

  return `TB-${datePart}-${timePart}`;
}

// ==================================================
// CREATE ORDER
// POST /api/orders
// CUSTOMER ONLY
// ==================================================

export async function createOrder(req, res) {
  try {
    const userId = req.user.userId;

    const {
      items,
      addressId,
      paymentMethod,
    } = req.body;

    // =========================
    // BASIC VALIDATION
    // =========================

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimal satu produk harus dipilih.",
      });
    }

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message:
          "Alamat pengiriman wajib dipilih.",
      });
    }

    if (
      !["QRIS", "COD"].includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Metode pembayaran tidak valid.",
      });
    }

    // =========================
    // CHECK ADDRESS
    // =========================

    const address =
      await prisma.address.findFirst({
        where: {
          id: Number(addressId),
          userId,
        },
      });

    if (!address) {
      return res.status(404).json({
        success: false,
        message:
          "Alamat tidak ditemukan.",
      });
    }

    // =========================
    // GET PRODUCTS
    // =========================

    const productIds = items.map(
      (item) =>
        Number(item.productId)
    );

    const uniqueProductIds =
      [...new Set(productIds)];

    const products =
      await prisma.product.findMany({
        where: {
          id: {
            in: uniqueProductIds,
          },
          isActive: true,
        },
      });

    // =========================
    // CHECK PRODUCT
    // =========================

    if (
      products.length !==
      uniqueProductIds.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Salah satu produk tidak tersedia.",
      });
    }

    // =========================
    // BUILD ORDER ITEMS
    // =========================

    let total = 0;

    const orderItems = [];

    for (const item of items) {
      const product = products.find(
        (currentProduct) =>
          currentProduct.id ===
          Number(item.productId)
      );

      const quantity =
        Number(item.quantity);

      if (
        !Number.isInteger(
          quantity
        ) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Jumlah produk tidak valid.",
        });
      }

      // =========================
      // STOCK CHECK
      // =========================

      if (
        quantity >
        product.stock
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Stok ${product.name} tidak mencukupi.`,
        });
      }

      // =========================
      // PRICE SNAPSHOT
      // =========================

      const itemTotal =
        product.price *
        quantity;

      total += itemTotal;

      orderItems.push({
        productId:
          product.id,

        quantity,

        price:
          product.price,
      });
    }

    // =========================
    // PAYMENT
    // =========================

    const normalizedPaymentMethod =
      paymentMethod === "QRIS"
        ? "QRIS"
        : "COD";

    const paymentStatus =
      "PENDING";

    // =========================
    // ORDER NUMBER
    // =========================

    const orderId =
      generateOrderNumber();

    // =========================
    // DATABASE TRANSACTION
    // =========================

    const order =
      await prisma.$transaction(
        async (tx) => {
          // =========================
          // CREATE ORDER
          // =========================

          const newOrder =
            await tx.order.create({
              data: {
                id: orderId,

                userId,

                addressId:
                  address.id,

                paymentMethod:
                  normalizedPaymentMethod,

                paymentStatus,

                orderStatus:
                  "DIKEMAS",

                total,
              },
            });

          // =========================
          // CREATE ORDER ITEMS
          // =========================

          await tx.orderItem.createMany({
            data:
              orderItems.map(
                (item) => ({
                  orderId:
                    newOrder.id,

                  productId:
                    item.productId,

                  quantity:
                    item.quantity,

                  price:
                    item.price,
                })
              ),
          });

          // =========================
          // CREATE PAYMENT
          // =========================

          await tx.payment.create({
            data: {
              orderId:
                newOrder.id,

              method:
                normalizedPaymentMethod,

              status:
                paymentStatus,
            },
          });

          // =========================
          // REDUCE STOCK
          // =========================

          for (const item of orderItems) {
            await tx.product.update({
              where: {
                id:
                  item.productId,
              },

              data: {
                stock: {
                  decrement:
                    item.quantity,
                },
              },
            });
          }

          return newOrder;
        }
      );

    // =========================
    // GET COMPLETE ORDER
    // =========================

    const completeOrder =
      await prisma.order.findUnique({
        where: {
          id: order.id,
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
    // RESPONSE
    // =========================

    return res.status(201).json({
      success: true,

      message:
        "Pesanan berhasil dibuat.",

      data: {
        id:
          completeOrder.id,

        paymentMethod:
          completeOrder.paymentMethod,

        paymentStatus:
          completeOrder.paymentStatus,

        orderStatus:
          completeOrder.orderStatus,

        total:
          completeOrder.total,

        shippingNumber:
          completeOrder.shippingNumber,

        createdAt:
          completeOrder.createdAt,

        address:
          completeOrder.address,

        items:
          completeOrder.items.map(
            (item) => ({
              id:
                item.id,

              productId:
                item.productId,

              quantity:
                item.quantity,

              price:
                item.price,

              product:
                item.product,
            })
          ),

        payment:
          completeOrder.payment,
      },
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal membuat pesanan.",
    });
  }
}

// ==================================================
// GET CUSTOMER ORDERS
// GET /api/orders
// CUSTOMER ONLY
// ==================================================

export async function getMyOrders(
  req,
  res
) {
  try {
    const userId =
      req.user.userId;

    const orders =
      await prisma.order.findMany({
        where: {
          userId,
        },

        orderBy: {
          createdAt: "desc",
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

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil pesanan.",
    });
  }
}

// ==================================================
// GET CUSTOMER ORDER DETAIL
// GET /api/orders/:id
// CUSTOMER ONLY
// ==================================================

export async function getMyOrderById(
  req,
  res
) {
  try {
    const userId =
      req.user.userId;

    const order =
      await prisma.order.findFirst({
        where: {
          id: req.params.id,
          userId,
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

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Pesanan tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "Get order detail error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil detail pesanan.",
    });
  }
}

// ==================================================
// GET ALL ORDERS
// GET /api/orders/admin
// ADMIN ONLY
// ==================================================

export async function getAllOrders(
  req,
  res
) {
  try {
    const orders =
      await prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },

        include: {
          address: true,

          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              phone: true,
            },
          },

          items: {
            include: {
              product: true,
            },
          },

          payment: true,
        },
      });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(
      "Get all orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil semua pesanan.",
    });
  }
}

// ==================================================
// GET ADMIN ORDER DETAIL
// GET /api/orders/admin/:id
// ADMIN ONLY
// ==================================================

export async function getOrderByIdAdmin(
  req,
  res
) {
  try {
    const order =
      await prisma.order.findUnique({
        where: {
          id: req.params.id,
        },

        include: {
          address: true,

          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              phone: true,
            },
          },

          items: {
            include: {
              product: true,
            },
          },

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

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "Get admin order detail error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil detail pesanan.",
    });
  }
}

// ==================================================
// UPDATE ORDER STATUS
// PATCH /api/orders/:id/status
// ADMIN ONLY
// ==================================================

export async function updateOrderStatus(
  req,
  res
) {
  try {
    const { status } =
      req.body;

    // =========================
    // STATUS MAP
    // =========================

    const statusMap = {
      Dikemas: "DIKEMAS",
      Dikirim: "DIKIRIM",
      Diterima: "DITERIMA",
    };

    if (!statusMap[status]) {
      return res.status(400).json({
        success: false,
        message:
          "Status pesanan tidak valid.",
      });
    }

    // =========================
    // FIND ORDER
    // =========================

    const order =
      await prisma.order.findUnique({
        where: {
          id: req.params.id,
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
    // STATUS FLOW
    // =========================

    const statusOrder = [
      "DIKEMAS",
      "DIKIRIM",
      "DITERIMA",
    ];

    const currentIndex =
      statusOrder.indexOf(
        order.orderStatus
      );

    const nextStatus =
      statusMap[status];

    const nextIndex =
      statusOrder.indexOf(
        nextStatus
      );

    // Status harus valid
    if (
      currentIndex === -1 ||
      nextIndex === -1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status pesanan tidak valid.",
      });
    }

    // =========================
    // STATUS TIDAK BOLEH SAMA
    // =========================

    if (
      nextIndex ===
      currentIndex
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status pesanan sudah berada pada status tersebut.",
      });
    }

    // =========================
    // TIDAK BOLEH MUNDUR
    // =========================

    if (
      nextIndex <
      currentIndex
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status pesanan tidak dapat mundur.",
      });
    }

    // =========================
    // UPDATE DATA
    // =========================

    const updateData = {
      orderStatus:
        nextStatus,
    };

    // Nomor pengiriman dibuat
    // ketika status DIKIRIM
    if (
      nextStatus ===
        "DIKIRIM" &&
      !order.shippingNumber
    ) {
      updateData.shippingNumber =
        `TB-SHP-${Date.now()
          .toString()
          .slice(-6)}`;
    }

    // =========================
    // TRANSACTION
    // =========================

    const updatedOrder =
      await prisma.$transaction(
        async (tx) => {
          const updated =
            await tx.order.update({
              where: {
                id:
                  order.id,
              },

              data:
                updateData,
            });

          // =========================
          // NOTIFICATION DIKIRIM
          // =========================

          if (
            nextStatus ===
            "DIKIRIM"
          ) {
            await tx.notification.create({
              data: {
                userId:
                  order.userId,

                type:
                  "shipping",

                title:
                  "Barang Berhasil Dikirim",

                message:
                  "Pesananmu sedang dalam perjalanan.",

                orderId:
                  order.id,

                shippingNumber:
                  updateData.shippingNumber ||
                  order.shippingNumber ||
                  null,
              },
            });
          }

          // =========================
          // NOTIFICATION DITERIMA
          // =========================

          if (
            nextStatus ===
            "DITERIMA"
          ) {
            await tx.notification.create({
              data: {
                userId:
                  order.userId,

                type:
                  "completed",

                title:
                  "Pesanan Telah Selesai",

                message:
                  "Pesananmu telah selesai dan berhasil diterima.",

                orderId:
                  order.id,
              },
            });
          }

          // =========================
          // COD PAYMENT
          // =========================

          if (
            nextStatus ===
              "DITERIMA" &&
            order.paymentMethod ===
              "COD" &&
            order.paymentStatus !==
              "PAID"
          ) {
            await tx.payment.update({
              where: {
                orderId:
                  order.id,
              },

              data: {
                status:
                  "PAID",

                paidAt:
                  new Date(),
              },
            });

            await tx.order.update({
              where: {
                id:
                  order.id,
              },

              data: {
                paymentStatus:
                  "PAID",
              },
            });
          }

          return updated;
        }
      );

    // =========================
    // GET UPDATED ORDER
    // =========================

    const completeOrder =
      await prisma.order.findUnique({
        where: {
          id:
            updatedOrder.id,
        },

        include: {
          address: true,

          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              phone: true,
            },
          },

          items: {
            include: {
              product: true,
            },
          },

          payment: true,
        },
      });

    return res.status(200).json({
      success: true,

      message:
        "Status pesanan berhasil diperbarui.",

      data:
        completeOrder,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal memperbarui status pesanan.",
    });
  }
}

// ==================================================
// DELETE ORDER
// DELETE /api/orders/:id
// ADMIN ONLY
// ==================================================

export async function deleteOrder(
  req,
  res
) {
  try {
    const order =
      await prisma.order.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Pesanan tidak ditemukan.",
      });
    }

    await prisma.order.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "Pesanan berhasil dihapus.",
    });
  } catch (error) {
    console.error(
      "Delete order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal menghapus pesanan.",
    });
  }
}
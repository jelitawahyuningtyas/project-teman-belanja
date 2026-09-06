import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const OrderContext = createContext();

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

// =========================
// NORMALIZE STATUS
// =========================

function normalizeStatus(status) {
  const value =
    String(status || "").toUpperCase();

  if (value === "DIKIRIM") {
    return "Dikirim";
  }

  if (value === "DITERIMA") {
    return "Diterima";
  }

  return "Dikemas";
}

// =========================
// FORMAT ORDER
// =========================

function normalizeOrder(order) {
  return {
    ...order,

    // Nomor pesanan
    id: order.id,

    // Tanggal untuk UI
    date: order.createdAt
      ? new Date(
          order.createdAt
        ).toLocaleDateString(
          "id-ID",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : "",

    // Status pembayaran
    paymentStatus:
      order.paymentStatus,

    // Status pesanan
    orderStatus:
      normalizeStatus(
        order.orderStatus
      ),

    // Nomor pengiriman
    shippingNumber:
      order.shippingNumber || "",

    // Order items
    items: (
      order.items || []
    ).map((item) => ({
      id: item.id,

      productId:
        item.productId,

      quantity:
        item.quantity,

      // Harga saat transaksi
      price:
        item.price,

      // Data product dari backend
      product:
        item.product || null,
    })),
  };
}

// =========================
// ORDER PROVIDER
// =========================

export function OrderProvider({
  children,
}) {
  const {
    currentUser,
    isAuthenticated,
  } = useAuth();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==================================================
  // GET CUSTOMER ORDERS
  // ==================================================

  const fetchMyOrders =
    async () => {
      const token =
        localStorage.getItem(
          "temanbelanja_token"
        );

      if (
        !token ||
        currentUser?.role !==
          "customer"
      ) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE_URL}/orders`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Gagal mengambil pesanan."
          );
        }

        setOrders(
          (data.data || []).map(
            normalizeOrder
          )
        );
      } catch (error) {
        console.error(
          "Fetch my orders error:",
          error
        );

        setOrders([]);

        setError(
          error.message ||
            "Gagal mengambil pesanan."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==================================================
  // GET ADMIN ORDERS
  // ==================================================

  const fetchAdminOrders =
    async () => {
      const token =
        localStorage.getItem(
          "temanbelanja_token"
        );

      if (
        !token ||
        currentUser?.role !==
          "admin"
      ) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE_URL}/orders/admin`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Gagal mengambil semua pesanan."
          );
        }

        setOrders(
          (data.data || []).map(
            normalizeOrder
          )
        );
      } catch (error) {
        console.error(
          "Fetch admin orders error:",
          error
        );

        setOrders([]);

        setError(
          error.message ||
            "Gagal mengambil semua pesanan."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==================================================
  // LOAD ORDERS
  // ==================================================

  useEffect(() => {
    if (!isAuthenticated) {
      setOrders([]);
      setError("");
      return;
    }

    if (
      currentUser?.role ===
      "customer"
    ) {
      fetchMyOrders();
      return;
    }

    if (
      currentUser?.role ===
      "admin"
    ) {
      fetchAdminOrders();
    }
  }, [
    isAuthenticated,
    currentUser,
  ]);

  // ==================================================
  // CREATE ORDER
  // ==================================================

  const createOrder =
    async (orderData) => {
      const token =
        localStorage.getItem(
          "temanbelanja_token"
        );

      if (!token) {
        return {
          success: false,
          message:
            "Sesi login tidak ditemukan. Silakan login kembali.",
        };
      }

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/orders`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                items:
                  orderData.items,

                addressId:
                  orderData.addressId,

                paymentMethod:
                  orderData.paymentMethod,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          return {
            success: false,
            message:
              data.message ||
              "Gagal membuat pesanan.",
          };
        }

        const newOrder =
          normalizeOrder(
            data.data
          );

        setOrders(
          (currentOrders) => [
            newOrder,
            ...currentOrders,
          ]
        );

        return {
          success: true,
          data: newOrder,
        };
      } catch (error) {
        console.error(
          "Create order error:",
          error
        );

        return {
          success: false,
          message:
            "Tidak dapat terhubung ke server.",
        };
      }
    };

  // ==================================================
  // UPDATE ORDER STATUS
  // ADMIN
  // ==================================================

  const updateOrderStatus =
    async (
      orderId,
      newStatus
    ) => {
      const token =
        localStorage.getItem(
          "temanbelanja_token"
        );

      if (!token) {
        return {
          success: false,
          message:
            "Sesi login tidak ditemukan.",
        };
      }

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/orders/${orderId}/status`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                status:
                  newStatus,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          return {
            success: false,
            message:
              data.message ||
              "Gagal memperbarui status pesanan.",
          };
        }

        const updatedOrder =
          normalizeOrder(
            data.data
          );

        setOrders(
          (currentOrders) =>
            currentOrders.map(
              (order) =>
                order.id ===
                orderId
                  ? updatedOrder
                  : order
            )
        );

        return {
          success: true,
          data: updatedOrder,
        };
      } catch (error) {
        console.error(
          "Update order status error:",
          error
        );

        return {
          success: false,
          message:
            "Tidak dapat terhubung ke server.",
        };
      }
    };

  // ==================================================
  // DELETE ORDER
  // ADMIN
  // ==================================================

  const deleteOrder =
    async (orderId) => {
      const token =
        localStorage.getItem(
          "temanbelanja_token"
        );

      if (!token) {
        return {
          success: false,
          message:
            "Sesi login tidak ditemukan.",
        };
      }

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/orders/${orderId}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          return {
            success: false,
            message:
              data.message ||
              "Gagal menghapus pesanan.",
          };
        }

        setOrders(
          (currentOrders) =>
            currentOrders.filter(
              (order) =>
                order.id !==
                orderId
            )
        );

        return {
          success: true,
          message:
            data.message ||
            "Pesanan berhasil dihapus.",
        };
      } catch (error) {
        console.error(
          "Delete order error:",
          error
        );

        return {
          success: false,
          message:
            "Tidak dapat terhubung ke server.",
        };
      }
    };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,

        createOrder,
        updateOrderStatus,
        deleteOrder,

        fetchMyOrders,
        fetchAdminOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

// ==================================================
// HOOK
// ==================================================

export function useOrder() {
  const context =
    useContext(OrderContext);

  if (!context) {
    throw new Error(
      "useOrder harus digunakan di dalam OrderProvider"
    );
  }

  return context;
}
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const NotificationContext =
  createContext();

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export function NotificationProvider({
  children,
}) {
  const {
    currentUser,
    isAuthenticated,
  } = useAuth();

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // =========================
  // GET NOTIFICATIONS
  // =========================

  const fetchNotifications =
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
        setNotifications([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE_URL}/notifications`,
            {
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
              "Gagal mengambil notifikasi."
          );
        }

        setNotifications(
          data.data || []
        );
      } catch (error) {
        console.error(
          "Fetch notifications error:",
          error
        );

        setNotifications([]);

        setError(
          error.message ||
            "Gagal mengambil notifikasi."
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    if (
      currentUser?.role ===
      "customer"
    ) {
      fetchNotifications();
    }
  }, [
    isAuthenticated,
    currentUser,
  ]);

  // =========================
  // ADD NOTIFICATION
  // =========================
  // Untuk sekarang tidak digunakan
  // dari frontend lagi.
  // Notification dibuat oleh backend.

  const addNotification = (
    notification
  ) => {
    setNotifications(
      (currentNotifications) => [
        {
          id:
            Date.now(),
          ...notification,
          isRead: false,
          createdAt:
            new Date().toISOString(),
        },
        ...currentNotifications,
      ]
    );
  };

  // =========================
  // MARK AS READ
  // =========================

  const markAsRead = async (
    notificationId
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
          `${API_BASE_URL}/notifications/${notificationId}/read`,
          {
            method: "PATCH",

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
            "Gagal membaca notifikasi.",
        };
      }

      setNotifications(
        (currentNotifications) =>
          currentNotifications.map(
            (notification) =>
              notification.id ===
              notificationId
                ? {
                    ...notification,
                    isRead: true,
                  }
                : notification
          )
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );

      return {
        success: false,
        message:
          "Tidak dapat terhubung ke server.",
      };
    }
  };

  // =========================
  // MARK ALL AS READ
  // =========================

  const markAllAsRead =
    async () => {
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
            `${API_BASE_URL}/notifications/read-all`,
            {
              method: "PATCH",

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
              "Gagal membaca semua notifikasi.",
          };
        }

        setNotifications(
          (currentNotifications) =>
            currentNotifications.map(
              (notification) => ({
                ...notification,
                isRead: true,
              })
            )
        );

        return {
          success: true,
        };
      } catch (error) {
        console.error(
          "Mark all notifications error:",
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
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,

        addNotification,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context =
    useContext(
      NotificationContext
    );

  if (!context) {
    throw new Error(
      "useNotification harus digunakan di dalam NotificationProvider"
    );
  }

  return context;
}
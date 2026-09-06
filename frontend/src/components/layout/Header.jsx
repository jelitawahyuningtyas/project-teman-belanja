import { useState } from "react";

import {
  Store,
  ShoppingCart,
  ClipboardList,
  Bell,
  UserCircle,
  ChevronDown,
  Pencil,
  LogOut,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import logo from "../../assets/logo/TB-logo.png";
import { categories } from "../../data/categories";

import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

function Header({ role = "customer" }) {
  const navigate = useNavigate();

  const [showCategoryMenu, setShowCategoryMenu] =
    useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [showNotificationMenu, setShowNotificationMenu] =
    useState(false);

  // =========================
  // AUTH
  // =========================
  const {
    currentUser,
    logout,
  } = useAuth();

  const isAdmin = role === "admin";

  // =========================
  // NOTIFICATION
  // =========================
  const {
    notifications,
    markAsRead,
  } = useNotification();

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  // =========================
  // DISPLAY NAME
  // =========================
  const displayName = isAdmin
    ? "Admin"
    : currentUser?.name || "Jelita";

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    setShowProfileMenu(false);
    setShowCategoryMenu(false);
    setShowNotificationMenu(false);

    logout();

    navigate("/login");
  };

  return (
    <header className="relative z-50 w-full border-b border-gray-200 bg-tb-white-primary shadow-sm">
      <div className="flex h-24 w-full items-center px-12">

        {/* =========================
            LOGO
        ========================= */}
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="flex shrink-0 items-center"
        >
          <img
            src={logo}
            alt="TemanBelanja Logo"
            className="w-[100px] object-contain"
          />
        </Link>

        {/* =========================
            NAVIGATION
        ========================= */}
        <nav className="ml-auto flex items-center gap-8">

          {/* =========================
              BERANDA
          ========================= */}
          <Link
            to={isAdmin ? "/admin" : "/"}
            className="
              flex
              shrink-0
              items-center
              gap-2
              whitespace-nowrap
              text-sm
              font-medium
              text-tb-black-primary
              transition-colors
              hover:text-tb-red-primary
            "
          >
            <Store
              size={21}
              strokeWidth={2.2}
            />

            <span>Beranda</span>
          </Link>

          {/* =========================
              KATEGORI
          ========================= */}
          <div className="relative shrink-0">

            <button
              type="button"
              onClick={() => {
                setShowCategoryMenu(
                  !showCategoryMenu
                );

                setShowProfileMenu(false);
                setShowNotificationMenu(false);
              }}
              className="
                flex
                items-center
                gap-2
                whitespace-nowrap
                border-0
                bg-transparent
                p-0
                text-sm
                font-medium
                text-tb-black-primary
                transition-colors
                hover:text-tb-red-primary
              "
            >
              <span className="flex items-center gap-2 whitespace-nowrap">

                <Store
                  size={21}
                  strokeWidth={2.2}
                />

                <span>Kategori</span>

              </span>

              <ChevronDown
                size={15}
                strokeWidth={2.5}
                className={`
                  transition-transform
                  duration-200
                  ${
                    showCategoryMenu
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* =========================
                CATEGORY DROPDOWN
            ========================= */}
            {showCategoryMenu && (
              <div
                className="
                  absolute
                  left-1/2
                  top-[calc(100%+18px)]
                  z-50
                  w-[300px]
                  -translate-x-1/2
                  overflow-hidden
                  border
                  border-gray-200
                  bg-tb-white-primary
                  py-2
                  shadow-lg
                "
              >
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={
                      isAdmin
                        ? "/admin/products"
                        : `/category/${category.slug}`
                    }
                    onClick={() =>
                      setShowCategoryMenu(false)
                    }
                    className="
                      block
                      w-full
                      px-6
                      py-3
                      text-sm
                      font-medium
                      text-tb-black-primary
                      transition-colors
                      hover:bg-tb-yellow-primary
                      hover:text-tb-red-primary
                    "
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

          </div>

          {/* =========================
              CUSTOMER: KERANJANG
          ========================= */}
          {!isAdmin && (
            <Link
              to="/cart"
              className="
                flex
                shrink-0
                items-center
                gap-2
                whitespace-nowrap
                text-sm
                font-medium
                text-tb-black-primary
                transition-colors
                hover:text-tb-red-primary
              "
            >
              <ShoppingCart
                size={22}
                strokeWidth={2.2}
              />

              <span>Keranjang</span>
            </Link>
          )}

          {/* =========================
              CUSTOMER: PESANAN
          ========================= */}
          {!isAdmin && (
            <Link
              to="/orders"
              className="
                flex
                shrink-0
                items-center
                gap-2
                whitespace-nowrap
                text-sm
                font-medium
                text-tb-black-primary
                transition-colors
                hover:text-tb-red-primary
              "
            >
              <ClipboardList
                size={21}
                strokeWidth={2.2}
              />

              <span>Pesanan</span>
            </Link>
          )}

          {/* =========================
              ADMIN: PENJUALAN
          ========================= */}
          {isAdmin && (
            <Link
              to="/admin/orders"
              className="
                flex
                shrink-0
                items-center
                gap-2
                whitespace-nowrap
                text-sm
                font-medium
                text-tb-black-primary
                transition-colors
                hover:text-tb-red-primary
              "
            >
              <ShoppingCart
                size={22}
                strokeWidth={2.2}
              />

              <span>Penjualan</span>
            </Link>
          )}

          {/* =========================
              NOTIFICATION
          ========================= */}
          <div className="relative shrink-0">

            <button
              type="button"
              aria-label="Notifikasi"
              onClick={() => {
                setShowNotificationMenu(
                  !showNotificationMenu
                );

                setShowCategoryMenu(false);
                setShowProfileMenu(false);
              }}
              className="
                relative
                flex
                shrink-0
                items-center
                justify-center
                border-0
                bg-transparent
                p-0
                text-tb-red-primary
                transition-colors
                hover:text-tb-red-secondary
              "
            >
              <Bell
                size={21}
                strokeWidth={2.2}
              />

              {/* UNREAD COUNT */}
              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    -right-2
                    -top-2
                    flex
                    h-4
                    min-w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-tb-red-primary
                    px-1
                    text-[10px]
                    font-semibold
                    leading-none
                    text-white
                  "
                >
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>

            {/* =========================
                NOTIFICATION DROPDOWN
            ========================= */}
            {showNotificationMenu && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+18px)]
                  z-50
                  w-[360px]
                  overflow-hidden
                  rounded-lg
                  border
                  border-gray-200
                  bg-tb-white-primary
                  shadow-lg
                "
              >

                <div
                  className="
                    border-b
                    border-gray-200
                    px-5
                    py-4
                  "
                >
                  <h3 className="text-base font-semibold text-tb-black-primary">
                    Notifikasi
                  </h3>
                </div>

                {notifications.length > 0 ? (
                  <div className="max-h-[400px] overflow-y-auto">

                    {notifications.map(
                      (notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() =>
                            markAsRead(
                              notification.id
                            )
                          }
                          className={`
                            w-full
                            border-b
                            border-gray-100
                            px-5
                            py-4
                            text-left
                            transition-colors
                            hover:bg-gray-50
                            ${
                              notification.isRead
                                ? "bg-white"
                                : "bg-tb-yellow-primary/30"
                            }
                          `}
                        >

                          <div className="flex items-start justify-between gap-3">

                            <p className="text-sm font-semibold text-tb-black-primary">
                              {notification.title}
                            </p>

                            {!notification.isRead && (
                              <span
                                className="
                                  mt-1
                                  h-2
                                  w-2
                                  shrink-0
                                  rounded-full
                                  bg-tb-red-primary
                                "
                              />
                            )}

                          </div>

                          <p className="mt-1 text-xs leading-relaxed text-gray-600">
                            {notification.message}
                          </p>

                          {notification.shippingNumber && (
                            <p className="mt-2 text-xs font-medium text-tb-red-primary">
                              No. Pengiriman:{" "}
                              {
                                notification.shippingNumber
                              }
                            </p>
                          )}

                        </button>
                      )
                    )}

                  </div>
                ) : (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm text-gray-500">
                      Belum ada notifikasi.
                    </p>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* =========================
              PROFILE
          ========================= */}
          <div className="relative shrink-0">

            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(
                  !showProfileMenu
                );

                setShowCategoryMenu(false);
                setShowNotificationMenu(false);
              }}
              className="
                flex
                items-center
                gap-2
                whitespace-nowrap
                border-0
                bg-transparent
                p-0
                text-sm
                font-medium
                text-tb-black-primary
                transition-colors
                hover:text-tb-red-primary
              "
            >

              <UserCircle
                size={22}
                strokeWidth={2.2}
              />

              {/* CUSTOMER = nama user
                  ADMIN = Admin */}
              <span>
                {displayName}
              </span>

              <ChevronDown
                size={15}
                strokeWidth={2.5}
                className={`
                  transition-transform
                  duration-200
                  ${
                    showProfileMenu
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>

            {/* =========================
                PROFILE DROPDOWN
            ========================= */}
            {showProfileMenu && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+18px)]
                  z-50
                  w-40
                  overflow-hidden
                  border
                  border-gray-200
                  bg-tb-white-primary
                  py-2
                  shadow-lg
                "
              >

                {/* EDIT
                    hanya customer */}
                {!isAdmin && (
                  <Link
                    to="/profile"
                    onClick={() =>
                      setShowProfileMenu(false)
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-5
                      py-3
                      text-left
                      text-sm
                      font-medium
                      text-tb-black-primary
                      transition-colors
                      hover:bg-tb-yellow-primary
                      hover:text-tb-red-primary
                    "
                  >
                    <Pencil
                      size={19}
                      strokeWidth={2.2}
                    />

                    <span>Edit</span>
                  </Link>
                )}

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-5
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-tb-black-primary
                    transition-colors
                    hover:bg-tb-yellow-primary
                    hover:text-tb-red-primary
                  "
                >
                  <LogOut
                    size={19}
                    strokeWidth={2.2}
                  />

                  <span>Log Out</span>
                </button>

              </div>
            )}

          </div>

        </nav>

      </div>
    </header>
  );
}

export default Header;
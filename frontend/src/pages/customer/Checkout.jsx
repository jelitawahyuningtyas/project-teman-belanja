import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  MapPin,
  User,
  Phone,
  FileText,
  Calendar,
} from "lucide-react";

import { useOrder } from "../../context/OrderContext";
import { useProduct } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";

import PaymentNotification from "../../components/payment/PaymentNotification";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { createOrder } = useOrder();
  const { products } = useProduct();
  const { removeItemsFromCart } = useCart();

  const checkoutData = location.state;

  const [notification, setNotification] =
    useState(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =========================
  // DATA CHECKOUT TIDAK ADA
  // =========================

  if (!checkoutData) {
    return (
      <main className="px-10 py-20">
        <div className="text-center">

          <h1 className="text-2xl font-semibold text-tb-black-primary">
            Data Checkout Tidak Ditemukan
          </h1>

          <p className="mt-3 text-gray-500">
            Silakan kembali ke keranjang dan lakukan checkout
            kembali.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/cart")
            }
            className="
              mt-6
              rounded-lg
              bg-tb-red-primary
              px-6
              py-2
              font-semibold
              text-white
              transition-colors
              hover:bg-tb-red-secondary
            "
          >
            Kembali ke Keranjang
          </button>

        </div>
      </main>
    );
  }

  const {
    selectedItems,
    selectedAddress,
    paymentMethod,
    totalBelanja,
  } = checkoutData;

  // =========================
  // TOTAL CHECK
  // =========================

  const hasCheckoutItems =
    Array.isArray(selectedItems) &&
    selectedItems.length > 0;

  // =========================
  // PAY NOW
  // =========================

  const handlePayNow = async () => {
    if (isSubmitting) {
      return;
    }

    // =========================
    // VALIDATION
    // =========================

    if (!hasCheckoutItems) {
      alert(
        "Tidak ada produk yang akan dibeli."
      );

      navigate("/cart");
      return;
    }

    if (!selectedAddress?.id) {
      alert(
        "Alamat pengantaran belum dipilih."
      );

      navigate("/cart");
      return;
    }

    if (
      paymentMethod !== "qris" &&
      paymentMethod !== "cod"
    ) {
      alert(
        "Metode pembayaran tidak valid."
      );

      return;
    }

    // =========================
    // CREATE ORDER
    // =========================

    try {
      setIsSubmitting(true);

      const result =
        await createOrder({
          items: selectedItems.map(
            (item) => ({
              productId:
                item.productId,

              quantity:
                item.quantity,
            })
          ),

          addressId:
            selectedAddress.id,

          // Backend menggunakan enum:
          // QRIS / COD
          paymentMethod:
            paymentMethod.toUpperCase(),
        });

      // =========================
      // CREATE ORDER FAILED
      // =========================

      if (!result.success) {
        alert(
          result.message ||
            "Gagal membuat pesanan."
        );

        return;
      }

      const createdOrder =
        result.data;

      // =========================
      // REMOVE FROM CART
      // =========================

      removeItemsFromCart(
        selectedItems.map(
          (item) =>
            item.productId
        )
      );

      // =========================
      // QRIS
      // =========================

      if (
        paymentMethod === "qris"
      ) {
        navigate(
          "/payment/qris",
          {
            state: {
              selectedItems,
              selectedAddress,
              paymentMethod,
              totalBelanja:
                createdOrder.total,

              // ID dari backend
              orderNumber:
                createdOrder.id,

              // Tanggal dari backend
              orderDate:
                createdOrder.date,

              order:
                createdOrder,
            },
          }
        );

        return;
      }

      // =========================
      // COD
      // =========================

      if (
        paymentMethod === "cod"
      ) {
        setNotification("success");
      }
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      alert(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // GET PRODUCT
  // =========================

  const getProduct = (
    productId
  ) => {
    return products.find(
      (item) =>
        item.id === productId
    );
  };

  // =========================
  // ORDER DATE
  // =========================

  const createdOrderDate =
    null;

  return (
    <main className="px-10 py-12">
      <section className="mx-auto max-w-[900px]">

        {/* =========================
            TITLE
        ========================= */}
        <h1 className="mb-10 text-center text-3xl font-semibold text-tb-black-primary">
          Tagihan Pembayaran
        </h1>

        {/* =========================
            CHECKOUT CARD
        ========================= */}
        <div className="rounded-xl border border-gray-200 bg-white p-10 shadow-md">

          {/* =========================
              BARANG YANG DIBELI
          ========================= */}
          <section>

            <h2 className="text-lg font-semibold text-tb-black-primary">
              Barang yang Dibeli
            </h2>

            <div className="mt-6 space-y-6">

              {selectedItems.map(
                (cartItem) => {
                  const product =
                    getProduct(
                      cartItem.productId
                    );

                  if (!product) {
                    return null;
                  }

                  const itemTotal =
                    product.price *
                    cartItem.quantity;

                  return (
                    <div
                      key={
                        cartItem.productId
                      }
                      className="flex items-center gap-5"
                    >

                      {/* Quantity */}
                      <span className="w-8 text-base text-tb-black-primary">
                        {cartItem.quantity}
                      </span>

                      {/* Product Image */}
                      <div className="flex h-[70px] w-[90px] shrink-0 items-center justify-center">
                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">

                        <p className="text-base font-medium text-tb-black-primary">
                          {product.name}
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                          Rp
                          {product.price.toLocaleString(
                            "id-ID"
                          )}{" "}
                          ×{" "}
                          {
                            cartItem.quantity
                          }
                        </p>

                      </div>

                      {/* Item Total */}
                      <span className="text-base font-medium text-tb-black-primary">
                        Rp
                        {itemTotal.toLocaleString(
                          "id-ID"
                        )}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </section>

          {/* =========================
              PENERIMA
          ========================= */}
          <section className="mt-12">

            <h2 className="text-lg font-semibold text-tb-black-primary">
              Penerima
            </h2>

            <div className="mt-5 space-y-3">

              <div className="flex items-start gap-3">

                <MapPin
                  size={19}
                  strokeWidth={2.2}
                  className="mt-1 text-tb-red-primary"
                />

                <span>
                  {selectedAddress.label}
                </span>

              </div>

              <div className="flex items-center gap-3">

                <User
                  size={19}
                  strokeWidth={2.2}
                  className="text-tb-red-primary"
                />

                <span>
                  {
                    selectedAddress.recipientName
                  }
                </span>

              </div>

              <div className="flex items-center gap-3">

                <Phone
                  size={19}
                  strokeWidth={2.2}
                  className="text-tb-red-primary"
                />

                <span>
                  {selectedAddress.phone}
                </span>

              </div>

              <div className="flex items-start gap-3">

                <MapPin
                  size={19}
                  strokeWidth={2.2}
                  className="mt-1 text-tb-red-primary"
                />

                <span className="leading-relaxed">
                  {
                    selectedAddress.address
                  }
                </span>

              </div>

            </div>

          </section>

          {/* =========================
              PENGIRIMAN
          ========================= */}
          <section className="mt-12">

            <h2 className="text-lg font-semibold text-tb-black-primary">
              Pengiriman
            </h2>

            <div className="mt-5 space-y-4">

              <div className="flex items-center gap-3">

                <FileText
                  size={19}
                  strokeWidth={2.2}
                  className="text-tb-red-primary"
                />

                <span>
                  Nomor Pesanan:{" "}
                  <span className="font-medium">
                    Akan dibuat saat pesanan dikonfirmasi
                  </span>
                </span>

              </div>

              <div className="flex items-center gap-3">

                <Calendar
                  size={19}
                  strokeWidth={2.2}
                  className="text-tb-red-primary"
                />

                <span>
                  Tanggal Dibuat:{" "}
                  <span className="font-medium">
                    Akan dibuat saat pesanan dikonfirmasi
                  </span>
                </span>

              </div>

            </div>

          </section>

          {/* =========================
              TOTAL
          ========================= */}
          <div className="mt-10 border-y border-gray-300 py-5">

            <div className="flex items-center justify-between">

              <span className="font-semibold text-tb-black-primary">
                Total Pembayaran
              </span>

              <span className="text-lg font-semibold text-tb-red-primary">
                Rp
                {Number(
                  totalBelanja || 0
                ).toLocaleString(
                  "id-ID"
                )}
              </span>

            </div>

            <p className="mt-2 text-sm text-gray-500">
              Metode pembayaran:{" "}
              {paymentMethod ===
              "qris"
                ? "QRIS"
                : "COD"}
            </p>

          </div>

          {/* =========================
              BAYAR SEKARANG
          ========================= */}
          <div className="mt-8 flex justify-center">

            <button
              type="button"
              onClick={handlePayNow}
              disabled={isSubmitting}
              className="
                rounded-lg
                bg-tb-red-primary
                px-10
                py-3
                text-base
                font-semibold
                text-white
                transition-colors
                hover:bg-tb-red-secondary
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isSubmitting
                ? "Memproses..."
                : "Bayar Sekarang"}
            </button>

          </div>

        </div>

      </section>

      {/* =========================
          COD SUCCESS NOTIFICATION
      ========================= */}
      {notification ===
        "success" && (
        <PaymentNotification
          type="success"
          title="Pesanan Berhasil Dibuat"
          message="Pesananmu berhasil dibuat dan akan segera diproses."
          primaryLabel="Lihat Pesanan"
          secondaryLabel="Kembali ke Beranda"
          onPrimary={() =>
            navigate("/orders")
          }
          onSecondary={() =>
            navigate("/")
          }
        />
      )}

    </main>
  );
}

export default Checkout;
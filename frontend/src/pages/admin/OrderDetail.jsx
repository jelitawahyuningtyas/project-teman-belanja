import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  MapPin,
  User,
  Phone,
  FileText,
  Calendar,
} from "lucide-react";

import { useOrder } from "../../context/OrderContext";

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN;

function OrderDetail() {
  const { orderId } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const {
    orders,
    updateOrderStatus,
    loading,
    error,
  } = useOrder();

  // =========================
  // FIND ORDER
  // =========================

  const contextOrder = orders.find(
    (item) => item.id === orderId
  );

  // Fallback dari state navigasi
  // ketika masuk melalui Admin Orders
  const stateOrder =
    location.state?.order;

  const order =
    contextOrder ||
    stateOrder;

  // =========================
  // LOADING
  // =========================

  if (loading && !order) {
    return (
      <main className="px-10 py-12">
        <section className="mx-auto max-w-[900px] text-center">

          <h1 className="text-2xl font-semibold text-tb-black-primary">
            Detail Pesanan
          </h1>

          <p className="mt-3 text-gray-500">
            Memuat data pesanan...
          </p>

        </section>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error && !order) {
    return (
      <main className="px-10 py-12">
        <section className="mx-auto max-w-[900px] text-center">

          <h1 className="text-2xl font-semibold text-tb-black-primary">
            Gagal Memuat Pesanan
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/orders")
            }
            className="
              mt-6
              rounded-full
              bg-tb-red-primary
              px-6
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-tb-red-secondary
            "
          >
            Kembali ke Penjualan
          </button>

        </section>
      </main>
    );
  }

  // =========================
  // ORDER NOT FOUND
  // =========================

  if (!order) {
    return (
      <main className="px-10 py-12">
        <section className="mx-auto max-w-[900px] text-center">

          <h1 className="text-2xl font-semibold text-tb-black-primary">
            Pesanan Tidak Ditemukan
          </h1>

          <p className="mt-3 text-gray-500">
            Data pesanan yang kamu cari tidak tersedia.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/orders")
            }
            className="
              mt-6
              rounded-full
              bg-tb-red-primary
              px-6
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-tb-red-secondary
            "
          >
            Kembali ke Penjualan
          </button>

        </section>
      </main>
    );
  }

  // =========================
  // CURRENT STATUS
  // =========================

  const currentStatus =
    order.orderStatus || "Dikemas";

  // =========================
  // NEXT STATUS
  // =========================

  const getNextStatus = () => {
    if (
      currentStatus ===
      "Dikemas"
    ) {
      return "Dikirim";
    }

    if (
      currentStatus ===
      "Dikirim"
    ) {
      return "Diterima";
    }

    return null;
  };

  const nextStatus =
    getNextStatus();

  // =========================
  // UPDATE STATUS
  // =========================

  const handleUpdateStatus =
    async () => {
      if (!nextStatus) {
        return;
      }

      const result =
        await updateOrderStatus(
          order.id,
          nextStatus
        );

      if (!result.success) {
        window.alert(
          result.message ||
            "Gagal memperbarui status pesanan."
        );

        return;
      }
    };

  return (
    <main className="px-10 py-12">
      <section className="mx-auto max-w-[900px]">

        {/* =========================
            TITLE
        ========================= */}
        <h1 className="mb-10 text-center text-3xl font-semibold text-tb-black-primary">
          Detail Pesanan
        </h1>

        {/* =========================
            MAIN CARD
        ========================= */}
        <div
          className="
            rounded-xl
            bg-white
            p-10
            shadow-[0_4px_20px_rgba(0,0,0,0.08)]
          "
        >

          {/* =========================
              HEADER ORDER
          ========================= */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-5">

            <div>
              <p className="text-sm text-gray-500">
                Nomor Pesanan
              </p>

              <p className="mt-1 font-semibold text-tb-black-primary">
                {order.id}
              </p>
            </div>

            {/* STATUS */}
            <span
              className={`
                rounded-full
                px-5
                py-2
                text-sm
                font-semibold
                ${
                  currentStatus ===
                  "Diterima"
                    ? "bg-green-100 text-green-700"
                    : currentStatus ===
                      "Dikirim"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }
              `}
            >
              {currentStatus}
            </span>

          </div>

          {/* =========================
              BARANG YANG DIBELI
          ========================= */}
          <section className="mt-10">

            <h2 className="text-lg font-semibold text-tb-black-primary">
              Barang yang Dibeli
            </h2>

            <div className="mt-6 space-y-5">

              {order.items?.map(
                (orderItem) => {
                  const product =
                    orderItem.product;

                  if (!product) {
                    return null;
                  }

                  // Harga saat transaksi
                  const itemPrice =
                    Number(
                      orderItem.price || 0
                    );

                  const itemTotal =
                    itemPrice *
                    orderItem.quantity;

                  return (
                    <div
                      key={
                        orderItem.id ??
                        `${order.id}-${orderItem.productId}`
                      }
                      className="
                        flex
                        items-center
                        gap-5
                        border-b
                        border-gray-100
                        pb-5
                      "
                    >

                      {/* IMAGE */}
                      <div
                        className="
                          flex
                          h-[80px]
                          w-[90px]
                          shrink-0
                          items-center
                          justify-center
                        "
                      >
                        <img
                          src={
                            product.image
                              ? product.image.startsWith(
                                  "http"
                                )
                                ? product.image
                                : `${API_ORIGIN}${product.image}`
                              : ""
                          }
                          alt={
                            product.name
                          }
                          className="
                            h-full
                            w-full
                            object-contain
                          "
                        />
                      </div>

                      {/* PRODUCT INFO */}
                      <div className="flex-1">

                        <p className="font-medium text-tb-black-primary">
                          {product.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Rp
                          {itemPrice.toLocaleString(
                            "id-ID"
                          )}{" "}
                          ×{" "}
                          {
                            orderItem.quantity
                          }
                        </p>

                      </div>

                      {/* ITEM TOTAL */}
                      <p className="font-semibold text-tb-black-primary">
                        Rp
                        {itemTotal.toLocaleString(
                          "id-ID"
                        )}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </section>

          {/* =========================
              PENERIMA
          ========================= */}
          <section className="mt-10">

            <h2 className="text-lg font-semibold text-tb-black-primary">
              Penerima
            </h2>

            <div className="mt-5 space-y-4">

              {/* LABEL */}
              <div className="flex items-start gap-3">

                <MapPin
                  size={19}
                  strokeWidth={2.2}
                  className="
                    mt-1
                    shrink-0
                    text-tb-red-primary
                  "
                />

                <span>
                  {order.address?.label}
                </span>

              </div>

              {/* NAME */}
              <div className="flex items-center gap-3">

                <User
                  size={19}
                  strokeWidth={2.2}
                  className="text-tb-red-primary"
                />

                <span>
                  {
                    order.address
                      ?.recipientName
                  }
                </span>

              </div>

              {/* PHONE */}
              <div className="flex items-center gap-3">

                <Phone
                  size={19}
                  strokeWidth={2.2}
                  className="text-tb-red-primary"
                />

                <span>
                  {order.address?.phone}
                </span>

              </div>

              {/* ADDRESS */}
              <div className="flex items-start gap-3">

                <MapPin
                  size={19}
                  strokeWidth={2.2}
                  className="
                    mt-1
                    shrink-0
                    text-tb-red-primary
                  "
                />

                <span className="leading-relaxed">
                  {order.address?.address}
                </span>

              </div>

            </div>

          </section>

          {/* =========================
              PENGIRIMAN
          ========================= */}
          <section className="mt-10">

            <h2 className="text-lg font-semibold text-tb-black-primary">
              Pengiriman
            </h2>

            <div className="mt-5 space-y-4">

              {/* NOMOR PESANAN */}
              <div className="flex items-center gap-3">

                <FileText
                  size={19}
                  strokeWidth={2.2}
                  className="text-tb-red-primary"
                />

                <span>
                  Nomor Pesanan:{" "}
                  <span className="font-medium">
                    {order.id}
                  </span>
                </span>

              </div>

              {/* TANGGAL */}
              <div className="flex items-center gap-3">

                <Calendar
                  size={19}
                  strokeWidth={2.2}
                  className="text-tb-red-primary"
                />

                <span>
                  Tanggal Dibuat:{" "}
                  <span className="font-medium">
                    {order.date ||
                      (order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month:
                                "long",
                              year: "numeric",
                            }
                          )
                        : "-")}
                  </span>
                </span>

              </div>

              {/* NOMOR PENGIRIMAN */}
              {order.shippingNumber && (
                <div className="flex items-center gap-3">

                  <FileText
                    size={19}
                    strokeWidth={2.2}
                    className="text-tb-red-primary"
                  />

                  <span>
                    Nomor Pengiriman:{" "}
                    <span className="font-medium">
                      {
                        order.shippingNumber
                      }
                    </span>
                  </span>

                </div>
              )}

            </div>

          </section>

          {/* =========================
              TOTAL
          ========================= */}
          <section className="mt-10 border-y border-gray-200 py-5">

            <div className="flex items-center justify-between">

              <span className="font-semibold text-tb-black-primary">
                Total Pembayaran
              </span>

              <span className="text-lg font-semibold text-tb-red-primary">
                Rp
                {Number(
                  order.total || 0
                ).toLocaleString(
                  "id-ID"
                )}
              </span>

            </div>

            <p className="mt-2 text-sm text-gray-500">
              Metode pembayaran:{" "}
              {order.paymentMethod}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Status pembayaran:{" "}
              {order.paymentStatus}
            </p>

          </section>

          {/* =========================
              ACTION
          ========================= */}
          <div className="mt-8 flex justify-center">

            {currentStatus ===
              "Dikemas" && (
              <button
                type="button"
                onClick={
                  handleUpdateStatus
                }
                className="
                  rounded-full
                  bg-tb-red-primary
                  px-10
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-tb-red-secondary
                "
              >
                Kirim Barang
              </button>
            )}

            {currentStatus ===
              "Dikirim" && (
              <button
                type="button"
                onClick={
                  handleUpdateStatus
                }
                className="
                  rounded-full
                  bg-tb-red-primary
                  px-10
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-tb-red-secondary
                "
              >
                Tandai Telah Selesai
              </button>
            )}

          </div>

        </div>

      </section>
    </main>
  );
}

export default OrderDetail;
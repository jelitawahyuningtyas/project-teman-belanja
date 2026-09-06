import { useOrder } from "../../context/OrderContext";

const API_BASE_URL = 
  import.meta.env.VITE_API_URL;

function Orders() {
  const {
    orders,
    loading,
    error,
  } = useOrder();

  // =========================
  // PRODUCT IMAGE
  // =========================
  const getProductImage = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="px-10 py-12">
        <section className="mx-auto max-w-[1100px]">
          <h1 className="mb-10 text-center text-3xl font-semibold text-tb-black-primary">
            Pesanan Saya
          </h1>

          <p className="py-20 text-center text-gray-500">
            Memuat pesanan...
          </p>
        </section>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <main className="px-10 py-12">
        <section className="mx-auto max-w-[1100px]">
          <h1 className="mb-10 text-center text-3xl font-semibold text-tb-black-primary">
            Pesanan Saya
          </h1>

          <p className="py-20 text-center text-gray-500">
            {error}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="px-10 py-12">
      <section className="mx-auto max-w-[1100px]">

        {/* =========================
            TITLE
        ========================= */}
        <h1 className="mb-10 text-center text-3xl font-semibold text-tb-black-primary">
          Pesanan Saya
        </h1>

        {/* =========================
            EMPTY STATE
        ========================= */}
        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500">
              Belum ada pesanan.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order.id}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >

                {/* =========================
                    ORDER HEADER
                ========================= */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Nomor Pesanan
                    </p>

                    <p className="mt-1 font-semibold text-tb-black-primary">
                      {order.id}
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="text-sm text-gray-500">
                      Status Pesanan
                    </p>

                    <span
                      className={`
                        mt-1
                        inline-block
                        rounded-full
                        px-4
                        py-1
                        text-sm
                        font-semibold
                        ${
                          order.orderStatus ===
                          "Diterima"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus ===
                              "Dikirim"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-tb-yellow-primary text-tb-red-primary"
                        }
                      `}
                    >
                      {order.orderStatus ||
                        "Dikemas"}
                    </span>

                  </div>

                </div>

                {/* =========================
                    ORDER ITEMS
                ========================= */}
                <div className="mt-5 space-y-4">

                  {order.items?.map(
                    (orderItem) => {
                      const product =
                        orderItem.product;

                      if (!product) {
                        return null;
                      }

                      // Harga snapshot
                      // saat order dibuat
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
                          className="flex items-center gap-4"
                        >

                          {/* Quantity */}
                          <span className="w-8 text-sm text-gray-500">
                            {orderItem.quantity}×
                          </span>

                          {/* Product Image */}
                          <div className="flex h-[60px] w-[70px] shrink-0 items-center justify-center">
                            <img
                              src={getProductImage(
                                product.image
                              )}
                              alt={
                                product.name
                              }
                              className="h-full w-full object-contain"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">

                            <p className="text-sm font-medium text-tb-black-primary">
                              {product.name}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Rp
                              {itemPrice.toLocaleString(
                                "id-ID"
                              )}{" "}
                              ×{" "}
                              {orderItem.quantity}
                            </p>

                          </div>

                          {/* Item Total */}
                          <span className="text-sm font-semibold text-tb-black-primary">
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

                {/* =========================
                    ORDER INFO
                ========================= */}
                <div className="mt-6 border-t border-gray-200 pt-5">

                  {/* PAYMENT METHOD */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Metode Pembayaran
                    </span>

                    <span className="text-sm font-medium text-tb-black-primary">
                      {order.paymentMethod}
                    </span>
                  </div>

                  {/* PAYMENT STATUS */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Status Pembayaran
                    </span>

                    <span className="text-sm font-medium text-tb-black-primary">
                      {order.paymentStatus}
                    </span>
                  </div>

                  {/* DATE */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Tanggal Pesanan
                    </span>

                    <span className="text-sm font-medium text-tb-black-primary">
                      {order.date}
                    </span>
                  </div>

                  {/* SHIPPING NUMBER */}
                  {order.shippingNumber && (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Nomor Pengiriman
                      </span>

                      <span className="text-sm font-medium text-tb-black-primary">
                        {order.shippingNumber}
                      </span>
                    </div>
                  )}

                  {/* TOTAL */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold text-tb-black-primary">
                      Total
                    </span>

                    <span className="font-semibold text-tb-red-primary">
                      Rp
                      {Number(
                        order.total || 0
                      ).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>
    </main>
  );
}

export default Orders;
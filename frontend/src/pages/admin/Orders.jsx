import { useMemo, useState } from "react";
import { Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useOrder } from "../../context/OrderContext";
import { categories } from "../../data/categories";

function Orders() {
  const navigate = useNavigate();

  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    loading,
    error,
  } = useOrder();

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  // =========================
  // STATUS FLOW
  // =========================

  const statusFlow = [
    "Dikemas",
    "Dikirim",
    "Diterima",
  ];

  // =========================
  // AVAILABLE STATUS
  // =========================

  const getAvailableStatuses = (
    status
  ) => {
    const currentIndex =
      statusFlow.indexOf(status);

    if (currentIndex === -1) {
      return statusFlow;
    }

    return statusFlow.slice(
      currentIndex
    );
  };

  // =========================
  // FILTER ORDER
  // =========================

  const filteredOrders = useMemo(() => {
    if (selectedCategory === "all") {
      return orders;
    }

    const categoryId =
      Number(selectedCategory);

    return orders.filter((order) =>
      order.items?.some(
        (item) =>
          item.product?.categoryId ===
          categoryId
      )
    );
  }, [
    orders,
    selectedCategory,
  ]);

  // =========================
  // PRODUCT SUMMARY
  // =========================

  const getProductSummary = (order) => {
    if (!order.items?.length) {
      return "-";
    }

    const orderItems =
      order.items.filter(
        (item) => item.product
      );

    if (orderItems.length === 0) {
      return "-";
    }

    if (orderItems.length === 1) {
      const item = orderItems[0];

      return `${item.product.name} ×${item.quantity}`;
    }

    const firstItem =
      orderItems[0];

    return `${firstItem.product.name} ×${firstItem.quantity} + ${
      orderItems.length - 1
    } produk lainnya`;
  };

  // =========================
  // BUYER
  // =========================

  const getBuyerName = (order) => {
    return (
      order.address?.recipientName ||
      order.user?.name ||
      "Customer"
    );
  };

  // =========================
  // CHANGE STATUS
  // =========================

  const handleStatusChange = async (
    order,
    newStatus
  ) => {
    if (
      newStatus ===
      order.orderStatus
    ) {
      return;
    }

    const result =
      await updateOrderStatus(
        order.id,
        newStatus
      );

    if (!result.success) {
      window.alert(
        result.message
      );
    }
  };

  // =========================
  // DELETE ORDER
  // =========================

  const handleDelete = async (
    order
  ) => {
    const confirmed =
      window.confirm(
        `Hapus pesanan ${order.id}?`
      );

    if (!confirmed) {
      return;
    }

    const result =
      await deleteOrder(order.id);

    if (!result.success) {
      window.alert(
        result.message
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="px-10 py-12">
        <section className="mx-auto max-w-[1100px]">

          <h1 className="text-3xl font-normal text-tb-black-primary">
            Produk yang{" "}
            <span className="text-tb-red-primary">
              Terjual
            </span>
          </h1>

          <div className="mt-10 rounded-xl bg-white px-6 py-20 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <p className="text-gray-500">
              Memuat pesanan...
            </p>
          </div>

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

          <h1 className="text-3xl font-normal text-tb-black-primary">
            Produk yang{" "}
            <span className="text-tb-red-primary">
              Terjual
            </span>
          </h1>

          <div className="mt-10 rounded-xl bg-white px-6 py-20 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <p className="text-gray-500">
              {error}
            </p>
          </div>

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
        <h1 className="text-3xl font-normal text-tb-black-primary">
          Produk yang{" "}
          <span className="text-tb-red-primary">
            Terjual
          </span>
        </h1>

        {/* =========================
            CATEGORY FILTER
        ========================= */}
        <div className="mt-8 flex flex-wrap gap-3">

          {/* SEMUA */}
          <button
            type="button"
            onClick={() =>
              setSelectedCategory(
                "all"
              )
            }
            className={`
              rounded-full
              px-5
              py-2
              text-sm
              font-medium
              transition-colors
              ${
                selectedCategory ===
                "all"
                  ? "bg-tb-red-primary text-white"
                  : "border border-tb-red-primary text-tb-red-primary hover:bg-tb-red-primary hover:text-white"
              }
            `}
          >
            Semua
          </button>

          {/* CATEGORY */}
          {categories.map(
            (category) => (
              <button
                type="button"
                key={category.id}
                onClick={() =>
                  setSelectedCategory(
                    String(category.id)
                  )
                }
                className={`
                  rounded-full
                  px-5
                  py-2
                  text-sm
                  font-medium
                  transition-colors
                  ${
                    selectedCategory ===
                    String(category.id)
                      ? "bg-tb-red-primary text-white"
                      : "border border-tb-red-primary text-tb-red-primary hover:bg-tb-red-primary hover:text-white"
                  }
                `}
              >
                {category.name}
              </button>
            )
          )}

        </div>

        {/* =========================
            TABLE
        ========================= */}
        <div
          className="
            mt-10
            overflow-hidden
            rounded-xl
            bg-white
            shadow-[0_4px_20px_rgba(0,0,0,0.08)]
          "
        >

          {filteredOrders.length >
          0 ? (
            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>
                  <tr className="border-b border-gray-200 text-left">

                    <th className="px-5 py-5 text-sm font-semibold">
                      No
                    </th>

                    <th className="px-5 py-5 text-sm font-semibold">
                      Nama Produk
                    </th>

                    <th className="px-5 py-5 text-sm font-semibold">
                      Nomor Pesanan
                    </th>

                    <th className="px-5 py-5 text-sm font-semibold">
                      Nama Pembeli
                    </th>

                    <th className="px-5 py-5 text-sm font-semibold">
                      Total
                    </th>

                    <th className="px-5 py-5 text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-5 text-sm font-semibold">
                      Aksi
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredOrders.map(
                    (order, index) => {

                      const currentStatus =
                        order.orderStatus ||
                        "Dikemas";

                      const availableStatuses =
                        getAvailableStatuses(
                          currentStatus
                        );

                      return (
                        <tr
                          key={
                            order.id
                          }
                          className="
                            border-b
                            border-gray-100
                            last:border-b-0
                          "
                        >

                          {/* =========================
                              NO
                          ========================= */}
                          <td className="px-5 py-6 text-sm">
                            {index + 1}
                          </td>

                          {/* =========================
                              PRODUCT
                          ========================= */}
                          <td className="max-w-[230px] px-5 py-6 text-sm">
                            {getProductSummary(
                              order
                            )}
                          </td>

                          {/* =========================
                              ORDER ID
                          ========================= */}
                          <td className="px-5 py-6 text-sm font-medium">
                            {order.id}
                          </td>

                          {/* =========================
                              BUYER
                          ========================= */}
                          <td className="px-5 py-6 text-sm">
                            {getBuyerName(
                              order
                            )}
                          </td>

                          {/* =========================
                              TOTAL
                          ========================= */}
                          <td className="px-5 py-6 text-sm font-semibold text-tb-red-primary">
                            Rp
                            {Number(
                              order.total ||
                                0
                            ).toLocaleString(
                              "id-ID"
                            )}
                          </td>

                          {/* =========================
                              STATUS
                          ========================= */}
                          <td className="px-5 py-6">

                            <select
                              value={
                                currentStatus
                              }
                              onChange={(
                                event
                              ) =>
                                handleStatusChange(
                                  order,
                                  event
                                    .target
                                    .value
                                )
                              }
                              disabled={
                                currentStatus ===
                                "Diterima"
                              }
                              className={`
                                rounded-full
                                border
                                px-4
                                py-1.5
                                text-xs
                                font-medium
                                outline-none
                                ${
                                  currentStatus ===
                                  "Diterima"
                                    ? "border-green-400 bg-green-50 text-green-700"
                                    : currentStatus ===
                                      "Dikirim"
                                    ? "border-blue-400 bg-blue-50 text-blue-700"
                                    : "border-yellow-400 bg-yellow-50 text-yellow-700"
                                }
                              `}
                            >

                              {availableStatuses.map(
                                (
                                  status
                                ) => (
                                  <option
                                    key={
                                      status
                                    }
                                    value={
                                      status
                                    }
                                  >
                                    {status}
                                  </option>
                                )
                              )}

                            </select>

                          </td>

                          {/* =========================
                              ACTION
                          ========================= */}
                          <td className="px-5 py-6">

                            <div className="flex items-center gap-2">

                              {/* DETAIL */}
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/admin/orders/${order.id}`,
                                    {
                                      state: {
                                        order,
                                      },
                                    }
                                  )
                                }
                                aria-label="Kelola pesanan"
                                className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-md
                                  bg-blue-600
                                  text-white
                                  transition-colors
                                  hover:bg-blue-700
                                "
                              >
                                <Settings
                                  size={17}
                                  strokeWidth={2.2}
                                />
                              </button>

                              {/* DELETE */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    order
                                  )
                                }
                                aria-label="Hapus pesanan"
                                className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-md
                                  bg-tb-red-primary
                                  text-white
                                  transition-colors
                                  hover:bg-tb-red-secondary
                                "
                              >
                                <Trash2
                                  size={17}
                                  strokeWidth={2.2}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="px-6 py-20 text-center">
              <p className="text-gray-500">
                Belum ada pesanan.
              </p>
            </div>
          )}

        </div>

      </section>
    </main>
  );
}

export default Orders;
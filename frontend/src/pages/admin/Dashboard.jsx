import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  CreditCard,
  ShoppingBag,
  UserRound,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;


function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =
    useState({
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      bestSellingProducts: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // FETCH DASHBOARD
  // =========================

  useEffect(() => {
    const fetchDashboard =
      async () => {
        const token =
          localStorage.getItem(
            "temanbelanja_token"
          );

        if (!token) {
          setError(
            "Sesi login tidak ditemukan."
          );

          setLoading(false);

          return;
        }

        try {
          const response =
            await fetch(
              `${API_BASE_URL}/dashboard`,
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
                "Gagal mengambil data dashboard."
            );
          }

          setDashboardData(
            data.data
          );
        } catch (error) {
          console.error(
            "Fetch dashboard error:",
            error
          );

          setError(
            error.message ||
              "Gagal mengambil data dashboard."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboard();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="px-10 py-12">
        <section className="mx-auto max-w-[1100px]">

          <h1 className="text-3xl font-normal text-tb-black-primary">
            Dashboard Tim{" "}
            <span className="text-tb-red-primary">
              TemanBelanja
            </span>
          </h1>

          <div className="mt-10 py-20 text-center">
            <p className="text-gray-500">
              Memuat dashboard...
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
            Dashboard Tim{" "}
            <span className="text-tb-red-primary">
              TemanBelanja
            </span>
          </h1>

          <div className="mt-10 py-20 text-center">
            <p className="text-tb-red-primary">
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
            HEADER
        ========================= */}
        <div className="flex items-center justify-between">

          <h1 className="text-3xl font-normal text-tb-black-primary">
            Dashboard Tim{" "}
            <span className="text-tb-red-primary">
              TemanBelanja
            </span>
          </h1>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/products/create"
              )
            }
            className="
              rounded-full
              bg-tb-yellow-primary
              px-7
              py-2.5
              text-sm
              font-semibold
              text-tb-red-primary
              transition-transform
              duration-200
              hover:scale-105
            "
          >
            + Buat Produk
          </button>

        </div>

        {/* =========================
            STAT CARDS
        ========================= */}
        <div className="mt-10 grid grid-cols-3 gap-5">

          {/* TOTAL PENDAPATAN */}
          <div
            className="
              rounded-xl
              border
              border-[#E8A400]
              bg-[#FFF9EA]
              px-6
              py-5
            "
          >

            <h2 className="text-center text-xl font-semibold text-blue-700">
              Total Pendapatan
            </h2>

            <div className="mt-4 flex items-center justify-center gap-3 rounded-lg border border-[#E8A400] px-4 py-5">

              <CreditCard
                size={30}
                strokeWidth={2.3}
                className="text-tb-red-primary"
              />

              <span className="text-3xl font-semibold text-tb-black-primary">
                Rp
                {Number(
                  dashboardData.totalRevenue
                ).toLocaleString(
                  "id-ID"
                )}
              </span>

            </div>

          </div>

          {/* TOTAL PESANAN */}
          <div
            className="
              rounded-xl
              border
              border-[#E8A400]
              bg-[#FFF9EA]
              px-6
              py-5
            "
          >

            <h2 className="text-center text-xl font-semibold text-blue-700">
              Total Pesanan
            </h2>

            <div className="mx-auto mt-4 flex w-[155px] flex-col items-center justify-center rounded-lg border border-[#E8A400] px-4 py-4">

              <div className="flex items-center gap-3">

                <ShoppingBag
                  size={34}
                  strokeWidth={2}
                  className="text-[#E8A400]"
                />

                <span className="text-4xl font-semibold text-tb-black-primary">
                  {
                    dashboardData.totalOrders
                  }
                </span>

              </div>

              <span className="text-xs text-tb-black-primary">
                Pesanan
              </span>

            </div>

          </div>

          {/* TOTAL CUSTOMER */}
          <div
            className="
              rounded-xl
              border
              border-[#E8A400]
              bg-[#FFF9EA]
              px-6
              py-5
            "
          >

            <h2 className="text-center text-xl font-semibold text-blue-700">
              Total Customer
            </h2>

            <div className="mx-auto mt-4 flex w-[155px] flex-col items-center justify-center rounded-lg border border-[#E8A400] px-4 py-4">

              <div className="flex items-center gap-3">

                <UserRound
                  size={34}
                  strokeWidth={2}
                  className="text-[#E8A400]"
                />

                <span className="text-4xl font-semibold text-tb-black-primary">
                  {
                    dashboardData.totalCustomers
                  }
                </span>

              </div>

              <span className="text-xs text-tb-black-primary">
                Pembeli Aktif
              </span>

            </div>

          </div>

        </div>

        {/* =========================
            PRODUK TERLARIS
        ========================= */}
        <section className="mt-12">

          <h2 className="text-2xl font-normal text-tb-black-primary">
            Produk terlaris
          </h2>

          {dashboardData
            .bestSellingProducts
            .length > 0 ? (
            <div className="mt-6 space-y-5">

              {dashboardData.bestSellingProducts.map(
                (product) => (
                  <div
                    key={product.id}
                    className="
                      flex
                      min-h-[78px]
                      items-center
                      rounded-xl
                      bg-white
                      px-6
                      shadow-[0_4px_18px_rgba(0,0,0,0.08)]
                    "
                  >

                    {/* ICON */}
                    <div className="flex w-[55px] shrink-0 justify-center">

                      <ShoppingBag
                        size={40}
                        strokeWidth={1.8}
                        className="text-tb-red-primary"
                      />

                    </div>

                    {/* INFO */}
                    <div className="ml-5 flex-1">

                      <p className="text-base font-semibold text-tb-black-primary">
                        {product.name}
                      </p>

                      <p className="text-sm text-tb-black-primary">
                        Rp
                        {Number(
                          product.price
                        ).toLocaleString(
                          "id-ID"
                        )}
                      </p>

                      <p className="text-sm text-tb-black-primary">
                        Terjual:{" "}
                        {product.sold}
                      </p>

                    </div>

                    {/* DETAIL */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/admin/products"
                        )
                      }
                      className="
                        text-sm
                        font-medium
                        text-tb-black-primary
                        transition-colors
                        hover:text-tb-red-primary
                      "
                    >
                      Selengkapnya
                    </button>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="mt-6 rounded-xl bg-white py-16 text-center shadow-[0_4px_18px_rgba(0,0,0,0.08)]">

              <p className="text-gray-500">
                Belum ada data penjualan.
              </p>

            </div>
          )}

        </section>

      </section>
    </main>
  );
}

export default Dashboard;
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import PaymentNotification from "../../components/payment/PaymentNotification";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;


function PaymentQRIS() {
  const location = useLocation();
  const navigate = useNavigate();

  const checkoutData = location.state;

  const [timeLeft, setTimeLeft] =
    useState(300);

  const [notification, setNotification] =
    useState(null);

  const [paymentCompleted, setPaymentCompleted] =
    useState(false);

  const [isProcessing, setIsProcessing] =
    useState(false);

  // Mencegah expired dipanggil berkali-kali
  const paymentExpiredRef =
    useRef(false);

  // =========================
  // ORDER ID
  // =========================

  const orderId =
    checkoutData?.order?.id ||
    checkoutData?.orderNumber ||
    null;

  // =========================
  // COUNTDOWN 5 MENIT
  // =========================

  useEffect(() => {
    if (
      timeLeft <= 0 ||
      paymentCompleted ||
      notification === "expired"
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(
        (currentTime) =>
          Math.max(
            currentTime - 1,
            0
          )
      );
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    timeLeft,
    paymentCompleted,
    notification,
  ]);

  // =========================
  // UPDATE PAYMENT STATUS
  // =========================

  const updatePaymentStatus =
    async (status) => {
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

      if (!orderId) {
        return {
          success: false,
          message:
            "Nomor pesanan tidak ditemukan.",
        };
      }

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/payments/${orderId}/status`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                status,
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
              "Gagal memperbarui status pembayaran.",
          };
        }

        return {
          success: true,
          data: data.data,
        };
      } catch (error) {
        console.error(
          "Update payment status error:",
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
  // PAYMENT EXPIRED
  // =========================

  useEffect(() => {
    const handleExpired =
      async () => {
        if (
          timeLeft !== 0 ||
          paymentCompleted ||
          paymentExpiredRef.current
        ) {
          return;
        }

        paymentExpiredRef.current =
          true;

        setIsProcessing(true);

        const result =
          await updatePaymentStatus(
            "EXPIRED"
          );

        if (!result.success) {
          console.error(
            "Payment expired error:",
            result.message
          );
        }

        setIsProcessing(false);
        setNotification("expired");
      };

    handleExpired();
  }, [
    timeLeft,
    paymentCompleted,
  ]);

  // =========================
  // FORMAT TIMER
  // =========================

  const minutes = String(
    Math.floor(timeLeft / 60)
  ).padStart(2, "0");

  const seconds = String(
    timeLeft % 60
  ).padStart(2, "0");

  // =========================
  // PAYMENT SUCCESS
  // =========================

  const handlePaymentSuccess =
    async () => {
      if (
        paymentCompleted ||
        isProcessing
      ) {
        return;
      }

      setIsProcessing(true);

      const result =
        await updatePaymentStatus(
          "PAID"
        );

      if (!result.success) {
        window.alert(
          result.message
        );

        setIsProcessing(false);
        return;
      }

      setPaymentCompleted(true);
      setIsProcessing(false);
      setNotification("success");
    };

  // =========================
  // PAYMENT FAILED
  // =========================

  const handlePaymentFailed =
    async () => {
      if (
        paymentCompleted ||
        isProcessing
      ) {
        return;
      }

      setIsProcessing(true);

      const result =
        await updatePaymentStatus(
          "FAILED"
        );

      if (!result.success) {
        window.alert(
          result.message
        );

        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);
      setNotification("failed");
    };

  // =========================
  // DATA CHECKOUT TIDAK ADA
  // =========================

  if (!checkoutData) {
    return (
      <main className="px-10 py-20">
        <div className="text-center">

          <h1 className="text-2xl font-semibold text-tb-black-primary">
            Data Pembayaran Tidak Ditemukan
          </h1>

          <p className="mt-3 text-gray-500">
            Silakan kembali ke halaman checkout.
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

  return (
    <main className="px-10 py-12">
      <section className="mx-auto max-w-[700px]">

        {/* =========================
            TITLE
        ========================= */}
        <h1 className="mb-10 text-center text-3xl font-semibold text-tb-black-primary">
          Pembayaran QRIS
        </h1>

        {/* =========================
            PAYMENT CARD
        ========================= */}
        <div className="rounded-xl border border-gray-200 bg-white p-10 shadow-md">

          <div className="text-center">

            <h2 className="text-lg font-medium text-tb-black-primary">
              Scan QR Code Berikut ini
            </h2>

            {/* =========================
                QR CODE PLACEHOLDER
            ========================= */}
            <div className="mx-auto mt-8 flex h-[230px] w-[230px] items-center justify-center border border-gray-100 bg-white">

              <div className="grid h-[190px] w-[190px] grid-cols-5 grid-rows-5 gap-2">

                <div className="bg-tb-red-primary" />
                <div className="bg-tb-red-primary" />
                <div />
                <div />
                <div className="bg-tb-red-primary" />

                <div className="bg-tb-red-primary" />
                <div />
                <div className="bg-tb-red-primary" />
                <div />
                <div className="bg-tb-red-primary" />

                <div />
                <div className="bg-tb-red-primary" />
                <div className="bg-tb-red-primary" />
                <div />
                <div />

                <div className="bg-tb-red-primary" />
                <div />
                <div />
                <div className="bg-tb-red-primary" />
                <div className="bg-tb-red-primary" />

                <div className="bg-tb-red-primary" />
                <div className="bg-tb-red-primary" />
                <div />
                <div className="bg-tb-red-primary" />
                <div />

              </div>

            </div>

            {/* =========================
                TIMER
            ========================= */}
            <div className="mt-8">

              <p className="text-base font-medium text-tb-black-primary">
                Sisa Waktu Pembayaran
              </p>

              <div className="mx-auto mt-4 w-fit rounded-lg bg-tb-yellow-primary px-6 py-2">

                <span className="text-lg font-semibold text-tb-red-primary">
                  {minutes}:{seconds}
                </span>

              </div>

            </div>

            {/* =========================
                DEVELOPMENT TEST BUTTONS
            ========================= */}
            {timeLeft > 0 &&
              !paymentCompleted &&
              !notification && (
                <div className="mt-8 flex justify-center gap-3">

                  {/* SUCCESS */}
                  <button
                    type="button"
                    onClick={
                      handlePaymentSuccess
                    }
                    disabled={
                      isProcessing
                    }
                    className="
                      rounded-lg
                      bg-tb-red-primary
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition-colors
                      hover:bg-tb-red-secondary
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {isProcessing
                      ? "Memproses..."
                      : "Simulasikan Berhasil"}
                  </button>

                  {/* FAILED */}
                  <button
                    type="button"
                    onClick={
                      handlePaymentFailed
                    }
                    disabled={
                      isProcessing
                    }
                    className="
                      rounded-lg
                      border
                      border-tb-red-primary
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-tb-red-primary
                      transition-colors
                      hover:bg-tb-yellow-primary
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    Simulasikan Gagal
                  </button>

                </div>
              )}

          </div>
        </div>

      </section>

      {/* =========================
          SUCCESS
      ========================= */}
      {notification ===
        "success" && (
        <PaymentNotification
          type="success"
          title="Pembayaran Berhasil"
          message="Pembayaranmu berhasil. Pesanan akan segera diproses."
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

      {/* =========================
          FAILED
      ========================= */}
      {notification ===
        "failed" && (
        <PaymentNotification
          type="failed"
          title="Pembayaran Gagal"
          message="Pembayaran belum berhasil dilakukan. Silakan lakukan checkout kembali."
          primaryLabel="Kembali ke Checkout"
          secondaryLabel="Kembali ke Keranjang"
          onPrimary={() =>
            navigate("/checkout", {
              state:
                checkoutData,
            })
          }
          onSecondary={() =>
            navigate("/cart")
          }
        />
      )}

      {/* =========================
          EXPIRED
      ========================= */}
      {notification ===
        "expired" && (
        <PaymentNotification
          type="expired"
          title="Pembayaran Kedaluwarsa"
          message="Waktu pembayaran telah habis. Silakan lakukan checkout kembali."
          primaryLabel="Bayar Lagi"
          secondaryLabel="Kembali ke Keranjang"
          onPrimary={() =>
            navigate("/checkout", {
              state:
                checkoutData,
            })
          }
          onSecondary={() =>
            navigate("/cart")
          }
        />
      )}

    </main>
  );
}

export default PaymentQRIS;
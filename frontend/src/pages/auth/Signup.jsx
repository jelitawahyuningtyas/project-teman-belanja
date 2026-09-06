import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // HANDLE SIGN UP
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const result = await signup(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Setelah berhasil daftar,
    // arahkan ke halaman login
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-tb-red-primary px-6 py-12">
      <section className="mx-auto max-w-[600px]">

        {/* =========================
            TITLE
        ========================= */}
        <div className="text-center text-white">
          <h1 className="text-4xl font-semibold">
            Sign Up
          </h1>

          <p className="mx-auto mt-5 max-w-[560px] text-xl leading-relaxed">
            Daftarkan akun Anda sekarang untuk pengalaman
            yang lebih menyenangkan di TemanBelanja
          </p>
        </div>

        {/* =========================
            FORM
        ========================= */}
        <form
          onSubmit={handleSubmit}
          className="mt-10"
        >

          {/* NAMA LENGKAP */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-white"
            >
              Nama Lengkap
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="
                mt-3
                h-[56px]
                w-full
                border-2
                border-tb-yellow-primary
                bg-white
                px-4
                text-base
                text-tb-black-primary
                outline-none
                focus:ring-2
                focus:ring-tb-yellow-primary
              "
            />
          </div>

          {/* NOMOR TELEPON */}
          <div className="mt-7">
            <label
              htmlFor="phone"
              className="block text-lg font-medium text-white"
            >
              Nomor Telepon
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              className="
                mt-3
                h-[56px]
                w-full
                border-2
                border-tb-yellow-primary
                bg-white
                px-4
                text-base
                text-tb-black-primary
                outline-none
                focus:ring-2
                focus:ring-tb-yellow-primary
              "
            />
          </div>

          {/* USERNAME */}
          <div className="mt-7">
            <label
              htmlFor="username"
              className="block text-lg font-medium text-white"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="
                mt-3
                h-[56px]
                w-full
                border-2
                border-tb-yellow-primary
                bg-white
                px-4
                text-base
                text-tb-black-primary
                outline-none
                focus:ring-2
                focus:ring-tb-yellow-primary
              "
            />
          </div>

          {/* EMAIL */}
          <div className="mt-7">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-white"
            >
              Email Aktif
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="
                mt-3
                h-[56px]
                w-full
                border-2
                border-tb-yellow-primary
                bg-white
                px-4
                text-base
                text-tb-black-primary
                outline-none
                focus:ring-2
                focus:ring-tb-yellow-primary
              "
            />
          </div>

          {/* PASSWORD */}
          <div className="mt-7">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-white"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="
                mt-3
                h-[56px]
                w-full
                border-2
                border-tb-yellow-primary
                bg-white
                px-4
                text-base
                text-tb-black-primary
                outline-none
                focus:ring-2
                focus:ring-tb-yellow-primary
              "
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="mt-5 text-center text-sm font-medium text-white">
              {error}
            </p>
          )}

          {/* =========================
              SUBMIT
          ========================= */}
          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              className="
                w-[245px]
                rounded-full
                bg-tb-yellow-primary
                px-8
                py-4
                text-lg
                font-semibold
                text-tb-black-primary
                transition
                hover:brightness-95
              "
            >
              Buat Akun
            </button>
          </div>

        </form>

        {/* =========================
            LOGIN LINK
        ========================= */}
        <div className="mt-7 text-center text-sm text-white">
          <span>
            Sudah punya akun?{" "}
          </span>

          <Link
            to="/login"
            className="font-semibold underline hover:opacity-80"
          >
            Log In
          </Link>
        </div>

      </section>
    </main>
  );
}

export default Signup;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
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
  // HANDLE LOGIN
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const result = await login(
      formData.username,
      formData.password
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    // =========================
    // REDIRECT BERDASARKAN ROLE
    // =========================

    if (result.user.role === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/");
  };


  return (
    <main className="min-h-screen bg-tb-red-primary px-6 py-16">

      <section className="mx-auto max-w-[600px]">

        {/* =========================
            TITLE
        ========================= */}
        <div className="text-center text-white">

          <h1 className="text-4xl font-semibold">
            Log In
          </h1>

          <p className="mx-auto mt-5 max-w-[550px] text-xl leading-relaxed">
            Masuk kembali ke akun TemanBelanja untuk
            pengalaman yang lebih menyenangkan
          </p>

        </div>

        {/* =========================
            FORM
        ========================= */}
        <form
          onSubmit={handleSubmit}
          className="mt-12"
        >

          {/* USERNAME */}
          <div>
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
              placeholder=""
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
          <div className="mt-8">
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
            <p className="mt-4 text-center text-sm font-medium text-white">
              {error}
            </p>
          )}

          {/* =========================
              SUBMIT
          ========================= */}
          <div className="mt-12 flex justify-center">
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
                transition-colors
                hover:brightness-95
              "
            >
              Masuk
            </button>
          </div>

        </form>

        {/* =========================
            SIGN UP LINK
        ========================= */}
        <div className="mt-8 text-center text-sm text-white">

          <span>
            Belum punya akun?{" "}
          </span>

          <Link
            to="/signup"
            className="font-semibold underline hover:opacity-80"
          >
            Buat akun
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Login;
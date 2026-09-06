import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

// =========================
// LOAD CURRENT USER
// =========================

function loadCurrentUser() {
  const savedUser = localStorage.getItem(
    "temanbelanja_auth_user"
  );

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
}

// =========================
// AUTH PROVIDER
// =========================

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] =
    useState(loadCurrentUser);

  // =========================
  // SIGN UP
  // =========================

  const signup = async ({
    name,
    phone,
    username,
    email,
    password,
  }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            phone,
            username,
            email,
            password,
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
            "Gagal membuat akun.",
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error(
        "Signup error:",
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
  // LOGIN
  // =========================

  const login = async (
    username,
    password
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            password,
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
            "Username atau password salah.",
        };
      }

      const user = data.user;
      const token = data.token;

      // Simpan user
      setCurrentUser(user);

      localStorage.setItem(
        "temanbelanja_auth_user",
        JSON.stringify(user)
      );

      // Simpan JWT
      localStorage.setItem(
        "temanbelanja_token",
        token
      );

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      console.error(
        "Login error:",
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
  // LOGOUT
  // =========================

  const logout = () => {
    setCurrentUser(null);

    localStorage.removeItem(
      "temanbelanja_auth_user"
    );

    localStorage.removeItem(
      "temanbelanja_token"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        logout,

        isAuthenticated:
          !!currentUser,

        isAdmin:
          currentUser?.role ===
          "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// HOOK
// =========================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth harus digunakan di dalam AuthProvider"
    );
  }

  return context;
}
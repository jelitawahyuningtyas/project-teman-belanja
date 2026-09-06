import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ role }) {
  const {
    currentUser,
    isAuthenticated,
  } = useAuth();

  // Belum login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role tidak sesuai
  if (
    role &&
    currentUser?.role !== role
  ) {
    if (currentUser?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
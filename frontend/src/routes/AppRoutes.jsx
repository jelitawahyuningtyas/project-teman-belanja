import { Routes, Route } from "react-router-dom";

// =========================
// LAYOUTS
// =========================
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

// =========================
// AUTH
// =========================
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// =========================
// CUSTOMER PAGES
// =========================
import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import CategoryPage from "../pages/customer/CategoryPage";
import ProductDetail from "../pages/customer/ProductDetail";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import PaymentQRIS from "../pages/customer/PaymentQRIS";
import Orders from "../pages/customer/Orders";
import CreateAddress from "../pages/customer/CreateAddress";

// =========================
// ADMIN PAGES
// =========================
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import CreateProduct from "../pages/admin/CreateProduct";
import AdminOrders from "../pages/admin/Orders";
import AdminOrderDetail from "../pages/admin/OrderDetail";

// =========================
// AUTH PROTECTION
// =========================
import ProtectedRoute from "../components/auth/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>

      {/* ==================================================
          AUTH
      ================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* ==================================================
          CUSTOMER - PUBLIC
      ================================================== */}

      <Route element={<CustomerLayout />}>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/category/:categorySlug"
          element={<CategoryPage />}
        />

        <Route
          path="/product/:productId"
          element={<ProductDetail />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

      </Route>

      {/* ==================================================
          CUSTOMER - LOGIN REQUIRED
      ================================================== */}

      <Route element={<ProtectedRoute role="customer" />}>

        <Route element={<CustomerLayout />}>

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/payment/qris"
            element={<PaymentQRIS />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/address/create"
            element={<CreateAddress />}
          />

        </Route>

      </Route>

      {/* ==================================================
          ADMIN - LOGIN + ADMIN ROLE REQUIRED
      ================================================== */}

      <Route element={<ProtectedRoute role="admin" />}>

        <Route element={<AdminLayout />}>

          <Route
            path="/admin"
            element={<Dashboard />}
          />

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/products/create"
            element={<CreateProduct />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/orders/:orderId"
            element={<AdminOrderDetail />}
          />

        </Route>

      </Route>

    </Routes>
  );
}

export default AppRoutes;
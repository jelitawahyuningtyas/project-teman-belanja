import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-tb-white-primary">
      <Header role="admin" />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default AdminLayout;
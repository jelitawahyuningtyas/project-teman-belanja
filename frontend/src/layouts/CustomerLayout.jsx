import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-tb-white-primary">
      <Header role="customer" />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default CustomerLayout;
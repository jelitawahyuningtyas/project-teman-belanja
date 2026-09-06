import CategoryCard from "../../components/category/CategoryCard";
import ProductCard from "../../components/product/ProductCard";
import ServiceCard from "../../components/home/ServiceCard";

import AddressSelector from "../../components/address/AddressSelector";
import WelcomeSection from "../../components/home/WelcomeSection";

import { categories } from "../../data/categories";
import { services } from "../../data/services";

import { useProduct } from "../../context/ProductContext";

import { Link } from "react-router-dom";

function Home() {
  const { products } = useProduct();

  // =========================
  // RANDOM PRODUCTS
  // =========================
  const randomProducts = [...products]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <>
      {/* =========================
          ADDRESS
      ========================= */}
      <AddressSelector />

      {/* =========================
          WELCOME
      ========================= */}
      <WelcomeSection />

      <main className="px-10 py-10">

        {/* =========================
            CATEGORY SECTION
        ========================= */}
        <section>
          <h2 className="mb-8 text-center text-2xl font-semibold">
            Kategori Produk
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </section>

        {/* =========================
            PRODUCT SECTION
        ========================= */}
        <section className="mt-24">
          <div className="mx-auto max-w-[1000px]">

            {/* Section Header */}
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-tb-black-primary">
                Produk Tersedia
              </h2>

              <Link
                to="/products"
                className="text-sm font-medium text-tb-black-primary transition-colors hover:text-tb-red-primary"
              >
                Lihat lebih lengkap →
              </Link>
            </div>

            {/* Product Cards */}
            {randomProducts.length > 0 ? (
              <div className="grid grid-cols-4 justify-items-center gap-6">
                {randomProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-gray-500">
                Belum ada produk tersedia.
              </p>
            )}
          </div>
        </section>

        {/* =========================
            LAYANAN SECTION
        ========================= */}
        <section className="mt-24">
          <h2 className="mb-10 text-center text-2xl font-semibold">
            Layanan Kami
          </h2>

          <div className="mx-auto flex max-w-[900px] justify-center gap-16">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        </section>

      </main>
    </>
  );
}

export default Home;
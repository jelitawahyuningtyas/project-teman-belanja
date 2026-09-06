import { useParams } from "react-router-dom";

import WelcomeSection from "../../components/home/WelcomeSection";
import ProductCard from "../../components/product/ProductCard";

import { categories } from "../../data/categories";
import { useProduct } from "../../context/ProductContext";

function CategoryPage() {
  const { categorySlug } = useParams();

  const {
    products,
    loading,
    error,
  } = useProduct();

  // =========================
  // FIND CATEGORY
  // =========================

  const selectedCategory = categories.find(
    (category) =>
      category.slug === categorySlug
  );

  // =========================
  // CATEGORY NOT FOUND
  // =========================

  if (!selectedCategory) {
    return (
      <>
        <WelcomeSection />

        <main className="px-10 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-tb-black-primary">
              Kategori Tidak Ditemukan
            </h1>

            <p className="mt-3 text-gray-500">
              Kategori yang kamu cari tidak tersedia.
            </p>
          </div>
        </main>
      </>
    );
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <WelcomeSection />

        <main className="px-10 py-20">
          <p className="text-center text-gray-500">
            Memuat produk...
          </p>
        </main>
      </>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <>
        <WelcomeSection />

        <main className="px-10 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-tb-black-primary">
              Gagal Memuat Produk
            </h1>

            <p className="mt-3 text-gray-500">
              {error}
            </p>
          </div>
        </main>
      </>
    );
  }

  // =========================
  // FILTER PRODUCT
  // =========================

  const categoryProducts =
    products.filter(
      (product) =>
        product.categoryId ===
        selectedCategory.id
    );

  return (
    <>
      <WelcomeSection />

      <main className="px-10 py-12">
        <section className="mx-auto max-w-[1100px]">

          <h1 className="mb-12 text-center text-3xl font-semibold text-tb-black-primary">
            {selectedCategory.name}
          </h1>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-4 justify-items-center gap-x-6 gap-y-8">
              {categoryProducts.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}
            </div>
          ) : (
            <p className="py-20 text-center text-gray-500">
              Belum ada produk dalam kategori ini.
            </p>
          )}

        </section>
      </main>
    </>
  );
}

export default CategoryPage;
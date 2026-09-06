import WelcomeSection from "../../components/home/WelcomeSection";
import ProductCard from "../../components/product/ProductCard";

import { useProduct } from "../../context/ProductContext";

function Products() {
  const { products } = useProduct();

  return (
    <>
      {/* Welcome */}
      <WelcomeSection />

      <main className="px-10 py-12">
        <section className="mx-auto max-w-[1100px]">

          {/* Page Title */}
          <h1 className="mb-12 text-center text-3xl font-semibold text-tb-black-primary">
            Semua Produk
          </h1>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-4 justify-items-center gap-x-6 gap-y-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p className="py-20 text-center text-gray-500">
              Belum ada produk tersedia.
            </p>
          )}

        </section>
      </main>
    </>
  );
}

export default Products;
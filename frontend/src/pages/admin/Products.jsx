import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useProduct } from "../../context/ProductContext";
import { categories } from "../../data/categories";

function Products() {
  const navigate = useNavigate();

  const {
    products,
    deleteProduct,
  } = useProduct();

  const [selectedCategory, setSelectedCategory] = useState("all");

  // =========================
  // FILTER PRODUCT
  // =========================
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }

    return products.filter(
      (product) =>
        product.categoryId === Number(selectedCategory)
    );
  }, [products, selectedCategory]);

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
            `Apakah kamu yakin ingin menghapus "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        const result =
            await deleteProduct(product.id);

        if (!result.success) {
            window.alert(result.message);
        }
    };

  return (
    <main className="px-10 py-12">
      <section className="mx-auto max-w-[1100px]">

        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-normal text-tb-black-primary">
            Produk yang{" "}
            <span className="text-tb-red-primary">
              Dijual
            </span>
          </h1>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products/create")
            }
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-tb-yellow-primary
              px-7
              py-2.5
              text-sm
              font-semibold
              text-tb-red-primary
              transition-transform
              duration-200
              hover:scale-105
            "
          >
            <Plus size={17} strokeWidth={2.5} />

            <span>Buat Produk</span>
          </button>
        </div>

        {/* =========================
            CATEGORY FILTER
        ========================= */}
        <div className="mt-8 flex flex-wrap gap-3">

          {/* Semua */}
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`
              rounded-full
              px-5
              py-2
              text-sm
              font-medium
              transition-colors
              ${
                selectedCategory === "all"
                  ? "bg-tb-red-primary text-white"
                  : "bg-tb-yellow-primary text-tb-red-primary hover:bg-tb-yellow-primary/80"
              }
            `}
          >
            Semua
          </button>

          {/* Categories */}
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() =>
                setSelectedCategory(String(category.id))
              }
              className={`
                rounded-full
                px-5
                py-2
                text-sm
                font-medium
                transition-colors
                ${
                  selectedCategory === String(category.id)
                    ? "bg-tb-red-primary text-white"
                    : "bg-tb-yellow-primary text-tb-red-primary hover:bg-tb-yellow-primary/80"
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* =========================
            PRODUCT LIST
        ========================= */}
        {filteredProducts.length > 0 ? (
          <div className="mt-10 grid grid-cols-3 gap-6">

            {filteredProducts.map((product) => {
              const category = categories.find(
                (item) => item.id === product.categoryId
              );

              return (
                <div
                  key={product.id}
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                    transition-shadow
                    duration-200
                    hover:shadow-md
                  "
                >

                  {/* Product Image */}
                  <div className="flex h-[180px] items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="mt-5">

                    {/* Category */}
                    <span
                      className="
                        inline-block
                        rounded-full
                        bg-tb-yellow-primary
                        px-4
                        py-1
                        text-[11px]
                        font-medium
                        text-tb-red-primary
                      "
                    >
                      {category?.name ?? "Kategori"}
                    </span>

                    {/* Name */}
                    <h2 className="mt-3 min-h-[48px] text-base font-semibold leading-snug text-tb-black-primary">
                      {product.name}
                    </h2>

                    {/* Price */}
                    <p className="mt-2 text-sm font-semibold text-tb-red-primary">
                      Rp{product.price.toLocaleString("id-ID")}
                    </p>

                    {/* Stock */}
                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-sm text-gray-500">
                        Stok
                      </span>

                      <span className="text-sm font-semibold text-tb-black-primary">
                        {product.stock}
                      </span>
                    </div>

                    {/* Delete */}
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        aria-label={`Hapus ${product.name}`}
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          text-tb-red-primary
                          transition-colors
                          hover:bg-red-50
                        "
                      >
                        <Trash2
                          size={20}
                          strokeWidth={2.2}
                        />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-500">
              Belum ada produk dalam kategori ini.
            </p>
          </div>
        )}

      </section>
    </main>
  );
}

export default Products;
import { useState } from "react";
import { useParams } from "react-router-dom";

import QuantitySelector from "../../components/common/QuantitySelector";

import { useCart } from "../../context/CartContext";
import { useProduct } from "../../context/ProductContext";

function ProductDetail() {
  const { productId } = useParams();

  const { addToCart } = useCart();

  const {
    products,
    loading,
    error,
  } = useProduct();

  const [quantity, setQuantity] = useState(1);

  // =========================
  // FIND PRODUCT
  // =========================

  const selectedProduct = products.find(
    (product) =>
      product.id === Number(productId)
  );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="px-10 py-20">
        <div className="text-center">
          <p className="text-gray-500">
            Memuat informasi produk...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
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
    );
  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================

  if (!selectedProduct) {
    return (
      <main className="px-10 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-tb-black-primary">
            Produk Tidak Ditemukan
          </h1>

          <p className="mt-3 text-gray-500">
            Produk yang kamu cari tidak tersedia.
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // QUANTITY
  // =========================

  const handleIncrease = () => {
    setQuantity((currentQuantity) =>
      Math.min(
        currentQuantity + 1,
        selectedProduct.stock
      )
    );
  };

  const handleDecrease = () => {
    setQuantity((currentQuantity) =>
      Math.max(currentQuantity - 1, 1)
    );
  };

  const handleQuantityChange = (value) => {
    if (value === "") {
      return;
    }

    const newQuantity = Number(value);

    if (Number.isNaN(newQuantity)) {
      return;
    }

    setQuantity(
      Math.min(
        Math.max(
          newQuantity,
          1
        ),
        selectedProduct.stock
      )
    );
  };

  return (
    <main className="px-10 py-12">
      <section className="mx-auto max-w-[1100px]">

        <h1 className="mb-12 text-center text-3xl font-semibold text-tb-black-primary">
          Informasi Detail Product
        </h1>

        <div className="flex gap-10">

          {/* =========================
              PRODUCT IMAGE
          ========================= */}
          <div className="flex w-[45%] items-center justify-center rounded-xl border border-gray-200 p-8">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="h-[300px] w-full object-contain"
            />
          </div>

          {/* =========================
              PRODUCT INFORMATION
          ========================= */}
          <div className="flex-1">

            {/* CATEGORY */}
            <span className="inline-block rounded-full bg-tb-yellow-primary px-5 py-2 text-sm font-medium text-tb-red-primary">
              Produk {selectedProduct.category}
            </span>

            {/* PRODUCT NAME */}
            <h2 className="mt-5 text-center text-2xl font-semibold text-tb-black-primary">
              {selectedProduct.name}
            </h2>

            {/* PRODUCT INFORMATION */}
            <div className="mt-6 space-y-3 text-base">

              <div className="flex">
                <span className="w-[110px] text-tb-red-primary">
                  Merk
                </span>

                <span>
                  {selectedProduct.brand}
                </span>
              </div>

              <div className="flex">
                <span className="w-[110px] text-tb-red-primary">
                  Varian
                </span>

                <span>
                  {selectedProduct.variant}
                </span>
              </div>

              <div className="flex">
                <span className="w-[110px] text-tb-red-primary">
                  Harga
                </span>

                <span>
                  Rp
                  {selectedProduct.price.toLocaleString(
                    "id-ID"
                  )}
                </span>
              </div>

              <div className="flex">
                <span className="w-[110px] text-tb-red-primary">
                  Berat
                </span>

                <span>
                  {selectedProduct.weight}
                </span>
              </div>

              <div className="flex items-start">
                <span className="w-[110px] shrink-0 text-tb-red-primary">
                  Deskripsi
                </span>

                <span className="leading-relaxed">
                  {selectedProduct.description}
                </span>
              </div>

            </div>

            {/* =========================
                PURCHASE PANEL
            ========================= */}
            <div className="mt-8 rounded-xl border border-gray-200 p-6 shadow-sm">

              <h3 className="text-center text-lg font-semibold text-tb-black-primary">
                Masukkan produk ke dalam Keranjang Belanja
              </h3>

              {/* QUANTITY */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-tb-black-primary">
                  Beli Barang
                </span>

                <QuantitySelector
                  quantity={quantity}
                  max={selectedProduct.stock}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onChange={handleQuantityChange}
                />
              </div>

              {/* STOCK */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Stok tersedia
                </span>

                <span className="font-medium text-tb-black-primary">
                  {selectedProduct.stock}
                </span>
              </div>

              {/* ADD TO CART */}
              <button
                type="button"
                onClick={() =>
                  addToCart(
                    selectedProduct,
                    quantity
                  )
                }
                disabled={
                  selectedProduct.stock <= 0
                }
                className="
                  mt-6
                  w-full
                  rounded-full
                  bg-tb-red-primary
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-tb-red-secondary
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {selectedProduct.stock <= 0
                  ? "Stok Habis"
                  : "Tambah ke Keranjang"}
              </button>

            </div>

          </div>
        </div>

      </section>
    </main>
  );
}

export default ProductDetail;
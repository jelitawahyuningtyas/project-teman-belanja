import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useAddress } from "../../context/AddressContext";
import { useProduct } from "../../context/ProductContext";

import CartItem from "../../components/cart/CartItem";

function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const {
    selectedAddress,
  } = useAddress();

  const {
    products,
    loading,
    error,
  } = useProduct();

  const navigate = useNavigate();

  // =========================
  // SELECTED ITEMS
  // =========================
  const [
    selectedItems,
    setSelectedItems,
  ] = useState([]);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("qris");

  // =========================
  // HELPER
  // =========================
  const getCartItem = (
    productId
  ) => {
    return cartItems.find(
      (item) =>
        item.productId ===
        productId
    );
  };

  // =========================
  // CHECKBOX
  // =========================
  const handleToggleSelect = (
    productId
  ) => {
    setSelectedItems(
      (currentSelected) => {
        if (
          currentSelected.includes(
            productId
          )
        ) {
          return currentSelected.filter(
            (id) =>
              id !== productId
          );
        }

        return [
          ...currentSelected,
          productId,
        ];
      }
    );
  };

  // =========================
  // INCREASE QUANTITY
  // =========================
  const handleIncrease = (
    product
  ) => {
    const cartItem =
      getCartItem(product.id);

    if (!cartItem) {
      return;
    }

    updateQuantity(
      product,
      cartItem.quantity + 1
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================
  const handleDecrease = (
    product
  ) => {
    const cartItem =
      getCartItem(product.id);

    if (!cartItem) {
      return;
    }

    updateQuantity(
      product,
      cartItem.quantity - 1
    );
  };

  // =========================
  // CHANGE QUANTITY MANUALLY
  // =========================
  const handleChangeQuantity = (
    product,
    value
  ) => {
    const newQuantity =
      Number(value);

    if (
      !Number.isInteger(
        newQuantity
      )
    ) {
      return;
    }

    updateQuantity(
      product,
      newQuantity
    );
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const handleRemove = (
    productId
  ) => {
    removeFromCart(productId);

    setSelectedItems(
      (currentSelected) =>
        currentSelected.filter(
          (id) =>
            id !== productId
        )
    );
  };

  // =========================
  // SELECTED CART ITEMS
  // =========================
  const selectedCartItems =
    cartItems.filter(
      (cartItem) =>
        selectedItems.includes(
          cartItem.productId
        )
    );

  // =========================
  // TOTAL BELANJA
  // =========================
  const totalBelanja =
    selectedCartItems.reduce(
      (total, cartItem) => {
        const product =
          products.find(
            (item) =>
              item.id ===
              cartItem.productId
          );

        if (!product) {
          return total;
        }

        return (
          total +
          product.price *
            cartItem.quantity
        );
      },
      0
    );

  // =========================
  // CHECKOUT
  // =========================
  const handleCheckout = () => {
    // Harus memilih minimal satu produk
    if (
      selectedCartItems.length ===
      0
    ) {
      alert(
        "Pilih minimal satu produk terlebih dahulu."
      );
      return;
    }

    // Harus punya alamat
    if (!selectedAddress) {
      alert(
        "Pilih alamat pengantaran terlebih dahulu."
      );
      return;
    }

    navigate("/checkout", {
      state: {
        selectedItems:
          selectedCartItems,
        selectedAddress,
        paymentMethod,
        totalBelanja,
      },
    });
  };

  // =========================
  // LOADING PRODUCT
  // =========================
  if (loading) {
    return (
      <main className="px-10 py-20">
        <div className="text-center">
          <p className="text-gray-500">
            Memuat keranjang belanja...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR PRODUCT
  // =========================
  if (error) {
    return (
      <main className="px-10 py-20">
        <div className="text-center">
          <p className="text-gray-500">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-10 py-12">
      <section className="mx-auto max-w-[1200px]">

        <div className="grid grid-cols-[1fr_320px] gap-12">

          {/* =========================
              LIST KERANJANG
          ========================= */}
          <div>
            <h1 className="mb-8 text-center text-2xl font-semibold text-tb-black-primary">
              List Keranjang Belanja
            </h1>

            {cartItems.length ===
            0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-500">
                  Keranjang belanja masih kosong.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {cartItems.map(
                  (cartItem) => {
                    const product =
                      products.find(
                        (item) =>
                          item.id ===
                          cartItem.productId
                      );

                    if (!product) {
                      return null;
                    }

                    return (
                      <CartItem
                        key={
                          cartItem.productId
                        }
                        product={product}
                        quantity={
                          cartItem.quantity
                        }
                        selected={selectedItems.includes(
                          product.id
                        )}
                        onToggleSelect={() =>
                          handleToggleSelect(
                            product.id
                          )
                        }
                        onIncrease={() =>
                          handleIncrease(
                            product
                          )
                        }
                        onDecrease={() =>
                          handleDecrease(
                            product
                          )
                        }
                        onChangeQuantity={(
                          value
                        ) =>
                          handleChangeQuantity(
                            product,
                            value
                          )
                        }
                        onRemove={() =>
                          handleRemove(
                            product.id
                          )
                        }
                      />
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* =========================
              RINCIAN BELANJA
          ========================= */}
          <div>

            <h2 className="text-2xl font-semibold text-tb-black-primary">
              Rincian Belanja
            </h2>

            {/* =========================
                ALAMAT PENGANTARAN
            ========================= */}
            <div className="mt-8 border-b border-gray-300 pb-5">
              <div className="flex items-center gap-2">

                <MapPin
                  size={20}
                  strokeWidth={2.2}
                  className="text-tb-red-primary"
                />

                <span className="text-base text-tb-black-primary">
                  Alamat Pengantaran:{" "}
                  {selectedAddress?.label ||
                    "Belum dipilih"}
                </span>

              </div>
            </div>

            {/* =========================
                TOTAL BELANJA
            ========================= */}
            <div className="border-b border-gray-300 py-5">
              <div className="flex items-center justify-between">

                <span className="font-medium text-tb-black-primary">
                  Total Belanja
                </span>

                <span className="font-medium text-tb-black-primary">
                  Rp
                  {totalBelanja.toLocaleString(
                    "id-ID"
                  )}
                </span>

              </div>
            </div>

            {/* =========================
                METODE PEMBAYARAN
            ========================= */}
            <div className="mt-6">

              <h3 className="text-base font-semibold text-tb-black-primary">
                Metode Pembayaran
              </h3>

              <div className="mt-4 space-y-3">

                {/* QRIS */}
                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    text-sm
                    text-tb-black-primary
                  "
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="qris"
                    checked={
                      paymentMethod ===
                      "qris"
                    }
                    onChange={(
                      event
                    ) =>
                      setPaymentMethod(
                        event.target
                          .value
                      )
                    }
                    className="h-4 w-4 accent-tb-red-primary"
                  />

                  <span>
                    QRIS
                  </span>
                </label>

                {/* COD */}
                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    text-sm
                    text-tb-black-primary
                  "
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={
                      paymentMethod ===
                      "cod"
                    }
                    onChange={(
                      event
                    ) =>
                      setPaymentMethod(
                        event.target
                          .value
                      )
                    }
                    className="h-4 w-4 accent-tb-red-primary"
                  />

                  <span>
                    COD
                  </span>
                </label>

                {/* CHECKOUT */}
                <button
                  type="button"
                  onClick={
                    handleCheckout
                  }
                  className="
                    mt-10
                    rounded-lg
                    bg-tb-red-primary
                    px-5
                    py-2
                    text-lg
                    font-semibold
                    text-white
                    transition-colors
                    hover:bg-tb-red-secondary
                  "
                >
                  Check Out
                </button>

              </div>
            </div>

          </div>

        </div>

      </section>
    </main>
  );
}

export default Cart;
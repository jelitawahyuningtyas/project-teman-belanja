import {
  createContext,
  useContext,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] =
    useState([]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (
    product,
    quantity
  ) => {
    if (
      !product ||
      product.stock <= 0 ||
      quantity <= 0
    ) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            item.productId === product.id
        );

      // =========================
      // PRODUCT SUDAH ADA DI CART
      // =========================
      if (existingItem) {
        const newQuantity =
          existingItem.quantity +
          quantity;

        // Tidak boleh melebihi stock
        if (
          newQuantity > product.stock
        ) {
          return currentItems;
        }

        return currentItems.map(
          (item) =>
            item.productId ===
            product.id
              ? {
                  ...item,
                  quantity:
                    newQuantity,
                }
              : item
        );
      }

      // =========================
      // PRODUCT BELUM ADA DI CART
      // =========================

      const safeQuantity =
        Math.min(
          Math.max(quantity, 1),
          product.stock
        );

      return [
        ...currentItems,
        {
          productId: product.id,
          quantity:
            safeQuantity,
        },
      ];
    });
  };

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity = (
    product,
    quantity
  ) => {
    if (!product) {
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.productId !==
          product.id
        ) {
          return item;
        }

        const safeQuantity =
          Math.min(
            Math.max(quantity, 1),
            product.stock
          );

        return {
          ...item,
          quantity:
            safeQuantity,
        };
      })
    );
  };

  // =========================
  // REMOVE ONE ITEM
  // =========================
  const removeFromCart = (
    productId
  ) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.productId !==
          productId
      )
    );
  };

  // =========================
  // REMOVE MULTIPLE ITEMS
  // =========================
  const removeItemsFromCart = (
    productIds
  ) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !productIds.includes(
            item.productId
          )
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        removeItemsFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart harus digunakan di dalam CartProvider"
    );
  }

  return context;
}
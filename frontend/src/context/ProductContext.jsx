import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ProductContext = createContext();

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

const API_ORIGIN =
   import.meta.env.VITE_API_ORIGIN;

// =========================
// FORMAT PRODUCT IMAGE
// =========================

function normalizeProduct(product) {
  if (!product) {
    return product;
  }

  return {
    ...product,

    image:
      product.image?.startsWith("http")
        ? product.image
        : product.image
          ? `${API_ORIGIN}${product.image}`
          : "",
  };
}

// =========================
// PRODUCT PROVIDER
// =========================

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/products`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal mengambil data produk."
        );
      }

      const formattedProducts =
        (data.data || []).map(
          normalizeProduct
        );

      setProducts(
        formattedProducts
      );
    } catch (error) {
      console.error(
        "Fetch products error:",
        error
      );

      setProducts([]);

      setError(
        "Tidak dapat mengambil data produk dari server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL FETCH
  // =========================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = async (
    productId
  ) => {
    try {
      const token =
        localStorage.getItem(
          "temanbelanja_token"
        );

      if (!token) {
        throw new Error(
          "Token login tidak ditemukan."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/products/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal menghapus produk."
        );
      }

      // Hapus dari state frontend
      // setelah backend berhasil
      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (product) =>
              product.id !== productId
          )
      );

      return {
        success: true,
        message:
          data.message ||
          "Produk berhasil dihapus.",
      };
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      return {
        success: false,
        message:
          error.message ||
          "Gagal menghapus produk.",
      };
    }
  };

  // =========================
  // REFRESH PRODUCTS
  // =========================

  const refreshProducts = async () => {
    await fetchProducts();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        deleteProduct,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// =========================
// HOOK
// =========================

export function useProduct() {
  const context =
    useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProduct harus digunakan di dalam ProductProvider"
    );
  }

  return context;
}
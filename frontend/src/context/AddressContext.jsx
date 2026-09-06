import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AddressContext = createContext();

const API_BASE_URL = 
  import.meta.env.VITE_API_URL;

// =========================
// ADDRESS PROVIDER
// =========================

export function AddressProvider({ children }) {
  const [addresses, setAddresses] =
    useState([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // GET ADDRESSES
  // =========================

  const fetchAddresses = async () => {
    const token =
      localStorage.getItem(
        "temanbelanja_token"
      );

    if (!token) {
      setAddresses([]);
      setSelectedAddressId(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/addresses`,
        {
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
            "Gagal mengambil alamat."
        );
      }

      const loadedAddresses =
        data.data || [];

      setAddresses(
        loadedAddresses
      );

      // Pilih alamat utama
      const mainAddress =
        loadedAddresses.find(
          (address) =>
            address.isMain
        );

      // Kalau belum ada alamat utama,
      // gunakan alamat pertama
      const defaultAddress =
        mainAddress ||
        loadedAddresses[0];

      setSelectedAddressId(
        defaultAddress?.id ?? null
      );
    } catch (error) {
      console.error(
        "Fetch addresses error:",
        error
      );

      setAddresses([]);
      setSelectedAddressId(null);

      setError(
        error.message ||
          "Gagal mengambil alamat."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchAddresses();
  }, []);

  // =========================
  // SELECT ADDRESS
  // =========================

  const selectAddress = (
    addressId
  ) => {
    setSelectedAddressId(
      addressId
    );
  };

  // =========================
  // ADD ADDRESS
  // =========================

  const addAddress = async (
    addressData
  ) => {
    const token =
      localStorage.getItem(
        "temanbelanja_token"
      );

    if (!token) {
      return {
        success: false,
        message:
          "Sesi login tidak ditemukan. Silakan login kembali.",
      };
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/addresses`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            label:
              addressData.label.trim(),

            recipientName:
              addressData.recipientName.trim(),

            phone:
              addressData.phone.trim(),

            address:
              addressData.address.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message ||
            "Gagal menambahkan alamat.",
        };
      }

      const newAddress =
        data.data;

      setAddresses(
        (currentAddresses) => [
          ...currentAddresses,
          newAddress,
        ]
      );

      // Alamat yang baru dibuat
      // langsung menjadi alamat terpilih
      setSelectedAddressId(
        newAddress.id
      );

      return {
        success: true,
        data: newAddress,
      };
    } catch (error) {
      console.error(
        "Add address error:",
        error
      );

      return {
        success: false,
        message:
          "Tidak dapat terhubung ke server.",
      };
    }
  };

  // =========================
  // SELECTED ADDRESS
  // =========================

  const selectedAddress =
    addresses.find(
      (address) =>
        address.id ===
        selectedAddressId
    );

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        selectedAddressId,
        selectAddress,
        addAddress,
        loading,
        error,
        fetchAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

// =========================
// HOOK
// =========================

export function useAddress() {
  const context =
    useContext(AddressContext);

  if (!context) {
    throw new Error(
      "useAddress harus digunakan di dalam AddressProvider"
    );
  }

  return context;
}
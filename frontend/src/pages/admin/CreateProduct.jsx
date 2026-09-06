import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

import { categories } from "../../data/categories";

import ProductNotification from "../../components/admin/ProductNotification";

import { useProduct } from "../../context/ProductContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

function CreateProduct() {
  const navigate = useNavigate();

  // =========================
  // FORM
  // =========================

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    brand: "",
    variant: "",
    price: "",
    weightValue: "",
    weightUnit: "g",
    stock: "",
    description: "",
  });

  // =========================
  // IMAGE
  // =========================

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // =========================
  // FEEDBACK
  // =========================

  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] =
    useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // HANDLE IMAGE
  // =========================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "File yang dipilih harus berupa gambar."
      );

      return;
    }

    setImageFile(file);
    setImagePreview(
      URL.createObjectURL(file)
    );

    setError("");
  };

  // =========================
  // BASIC VALIDATION
  // =========================

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Nama produk wajib diisi.";
    }

    if (!formData.categoryId) {
      return "Kategori produk wajib dipilih.";
    }

    if (!formData.brand.trim()) {
      return "Merk wajib diisi.";
    }

    if (!formData.variant.trim()) {
      return "Varian wajib diisi.";
    }

    if (
      !formData.price ||
      Number(formData.price) <= 0
    ) {
      return "Harga harus lebih dari 0.";
    }

    if (
      !formData.weightValue ||
      Number(formData.weightValue) <= 0
    ) {
      return "Berat harus lebih dari 0.";
    }

    if (
      !["g", "kg"].includes(
        formData.weightUnit
      )
    ) {
      return "Satuan berat tidak valid.";
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      return "Stok tidak valid.";
    }

    if (!formData.description.trim()) {
      return "Deskripsi produk wajib diisi.";
    }

    if (!imageFile) {
      return "Gambar produk wajib ditambahkan.";
    }

    return "";
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const selectedCategory =
      categories.find(
        (category) =>
          category.id ===
          Number(formData.categoryId)
      );

    if (!selectedCategory) {
      setError(
        "Kategori tidak ditemukan."
      );

      return;
    }

    // =========================
    // TOKEN
    // =========================

    const token = localStorage.getItem(
      "temanbelanja_token"
    );

    if (!token) {
      setError(
        "Sesi login tidak ditemukan. Silakan login kembali."
      );

      return;
    }

    // =========================
    // FORM DATA
    // =========================

    const requestData = new FormData();

    requestData.append(
      "name",
      formData.name.trim()
    );

    requestData.append(
      "categoryId",
      String(selectedCategory.id)
    );

    requestData.append(
      "brand",
      formData.brand.trim()
    );

    requestData.append(
      "variant",
      formData.variant.trim()
    );

    requestData.append(
      "price",
      String(Number(formData.price))
    );

    requestData.append(
      "weightValue",
      String(
        Number(formData.weightValue)
      )
    );

    requestData.append(
      "weightUnit",
      formData.weightUnit
    );

    requestData.append(
      "stock",
      String(Number(formData.stock))
    );

    requestData.append(
      "description",
      formData.description.trim()
    );

    requestData.append(
      "image",
      imageFile
    );

    // =========================
    // SEND TO BACKEND
    // =========================

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${API_BASE_URL}/products`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: requestData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
            data.message ||
            "Gagal menambahkan produk."
        );

        return;
}

await refreshProducts();

setShowSuccess(true);

      // =========================
      // SUCCESS
      // =========================

      setShowSuccess(true);
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      setError(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-10 py-12">
      <section className="mx-auto max-w-[900px]">

        {/* =========================
            FORM CARD
        ========================= */}
        <div className="rounded-xl bg-white p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">

          {/* TITLE */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-tb-black-primary">
              Buat Produk
            </h1>

            <p className="mt-3 text-sm text-gray-600">
              Buat produk yang ingin dijual dan
              lengkapi informasi produk di bawah ini.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-tb-red-primary">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >

            {/* =========================
                NAMA PRODUK
            ========================= */}
            <div>
              <label className="text-sm font-semibold text-tb-black-primary">
                Nama Produk
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Teh Poci Teh Celup"
                className="
                  mt-2
                  w-full
                  rounded-md
                  border
                  border-tb-red-primary
                  bg-tb-yellow-primary
                  px-4
                  py-3
                  text-sm
                  outline-none
                  placeholder:text-gray-400
                "
              />
            </div>

            {/* =========================
                KATEGORI
            ========================= */}
            <div>
              <label className="text-sm font-semibold text-tb-black-primary">
                Kategori Produk
              </label>

              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="
                  mt-2
                  w-full
                  rounded-md
                  border
                  border-tb-red-primary
                  bg-tb-yellow-primary
                  px-4
                  py-3
                  text-sm
                  outline-none
                "
              >
                <option value="">
                  Pilih kategori produk
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* =========================
                MERK
            ========================= */}
            <div>
              <label className="text-sm font-semibold text-tb-black-primary">
                Merk
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Contoh: Teh Poci"
                className="
                  mt-2
                  w-full
                  rounded-md
                  border
                  border-tb-red-primary
                  bg-tb-yellow-primary
                  px-4
                  py-3
                  text-sm
                  outline-none
                  placeholder:text-gray-400
                "
              />
            </div>

            {/* =========================
                VARIAN
            ========================= */}
            <div>
              <label className="text-sm font-semibold text-tb-black-primary">
                Varian
              </label>

              <input
                type="text"
                name="variant"
                value={formData.variant}
                onChange={handleChange}
                placeholder="Contoh: Original"
                className="
                  mt-2
                  w-full
                  rounded-md
                  border
                  border-tb-red-primary
                  bg-tb-yellow-primary
                  px-4
                  py-3
                  text-sm
                  outline-none
                  placeholder:text-gray-400
                "
              />
            </div>

            {/* =========================
                HARGA
            ========================= */}
            <div>
              <label className="text-sm font-semibold text-tb-black-primary">
                Harga
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="1"
                placeholder="Contoh: 12500"
                className="
                  mt-2
                  w-full
                  rounded-md
                  border
                  border-tb-red-primary
                  bg-tb-yellow-primary
                  px-4
                  py-3
                  text-sm
                  outline-none
                  placeholder:text-gray-400
                "
              />
            </div>

            {/* =========================
                BERAT + SATUAN
            ========================= */}
            <div>
              <label className="text-sm font-semibold text-tb-black-primary">
                Berat
              </label>

              <div className="mt-2 flex gap-2">

                <input
                  type="number"
                  name="weightValue"
                  value={formData.weightValue}
                  onChange={handleChange}
                  min="1"
                  placeholder="500"
                  className="
                    w-full
                    rounded-md
                    border
                    border-tb-red-primary
                    bg-tb-yellow-primary
                    px-4
                    py-3
                    text-sm
                    outline-none
                  "
                />

                <select
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleChange}
                  className="
                    rounded-md
                    border
                    border-tb-red-primary
                    bg-tb-yellow-primary
                    px-4
                    py-3
                    text-sm
                    outline-none
                  "
                >
                  <option value="g">
                    g
                  </option>

                  <option value="kg">
                    kg
                  </option>
                </select>

              </div>
            </div>

            {/* =========================
                STOK
            ========================= */}
            <div>
              <label className="text-sm font-semibold text-tb-black-primary">
                Stok Awal
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="Contoh: 100"
                className="
                  mt-2
                  w-full
                  rounded-md
                  border
                  border-tb-red-primary
                  bg-tb-yellow-primary
                  px-4
                  py-3
                  text-sm
                  outline-none
                  placeholder:text-gray-400
                "
              />
            </div>

            {/* =========================
                DESKRIPSI
            ========================= */}
            <div>
              <label className="text-sm font-semibold text-tb-black-primary">
                Deskripsi Produk
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Masukkan deskripsi produk..."
                className="
                  mt-2
                  w-full
                  resize-none
                  rounded-md
                  border
                  border-tb-red-primary
                  bg-tb-yellow-primary
                  px-4
                  py-3
                  text-sm
                  outline-none
                "
              />
            </div>

            {/* =========================
                GAMBAR
            ========================= */}
            <div>
              <label className="text-sm font-semibold text-tb-black-primary">
                Gambar Produk
              </label>

              <label
                htmlFor="product-image"
                className="
                  mt-2
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-md
                  border
                  border-dashed
                  border-tb-red-primary
                  bg-tb-yellow-primary
                  px-4
                  py-4
                "
              >
                <Upload
                  size={20}
                  className="text-tb-red-primary"
                />

                <span className="text-sm text-tb-black-primary">
                  {imageFile
                    ? imageFile.name
                    : "Tambahkan Gambar"}
                </span>
              </label>

              <input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Preview */}
              {imagePreview && (
                <div className="mt-4 flex justify-center">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <img
                      src={imagePreview}
                      alt="Preview produk"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* =========================
                SUBMIT
            ========================= */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  rounded-full
                  bg-tb-red-primary
                  px-8
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-tb-red-secondary
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : "Simpan"}
              </button>
            </div>

          </form>
        </div>
      </section>

      {/* =========================
          SUCCESS NOTIFICATION
      ========================= */}
      {showSuccess && (
        <ProductNotification
          title="Produk Berhasil Ditambahkan"
          message="Produk berhasil ditambahkan dan sekarang tersedia untuk dibeli."
          primaryLabel="Kembali ke Produk"
          onPrimary={() =>
            navigate("/admin/products")
          }
        />
      )}
    </main>
  );
}

export default CreateProduct;
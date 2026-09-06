import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MapPin,
  User,
  Phone,
} from "lucide-react";

import { useAddress } from "../../context/AddressContext";

function CreateAddress() {
  const navigate = useNavigate();

  const { addAddress } = useAddress();

  const [formData, setFormData] = useState({
    label: "",
    recipientName: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // =========================
    // BASIC VALIDATION
    // =========================
    if (!formData.label.trim()) {
      setError(
        "Nama alamat wajib diisi."
      );
      return;
    }

    if (!formData.recipientName.trim()) {
      setError(
        "Nama penerima wajib diisi."
      );
      return;
    }

    if (!formData.phone.trim()) {
      setError(
        "Nomor telepon wajib diisi."
      );
      return;
    }

    if (!formData.address.trim()) {
      setError(
        "Alamat lengkap wajib diisi."
      );
      return;
    }

    // =========================
    // SAVE TO BACKEND
    // =========================
    try {
      setIsSubmitting(true);

      const result =
        await addAddress(formData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      // =========================
      // SUCCESS
      // =========================
      navigate("/");
    } catch (error) {
      console.error(
        "Create address error:",
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
    <main className="px-10 py-16">
      <section className="mx-auto max-w-[900px]">

        {/* =========================
            TITLE
        ========================= */}
        <h1 className="mb-12 text-center text-3xl font-normal text-tb-black-primary">
          Lengkapi Alamat Pengiriman
        </h1>

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div
            className="
              mb-6
              rounded-lg
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-tb-red-primary
            "
          >
            {error}
          </div>
        )}

        {/* =========================
            FORM
        ========================= */}
        <form onSubmit={handleSubmit}>

          {/* =========================
              NAMA ALAMAT
          ========================= */}
          <div>
            <label
              htmlFor="label"
              className="
                flex
                items-center
                gap-2
                text-base
                text-tb-black-primary
              "
            >
              <MapPin
                size={20}
                className="text-tb-red-primary"
              />

              Nama Alamat
            </label>

            <input
              id="label"
              name="label"
              type="text"
              value={formData.label}
              onChange={handleChange}
              placeholder="Contoh: Rumah Kemayoran"
              required
              className="
                mt-3
                h-[48px]
                w-full
                rounded-lg
                border
                border-tb-red-primary
                bg-tb-yellow-primary
                px-4
                outline-none
                focus:ring-2
                focus:ring-red-200
              "
            />
          </div>

          {/* =========================
              NAMA PENERIMA
          ========================= */}
          <div className="mt-7">
            <label
              htmlFor="recipientName"
              className="
                flex
                items-center
                gap-2
                text-base
                text-tb-black-primary
              "
            >
              <User
                size={20}
                className="text-tb-red-primary"
              />

              Nama Penerima
            </label>

            <input
              id="recipientName"
              name="recipientName"
              type="text"
              value={
                formData.recipientName
              }
              onChange={handleChange}
              placeholder="Contoh: Jelita"
              required
              className="
                mt-3
                h-[48px]
                w-full
                rounded-lg
                border
                border-tb-red-primary
                bg-tb-yellow-primary
                px-4
                outline-none
                focus:ring-2
                focus:ring-red-200
              "
            />
          </div>

          {/* =========================
              NOMOR TELEPON
          ========================= */}
          <div className="mt-7">
            <label
              htmlFor="phone"
              className="
                flex
                items-center
                gap-2
                text-base
                text-tb-black-primary
              "
            >
              <Phone
                size={20}
                className="text-tb-red-primary"
              />

              Nomor Telephone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Contoh: 081234567899"
              required
              className="
                mt-3
                h-[48px]
                w-full
                rounded-lg
                border
                border-tb-red-primary
                bg-tb-yellow-primary
                px-4
                outline-none
                focus:ring-2
                focus:ring-red-200
              "
            />
          </div>

          {/* =========================
              ALAMAT LENGKAP
          ========================= */}
          <div className="mt-7">
            <label
              htmlFor="address"
              className="
                flex
                items-center
                gap-2
                text-base
                text-tb-black-primary
              "
            >
              <MapPin
                size={20}
                className="text-tb-red-primary"
              />

              Alamat Lengkap
            </label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Contoh: Jl. Kemayoran Gempol RT 02 RW 09, Kel. Kebon Kosong, Kec. Kemayoran, Jakarta Pusat, DKI Jakarta"
              rows={4}
              required
              className="
                mt-3
                w-full
                resize-none
                rounded-lg
                border
                border-tb-red-primary
                bg-tb-yellow-primary
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-red-200
              "
            />
          </div>

          {/* =========================
              BUTTONS
          ========================= */}
          <div className="mt-12 flex justify-center gap-24">

            {/* KEMBALI */}
            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="
                rounded-lg
                border
                border-tb-red-primary
                px-8
                py-2.5
                text-sm
                font-medium
                text-tb-red-primary
                transition-colors
                hover:bg-tb-yellow-primary
              "
            >
              Kembali
            </button>

            {/* SIMPAN */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                rounded-lg
                bg-tb-red-primary
                px-8
                py-2.5
                text-sm
                font-medium
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

      </section>
    </main>
  );
}

export default CreateAddress;
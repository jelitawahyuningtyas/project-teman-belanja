import { useState } from "react";
import {
  MapPin,
  ChevronDown,
  Plus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAddress } from "../../context/AddressContext";

function AddressSelector() {
  const navigate = useNavigate();

  const {
    addresses,
    selectedAddress,
    selectAddress,
  } = useAddress();

  const [showAddresses, setShowAddresses] =
    useState(false);

  return (
    <div className="relative z-40 w-full bg-white px-10 py-4">
      <div className="mx-auto max-w-[1200px]">

        {/* =========================
            CURRENT ADDRESS
        ========================= */}
        <button
          type="button"
          onClick={() =>
            setShowAddresses(
              !showAddresses
            )
          }
          className="
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-tb-black-primary
            transition-colors
            hover:text-tb-red-primary
          "
        >
          <MapPin
            size={20}
            strokeWidth={2.2}
            className="text-tb-red-primary"
          />

          <span>
            Alamat Pengantaran:{" "}
            <span className="font-semibold">
              {selectedAddress?.label ||
                "Pilih alamat"}
            </span>
          </span>

          <ChevronDown
            size={16}
            strokeWidth={2.3}
            className={`
              transition-transform
              ${
                showAddresses
                  ? "rotate-180"
                  : ""
              }
            `}
          />
        </button>

        {/* =========================
            ADDRESS DROPDOWN
        ========================= */}
        {showAddresses && (
          <div
            className="
              absolute
              left-10
              top-full
              mt-2
              w-[420px]
              rounded-lg
              border
              border-gray-200
              bg-white
              py-3
              shadow-lg
            "
          >

            {/* TITLE */}
            <div className="px-5 py-2 text-sm font-semibold text-tb-black-primary">
              Alamat Pengantaran
            </div>

            {/* =========================
                ADDRESS LIST
            ========================= */}
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <button
                  type="button"
                  key={address.id}
                  onClick={() => {
                    selectAddress(address.id);
                    setShowAddresses(false);
                  }}
                  className="
                    flex
                    w-full
                    items-start
                    gap-3
                    px-5
                    py-3
                    text-left
                    transition-colors
                    hover:bg-tb-yellow-primary
                  "
                >
                  <MapPin
                    size={18}
                    className="
                      mt-1
                      shrink-0
                      text-tb-red-primary
                    "
                  />

                  <div className="flex-1">

                    {/* LABEL + ACTIVE */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-tb-black-primary">
                        {address.label}
                      </span>

                      {address.id ===
                        selectedAddress?.id && (
                        <span className="text-xs font-semibold text-tb-red-primary">
                          Aktif
                        </span>
                      )}
                    </div>

                    {/* RECIPIENT + PHONE */}
                    <p className="mt-1 text-xs text-gray-600">
                      {address.recipientName} ·{" "}
                      {address.phone}
                    </p>

                    {/* FULL ADDRESS */}
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      {address.address}
                    </p>

                  </div>
                </button>
              ))
            ) : (
              <div className="px-5 py-6 text-sm text-gray-500">
                Belum ada alamat.
              </div>
            )}

            {/* =========================
                DIVIDER
            ========================= */}
            <div className="my-2 border-t border-gray-100" />

            {/* =========================
                ADD ADDRESS
            ========================= */}
            <button
              type="button"
              onClick={() => {
                setShowAddresses(false);
                navigate("/address/create");
              }}
              className="
                flex
                w-full
                items-center
                gap-3
                px-5
                py-3
                text-sm
                font-medium
                text-tb-red-primary
                transition-colors
                hover:bg-tb-yellow-primary
              "
            >
              <Plus size={18} />

              <span>
                Tambah Alamat
              </span>
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default AddressSelector;
import { Minus, Plus } from "lucide-react";

function QuantitySelector({
  quantity,
  max,
  onIncrease,
  onDecrease,
  onChange,
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Decrease */}
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Kurangi jumlah"
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-md
          border
          border-tb-red-primary
          bg-white
          text-tb-red-primary
          transition-colors
          hover:bg-tb-yellow-primary
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <Minus size={16} strokeWidth={2.5} />
      </button>

      {/* Quantity Input */}
      <input
        type="number"
        min="1"
        max={max}
        value={quantity}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Jumlah barang"
        className="
          h-8
          w-12
          rounded-md
          border
          border-tb-red-primary
          bg-tb-yellow-primary
          text-center
          text-sm
          font-medium
          text-tb-black-primary
          outline-none
          focus:ring-1
          focus:ring-tb-red-primary
        "
      />

      {/* Increase */}
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Tambah jumlah"
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-md
          border
          border-tb-red-primary
          bg-white
          text-tb-red-primary
          transition-colors
          hover:bg-tb-yellow-primary
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <Plus size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default QuantitySelector;
import { ShoppingBag, Trash2 } from "lucide-react";

import QuantitySelector from "../common/QuantitySelector";

function CartItem({
  product,
  quantity,
  selected,
  onToggleSelect,
  onIncrease,
  onDecrease,
  onChangeQuantity,
  onRemove,
}) {
  const itemTotal = product.price * quantity;

  return (
    <div
      className="
        flex
        items-center
        gap-5
        rounded-xl
        border
        border-[#E5E5E5]
        bg-white
        px-6
        py-4
        shadow-sm
      "
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggleSelect}
        aria-label={`Pilih ${product.name}`}
        className="
          h-5
          w-5
          shrink-0
          cursor-pointer
          accent-tb-red-primary
        "
      />

      {/* Product Image */}
      <div
        className="
          flex
          h-[70px]
          w-[90px]
          shrink-0
          items-center
          justify-center
        "
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Product Information */}
      <div className="min-w-0 flex-1">
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
          Produk {product.category}
        </span>

        {/* Product Name */}
        <h3
          className="
            mt-2
            text-sm
            font-medium
            leading-snug
            text-tb-black-primary
          "
        >
          {product.name}
        </h3>

        {/* Unit Price */}
        <div className="mt-1 flex items-center gap-2">
          <ShoppingBag
            size={16}
            strokeWidth={2.2}
            className="text-tb-red-primary"
          />

          <span className="text-sm text-tb-black-primary">
            Rp{product.price.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Quantity */}
      <div className="shrink-0">
        <QuantitySelector
          quantity={quantity}
          max={product.stock}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onChange={onChangeQuantity}
        />
      </div>

      {/* Item Total */}
      <div className="w-[100px] shrink-0 text-right">
        <p className="text-sm font-semibold text-tb-black-primary">
          Rp{itemTotal.toLocaleString("id-ID")}
        </p>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Hapus ${product.name} dari keranjang`}
        className="
          flex
          shrink-0
          items-center
          justify-center
          text-tb-red-primary
          transition-colors
          hover:text-tb-red-secondary
        "
      >
        <Trash2 size={22} strokeWidth={2.2} />
      </button>
    </div>
  );
}

export default CartItem;
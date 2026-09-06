import { useState } from "react";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  return (
    <div
      className="
        w-[215px]
        shrink-0
        rounded-xl
        border
        border-[#E5E5E5]
        bg-tb-yellow-primary
        p-4
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      {/* Product Information */}
      <Link
        to={`/product/${product.id}`}
        className="block"
      >
        {/* Category */}
        <div className="mb-3 flex justify-center">
          <span
            className="
              rounded-full
              bg-white
              px-4
              py-1
              text-[10px]
              font-semibold
              text-tb-red-primary
            "
          >
            Produk {product.category}
          </span>
        </div>

        {/* Product Image */}
        <div className="flex h-[135px] items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Product Name */}
        <h3
          className="
            mt-4
            min-h-[42px]
            text-sm
            font-medium
            leading-snug
            text-tb-black-primary
          "
        >
          {product.name}
        </h3>
      </Link>

      {/* Price + Add Button */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag
            size={17}
            strokeWidth={2.2}
            className="text-tb-red-primary"
          />

          <span className="text-sm font-semibold text-tb-red-primary">
            Rp{product.price.toLocaleString("id-ID")}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`Tambah ${product.name} ke keranjang`}
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-tb-red-primary
            text-white
            transition-transform
            duration-200
            hover:scale-110
          "
        >
          {added ? (
            <Check size={17} strokeWidth={2.8} />
          ) : (
            <Plus size={18} strokeWidth={2.8} />
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
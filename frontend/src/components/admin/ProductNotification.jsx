import { CheckCircle } from "lucide-react";

function ProductNotification({
  title,
  message,
  primaryLabel,
  onPrimary,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-6">
      <div className="w-full max-w-[450px] rounded-xl bg-white p-8 text-center shadow-xl">

        <CheckCircle
          size={72}
          strokeWidth={1.8}
          className="mx-auto text-green-600"
        />

        <h2 className="mt-5 text-2xl font-semibold text-tb-black-primary">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {message}
        </p>

        <button
          type="button"
          onClick={onPrimary}
          className="
            mt-8
            rounded-full
            bg-tb-red-primary
            px-8
            py-2.5
            text-sm
            font-semibold
            text-white
            transition-colors
            hover:bg-tb-red-secondary
          "
        >
          {primaryLabel}
        </button>

      </div>
    </div>
  );
}

export default ProductNotification;
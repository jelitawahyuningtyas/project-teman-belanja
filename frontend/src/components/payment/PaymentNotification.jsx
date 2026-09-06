import {
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

function PaymentNotification({
  type,
  title,
  message,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}) {
  const notificationConfig = {
    success: {
      icon: CheckCircle,
      iconClass: "text-green-600",
    },
    failed: {
      icon: XCircle,
      iconClass: "text-tb-red-primary",
    },
    expired: {
      icon: AlertCircle,
      iconClass: "text-tb-red-primary",
    },
  };

  const config = notificationConfig[type] || notificationConfig.success;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-6">
      <div className="w-full max-w-[450px] rounded-xl bg-white p-8 text-center shadow-xl">

        {/* Icon */}
        <Icon
          size={72}
          strokeWidth={1.8}
          className={`mx-auto ${config.iconClass}`}
        />

        {/* Title */}
        <h2 className="mt-5 text-2xl font-semibold text-tb-black-primary">
          {title}
        </h2>

        {/* Message */}
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {message}
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-3">

          {secondaryLabel && (
            <button
              type="button"
              onClick={onSecondary}
              className="
                rounded-lg
                border
                border-tb-red-primary
                px-6
                py-2.5
                text-sm
                font-semibold
                text-tb-red-primary
                transition-colors
                hover:bg-tb-yellow-primary
              "
            >
              {secondaryLabel}
            </button>
          )}

          {primaryLabel && (
            <button
              type="button"
              onClick={onPrimary}
              className="
                rounded-lg
                bg-tb-red-primary
                px-6
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
          )}

        </div>
      </div>
    </div>
  );
}

export default PaymentNotification;
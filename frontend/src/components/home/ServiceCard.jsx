function ServiceCard({ service }) {
  const Icon = service.icon;

  return (
    <div className="flex w-[220px] flex-col items-center text-center">
      <div
        className="
          mb-6
          flex
          h-28
          w-28
          items-center
          justify-center
          rounded-full
          bg-tb-yellow-primary
        "
      >
        <Icon
          size={48}
          strokeWidth={2.2}
          className="text-tb-red-primary"
        />
      </div>

      <h3
        className="
          text-lg
          font-medium
          leading-snug
          text-tb-red-primary
        "
      >
        {service.title}
      </h3>
    </div>
  );
}

export default ServiceCard;
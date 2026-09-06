import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="
        group
        flex
        h-[130px]
        w-[128px]
        flex-col
        overflow-hidden
        rounded-lg
        bg-tb-red-secondary
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <div className="flex flex-1 items-center justify-center px-3 pt-3">
        <img
          src={category.image}
          alt={category.name}
          className="
            h-[78px]
            w-full
            object-contain
            transition-transform
            duration-200
            group-hover:scale-105
          "
        />
      </div>

      <div className="px-2 pb-3">
        <div className="mb-2 border-t border-white/70" />

        <p
          className="
            text-center
            text-[11px]
            font-semibold
            leading-tight
            text-tb-white-primary
          "
        >
          {category.name}
        </p>
      </div>
    </Link>
  );
}

export default CategoryCard;
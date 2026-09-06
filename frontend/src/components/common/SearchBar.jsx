import { Search } from "lucide-react";

function SearchBar({
  placeholder = "Cari keperluanmu di sini...",
  value,
  onChange,
  onSubmit,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-9 w-full max-w-[255px] items-center gap-2 rounded-full border-[1.5px] border-tb-red-primary bg-tb-white-primary px-3"
    >
      <Search
        size={19}
        strokeWidth={2}
        className="shrink-0 text-tb-red-primary"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm font-normal text-tb-black-primary outline-none placeholder:text-gray-500"
      />
    </form>
  );
}

export default SearchBar;
import { Search } from "lucide-react";

function SearchBar({ search, setSearch }) {
  return (
    <div className="relative w-full max-w-xl">

      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  );
}

export default SearchBar;
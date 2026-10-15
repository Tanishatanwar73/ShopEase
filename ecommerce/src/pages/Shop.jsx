import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import { getProducts } from "../services/api";

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">All products</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Shop collection</h1>
          </div>
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        {loading && <p className="py-12 text-center text-lg text-slate-500">Loading products...</p>}
        {error && <p className="py-12 text-center text-lg text-red-500">{error}</p>}

        {!loading && !error && <ProductGrid products={filteredProducts} />}
      </div>
    </div>
  );
}

export default Shop;

import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import { getBestSellers } from "../services/api";

function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBestSellers();

        if (!data.success) {
          setError(
            data.message || "Failed to load best sellers"
          );
          return;
        }

        setProducts(data.products || []);
      } catch (err) {
        console.error("Best sellers error:", err);
        setError("Failed to load best sellers");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-indigo-100 via-violet-50 to-fuchsia-100 p-8 shadow-inner">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Top picks
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Best sellers
          </h1>

          <p className="mt-3 max-w-xl text-slate-600">
            The most-loved products customers keep coming back for.
          </p>
        </div>

        {loading && (
          <p className="py-12 text-center text-lg text-slate-500">
            Loading best sellers...
          </p>
        )}

        {error && (
          <p className="py-12 text-center text-lg text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && (
          <ProductGrid products={products} />
        )}

      </div>
    </div>
  );
}

export default BestSellers;
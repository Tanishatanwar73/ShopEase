import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../services/api";

function Deals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const deals = (data.products || []).filter((product) => Number(product.price) < 2500 || product.category === "Deals");
        setProducts(deals);
      } catch (err) {
        console.error(err);
        setError("Failed to load deals");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-amber-100 via-orange-50 to-rose-100 p-8 shadow-inner">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Limited time</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Deals of the day</h1>
          <p className="mt-3 max-w-xl text-slate-600">Fresh discounts on trending essentials, gadgets, fashion, and home picks.</p>
        </div>

        {loading && <p className="py-12 text-center text-lg text-slate-500">Loading deals...</p>}
        {error && <p className="py-12 text-center text-lg text-red-500">{error}</p>}

        {!loading && !error && <ProductGrid products={products} />}
      </div>
    </div>
  );
}

export default Deals;

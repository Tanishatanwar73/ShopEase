
import { useState } from "react";
import { Heart, Star, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { addToCart } from "../services/api";

function Wishlist() {
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const [removingId, setRemovingId] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  const handleRemove = async (product) => {
    const productId = product._id || product.id;

    setRemovingId(productId);
    setError("");
    setCartMessage("");

    try {
      const result = await toggleWishlist(product);

      if (!result.success) {
        setError(result.message || "Could not remove this product.");
      }
    } catch (err) {
      console.error("Wishlist removal failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (product) => {
    const productId = product._id || product.id;

    if (!productId) {
      setError("Product ID is missing.");
      return;
    }

    setAddingId(productId);
    setError("");
    setCartMessage("");

    try {
      const result = await addToCart(productId);

      if (!result?.success) {
        setError(result?.message || "Could not add this product to cart.");
        return;
      }

      setCartMessage("Product added to cart!");
    } catch (err) {
      console.error("Add from wishlist to cart failed:", err);
      setError("Something went wrong while adding to cart.");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20 text-center">
        <p className="text-slate-600">Loading your saved products...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <Heart size={22} fill="currentColor" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
              Saved items
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Your wishlist
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {wishlist.length} saved{" "}
              {wishlist.length === 1 ? "product" : "products"}
            </p>
          </div>
        </header>

        {error && (
          <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {cartMessage && (
          <p role="status" className="mb-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600">
            {cartMessage}
          </p>
        )}

        {wishlist.length === 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <Heart size={36} className="mx-auto text-rose-400" />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-slate-500">
              Visit the shop and click a product's heart to save it here.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Explore products <ArrowRight size={16} />
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((product) => {
              const id = product._id || product.id;

              const image =
                product.image ||
                product.imageUrl ||
                (Array.isArray(product.images)
                  ? product.images[0]
                  : null) ||
                "https://placehold.co/600x400?text=No+Product+Image";

              return (
                <article
                  key={id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link to={`/products/${id}`}>
                    <img
                      src={image}
                      alt={product.name || product.title || "Product"}
                      className="h-64 w-full object-cover"
                    />
                  </Link>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to={`/products/${id}`}
                        className="text-xl font-semibold text-slate-900 hover:text-indigo-600"
                      >
                        {product.name || product.title || "Unnamed product"}
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleRemove(product)}
                        disabled={removingId === id}
                        aria-label="Remove from wishlist"
                        className="shrink-0 rounded-full bg-rose-50 p-2 text-rose-500 hover:bg-rose-100 disabled:opacity-50"
                      >
                        <Heart size={17} fill="currentColor" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                      <Star
                        size={15}
                        className="fill-amber-400 text-amber-400"
                      />
                      {Number(product.rating || 4.8).toFixed(1)}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-2xl font-bold text-slate-900">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={addingId === id}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <ShoppingBag size={15} />
                        {addingId === id ? "Adding..." : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

export default Wishlist;

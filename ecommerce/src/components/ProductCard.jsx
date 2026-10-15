
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";

import { useWishlist } from "../context/WishlistContext";
import { addToCart } from "../services/api";

function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const productId = product?._id || product?.id;

  const rating = Number(product?.rating) || 4.8;
  const price = Number(product?.price) || 0;

  const originalPrice =
    Number(product?.originalPrice) || Math.round(price * 1.25);

  const isSaved = productId ? isInWishlist(productId) : false;

  const image =
    product?.image ||
    product?.imageUrl ||
    (Array.isArray(product?.images) ? product.images[0] : null) ||
    "https://placehold.co/600x400?text=Product";

  const discount =
    originalPrice > 0
      ? Math.max(
          0,
          Math.round(((originalPrice - price) / originalPrice) * 100)
        )
      : 0;

  // ADD OR REMOVE FROM WISHLIST
  const handleWishlist = async () => {
    if (wishlistLoading || !productId) return;

    if (!localStorage.getItem("token")) {
      setWishlistError("Please log in to use your wishlist.");
      return;
    }

    setWishlistLoading(true);
    setWishlistError("");

    try {
      const result = await toggleWishlist(product);

      if (!result?.success) {
        setWishlistError(
          result?.message || "Failed to update wishlist."
        );
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      setWishlistError("Something went wrong. Please try again.");
    } finally {
      setWishlistLoading(false);
    }
  };

  // ADD TO CART
  const handleCart = async () => {
    if (cartLoading || !productId) return;

    if (!localStorage.getItem("token")) {
      setCartMessage("Please log in to add products to your cart.");
      return;
    }

    setCartLoading(true);
    setCartMessage("");

    try {
      const result = await addToCart(productId);

      if (!result?.success) {
        setCartMessage(
          result?.message || "Could not add product to cart."
        );
        return;
      }

      setCartMessage("Product added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      setCartMessage("Something went wrong. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(79,70,229,0.12)]">
      {/* PRODUCT IMAGE */}
      <div className="relative overflow-hidden">
        <Link to={`/products/${productId}`}>
          <img
            src={image}
            alt={product?.name || "Product"}
            className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                "https://placehold.co/600x400?text=Product";
            }}
          />
        </Link>

        {/* CATEGORY */}
        <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
          {product?.category || "Popular"}
        </span>

        {/* WISHLIST BUTTON */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading || !productId}
          aria-label={
            isSaved ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isSaved}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
            isSaved
              ? "text-rose-500"
              : "text-slate-700 hover:text-rose-500"
          }`}
        >
          <Heart
            size={16}
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="space-y-4 p-5">
        {/* RATING AND SHIPPING */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
            <Star size={12} fill="currentColor" />
            {rating.toFixed(1)}
          </div>

          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Free shipping
          </span>
        </div>

        {/* NAME AND DESCRIPTION */}
        <div>
          <h2 className="line-clamp-2 text-lg font-bold text-slate-900">
            {product?.name || "Unnamed product"}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {product?.description || "Discover this product."}
          </p>
        </div>

        {/* PRICE AND DISCOUNT */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-bold text-slate-900">
              ₹{price.toLocaleString("en-IN")}
            </p>

            {discount > 0 && (
              <p className="text-sm text-slate-400 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {discount > 0 && (
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500">
              Save {discount}%
            </span>
          )}
        </div>

        {/* WISHLIST FEEDBACK */}
        {wishlistError && (
          <p role="alert" className="text-sm text-red-500">
            {wishlistError}
          </p>
        )}

        {/* CART FEEDBACK */}
        {cartMessage && (
          <p
            role="status"
            className={`text-sm ${
              cartMessage === "Product added to cart!"
                ? "text-emerald-600"
                : "text-red-500"
            }`}
          >
            {cartMessage}
          </p>
        )}

        {/* ADD TO CART */}
        <button
          type="button"
          onClick={handleCart}
          disabled={cartLoading || !productId}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShoppingBag size={16} />
          {cartLoading ? "Adding..." : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

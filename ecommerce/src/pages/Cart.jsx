import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
} from "../services/api";

function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadCart() {
      setLoading(true);
      setError("");

      const result = await getCart();

      if (!active) return;

      if (result.success) {
        setItems(result.items || []);
      } else {
        setError(result.message || "Could not load your cart.");
      }

      setLoading(false);
    }

    loadCart();

    return () => {
      active = false;
    };
  }, []);

  const changeQuantity = async (item, quantity) => {
    const product = item.product;
    if (!product?._id || quantity < 1 || busyId) return;

    setBusyId(product._id);
    setError("");

    const result = await updateCartQuantity(product._id, quantity);

    if (result.success) {
      setItems(result.items || []);
    } else {
      setError(result.message || "Could not update quantity.");
    }

    setBusyId(null);
  };

  const removeItem = async (item) => {
    const productId = item.product?._id;
    if (!productId || busyId) return;

    setBusyId(productId);
    setError("");

    const result = await removeFromCart(productId);

    if (result.success) {
      setItems(result.items || []);
    } else {
      setError(result.message || "Could not remove product.");
    }

    setBusyId(null);
  };

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.product?.price || 0) * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 199;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm"
        >
          <ArrowLeft size={16} /> Back to shop
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Your cart
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Shopping bag
            </h1>
          </div>
        </div>

        {error && (
          <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </p>
        )}

        {items.length === 0 ? (
          <div className="rounded-3xl border bg-white p-12 text-center">
            <ShoppingBag className="mx-auto mb-4 text-slate-400" size={42} />
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-slate-500">
              Products you add to your cart will appear here.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-block rounded-full bg-indigo-600 px-6 py-3 text-white"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.5fr_0.7fr]">
            <div className="space-y-4">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;

                const productId = product._id;
                const image =
                  product.image ||
                  product.imageUrl ||
                  product.images?.[0] ||
                  "https://placehold.co/300x300?text=Product";

                return (
                  <div
                    key={productId}
                    className="flex flex-col gap-4 rounded-3xl border bg-white p-4 shadow-sm sm:flex-row"
                  >
                    <img
                      src={image}
                      alt={product.name || "Product"}
                      className="h-28 w-full rounded-2xl object-cover sm:w-28"
                    />

                    <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {product.name}
                        </h2>
                        <p className="mt-2 text-xl font-bold">
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <div className="flex items-center gap-3 rounded-full border px-3 py-2">
                          <button
                            type="button"
                            disabled={busyId !== null || item.quantity <= 1}
                            onClick={() =>
                              changeQuantity(item, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            type="button"
                            disabled={busyId !== null}
                            onClick={() =>
                              changeQuantity(item, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={busyId !== null}
                          onClick={() => removeItem(item)}
                          className="inline-flex items-center gap-2 text-sm text-red-500"
                        >
                          <Trash2 size={15} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Order summary</h2>

              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
              </div>

              <div className="mt-5 flex justify-between border-t pt-5 text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>

              <button
                type="button"
                disabled
                className="mt-6 w-full rounded-full bg-indigo-600 px-5 py-3 text-white opacity-70"
                title="Checkout has not been connected yet"
              >
                Proceed to checkout
              </button>

              <Link
                to="/shop"
                className="mt-3 block rounded-full border px-5 py-3 text-center text-sm font-semibold"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
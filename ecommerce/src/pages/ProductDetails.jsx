import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getProduct(id);

        console.log("Product API response:", result);

        if (!result || !result.success || !result.product) {
          setProduct(null);
          setError(
            result?.message || "Product not found"
          );
          return;
        }

        setProduct(result.product);
      } catch (error) {
        console.error("Product details error:", error);

        setProduct(null);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">
          Loading product...
        </p>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Product not found
          </h1>

          <p className="mt-3 text-gray-500">
            {error || "This product does not exist."}
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/shop")}
          className="mb-6 text-gray-600 hover:text-black"
        >
          ← Back to Products
        </button>

        {/* Product */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Image */}
            <div className="bg-gray-100 flex items-center justify-center min-h-[450px]">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full max-h-[600px] object-cover"
                />
              ) : (
                <div className="text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Information */}
            <div className="p-8">

              {/* Category */}
              <p className="text-green-600 font-medium">
                {product.category}
              </p>

              {/* Name */}
              <h1 className="text-4xl font-bold text-gray-900 mt-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">

                <span className="text-yellow-500 text-xl">
                  {"★".repeat(
                    Math.round(product.rating || 0)
                  )}
                </span>

                <span className="text-gray-500">
                  {product.rating || 0}
                  {" "}
                  ({product.reviewCount || 0} reviews)
                </span>

              </div>

              {/* Price */}
              <h2 className="text-3xl font-bold text-gray-900 mt-6">
                ₹{product.price}
              </h2>

              {/* Description */}
              <p className="text-gray-600 mt-6 leading-relaxed">
                {product.description}
              </p>

              {/* Stock */}
              <div className="mt-6">

                {product.stock > 0 ? (
                  <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full">
                    In Stock — {product.stock} available
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full">
                    Out of Stock
                  </span>
                )}

              </div>

              {/* Add to cart */}
              <button
                disabled={product.stock <= 0}
                className="w-full mt-8 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetails;
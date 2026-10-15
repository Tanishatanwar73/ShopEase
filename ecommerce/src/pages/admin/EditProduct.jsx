import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getProduct, updateProduct } from "../../services/api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    image: "",
    stock: "",
    isDeal: false,
    isBestSeller: false,
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // GET PRODUCT
  // ========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getProduct(id);

        if (!result.success || !result.product) {
          setError(
            result.message || "Failed to load product"
          );
          return;
        }

        const data = result.product;

        setProduct({
          name: data.name || "",
          description: data.description || "",
          price: data.price ?? "",
          category: data.category || "Electronics",
          image: data.image || "",
          stock: data.stock ?? "",
          isDeal: data.isDeal ?? false,
          isBestSeller: data.isBestSeller ?? false,
        });
      } catch (error) {
        console.error("Fetch product error:", error);
        setError("Cannot connect to server");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // UPDATE PRODUCT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!product.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!product.description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (product.price === "" || Number(product.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (product.stock === "" || Number(product.stock) < 0) {
      setError("Please enter a valid stock.");
      return;
    }

    if (!product.category) {
      setError("Please select a category.");
      return;
    }

    try {
      setUpdating(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const data = {
        name: product.name.trim(),
        description: product.description.trim(),
        price: Number(product.price),
        category: product.category,
        stock: Number(product.stock),
        image: product.image || "",
        isDeal: product.isDeal,
        isBestSeller: product.isBestSeller,
      };

      console.log("Sending update:", data);

      const result = await updateProduct(
        id,
        data,
        token
      );

      console.log("Update response:", result);

      if (!result.success) {
        setError(
          result.message || "Failed to update product."
        );
        return;
      }

      alert("Product updated successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error("Update product error:", error);

      setError(
        error.message || "Failed to update product."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ========================================
  // ADMIN CHECK
  // ========================================

  if (!user || user.role !== "admin") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">
          Admin access required
        </h1>
      </div>
    );
  }

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">
          Loading product...
        </p>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">

          <h1 className="text-3xl font-bold">
            Edit Product
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Update product information.
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>

              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Electronics">
                  Electronics
                </option>

                <option value="Clothing">
                  Clothing
                </option>

                <option value="Shoes">
                  Shoes
                </option>

                <option value="Beauty">
                  Beauty
                </option>

                <option value="Home">
                  Home
                </option>
              </select>
            </div>

            {/* Product Placement */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Placement
              </label>

              <div className="space-y-3">

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={product.isDeal}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        isDeal: e.target.checked,
                      }))
                    }
                  />

                  <span>Add to Deals</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={product.isBestSeller}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        isBestSeller: e.target.checked,
                      }))
                    }
                  />

                  <span>Mark as Best Seller</span>
                </label>

              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Image URL
              </label>

              <input
                type="url"
                name="image"
                value={product.image}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">

              <button
                type="submit"
                disabled={updating}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updating
                  ? "Updating..."
                  : "Update Product"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products")
                }
                className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
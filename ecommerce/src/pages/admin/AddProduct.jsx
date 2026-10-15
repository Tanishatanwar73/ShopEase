import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { createProduct } from "../../services/api";

function AddProduct() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    isDeal: false,
    isBestSeller: false,
  });

  const [image, setImage] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        return;
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("isDeal", formData.isDeal);
      data.append("isBestSeller", formData.isBestSeller);

      if (image) {
        data.append("image", image);
      }

      const result = await createProduct(data, token);

      if (!result.success) {
        setError(result.message || "Failed to create product");
        return;
      }

      alert("Product added successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">
          Admin access required
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Add Product
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-5">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 space-y-5"
      >

        {/* Product Name */}
        <div>
          <label className="block font-medium mb-1">
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            rows="4"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-1">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Electronics"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block font-medium mb-1">
            Stock
          </label>

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* Product Placement */}
        <div>
          <label className="block font-medium mb-1">
            Product Placement
          </label>

          <div className="space-y-3">

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isDeal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isDeal: e.target.checked,
                  })
                }
              />

              <span>Add to Deals</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isBestSeller: e.target.checked,
                  })
                }
              />

              <span>Mark as Best Seller</span>
            </label>

          </div>
        </div>

        {/* Product Image */}
        <div>
          <label className="block font-medium mb-1">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Add Product Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>

      </form>

    </div>
  );
}

export default AddProduct;
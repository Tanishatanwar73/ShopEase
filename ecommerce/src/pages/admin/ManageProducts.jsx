import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getProducts, deleteProduct } from "../../services/api";

function ManageProducts() {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get real products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.message || "Failed to load products");
      }
    } catch (error) {
      console.error(error);
      setError("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const data = await deleteProduct(id, token);

      if (!data.success) {
        alert(data.message || "Failed to delete product");
        return;
      }

      alert("Product deleted successfully");

      // Remove deleted product from screen
      setProducts(products.filter((product) => product._id !== id));

    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
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
    <div className="max-w-7xl mx-auto p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Manage Products
        </h1>

        <Link
          to="/admin/products/add"
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          + Add Product
        </Link>

      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
          <p className="text-gray-600">
            No products found.
          </p>

          <Link
            to="/admin/products/add"
            className="text-blue-600 mt-2 inline-block"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full border-collapse bg-white shadow rounded-lg">

            <thead>
              <tr className="bg-gray-100">

                <th className="p-4 text-left">
                  Image
                </th>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Price
                </th>

                <th className="p-4 text-left">
                  Stock
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {products.map((product) => (

                <tr
                  key={product._id}
                  className="border-t"
                >

                  <td className="p-4">

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        No Image
                      </div>
                    )}

                  </td>

                  <td className="p-4 font-medium">
                    {product.name}
                  </td>

                  <td className="p-4">
                    {product.category}
                  </td>

                  <td className="p-4">
                    ₹{product.price}
                  </td>

                  <td className="p-4">
                    {product.stock}
                  </td>

                  <td className="p-4">

                    <div className="flex gap-2">

                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(product._id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default ManageProducts;
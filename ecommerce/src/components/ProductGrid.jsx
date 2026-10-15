import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">

        <h2 className="text-xl font-semibold text-gray-700">
          No products found
        </h2>

        <p className="text-gray-500 mt-2">
          Try searching for something else.
        </p>

      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}

    </div>
  );
}

export default ProductGrid;
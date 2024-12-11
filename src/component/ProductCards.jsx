import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // React Icons for heart icon
import axios from "axios"; // Make sure you install axios for HTTP requests

const ProductCards = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      image: "gg", // Replace with actual image paths
      amount: 50.99,
      isFavorite: false,
    },
    {
      id: 2,
      name: "Smartphone",
      image: "gg", // Replace with actual image paths
      amount: 299.99,
      isFavorite: false,
    },
    {
      id: 3,
      name: "Gaming Chair",
      image: "gg", // Replace with actual image paths
      amount: 149.49,
      isFavorite: false,
    },
    {
      id: 4,
      name: "Smartwatch",
      image: "gg", // Replace with actual image paths
      amount: 89.99,
      isFavorite: false,
    },
  ]);

  const handleFavoriteToggle = async (productId) => {
    // Find the product being clicked on and toggle its favorite status
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        product.isFavorite = !product.isFavorite; // Toggle favorite
      }
      return product;
    });

    // Update local state first
    setProducts(updatedProducts);

    // Send the updated favorite status to the backend
    try {
      await axios.post("http://localhost:5000/api/products/toggle-favorite", {
        productId,
        isFavorite: updatedProducts.find((p) => p.id === productId).isFavorite,
      });
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      // Optionally revert the state if API request fails
      setProducts(products); // Rollback the state change
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">
              ${product.amount.toFixed(2)}
            </p>
            <div className="flex items-center space-x-3">
              <button
                className="text-xl text-red-500 hover:text-red-700"
                onClick={() => handleFavoriteToggle(product.id)}
              >
                {product.isFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
              <button className="text-xl mx-5 bg-gray-500 text-white hover:bg-gray-700">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;

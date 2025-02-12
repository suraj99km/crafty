import React, { useState } from "react";
import Link from "next/link";
import { Product, Artist } from "@/Types";
import { ShoppingCart } from "lucide-react"; // Cart Icon

type Props = {
  product: Product;
  artist: Artist | null;
};

const ProductDetails: React.FC<Props> = ({ product, artist }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Track number of products in cart

  const handleAddToCart = () => {
    setIsAdding(true);
    
    setTimeout(() => {
      setIsAdding(false);
  
      // Get existing cart from localStorage
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push(product); // Add product to cart
      localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
  
      setCartCount(cart.length); // Update cart count
    }, 1000);
  };
  

  return (
    <div className="max-container mt-20">
      <div className="flex flex-col md:flex-row w-full bg-white shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-[400px] object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-6">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-1">₹</span> {product.price}
            </h2>
          </div>

          <p className="text-md text-gray-500 mt-2">{product.description}</p>

          {/* Artist Section */}
          {artist && (
            <div className="mt-4 flex items-center space-x-2">
              <p className="text-sm text-gray-500">Crafted by:</p>
              <Link
                href={`/artists/${artist.id}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                {artist.name}
              </Link>
              <img
                src={artist.profile_picture}
                alt={artist.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="mt-6 px-4">
        <button
          onClick={handleAddToCart}
          className={`${
            isAdding ? "bg-green-500 animate-pulse" : "bg-green-600"
          } text-white py-3 px-6 rounded-md w-full font-semibold transition-all duration-300 ease-in-out hover:bg-green-700`}
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
         <div className="fixed bottom-6 right-6 z-50">
            <Link href="/cart">
            <button className="bg-green-800 text-white font-semibold py-3 px-5 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-700 transition-all duration-300">
                <ShoppingCart size={20} />
                <span>{cartCount} Product{cartCount > 1 ? "s" : ""}</span>
            </button>
            </Link>
        </div>
        )}

    </div>
  );
};

export default ProductDetails;

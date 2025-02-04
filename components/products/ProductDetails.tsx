import React, { useState } from "react";
import Link from "next/link";
import { Product, Artist } from "@/Types";

type Props = {
  product: Product;
  artist: Artist | null;
};

const ProductDetails: React.FC<Props> = ({ product, artist }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    // Simulate add to cart animation (You can replace this with actual functionality)
    setTimeout(() => {
      setIsAdding(false);
      alert("Product added to cart!"); // Simulate adding product to cart
    }, 1000); // Adjust duration as needed for the animation
  };

  return (
    <div className="max-container mt-24">
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
      <div className="mt-6">
        <button
          onClick={handleAddToCart}
          className={`${
            isAdding ? "bg-green-500 animate-pulse" : "bg-green-600"
          } text-white py-3 px-6 rounded-lg w-full transition-all duration-300 ease-in-out hover:bg-green-700`}
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

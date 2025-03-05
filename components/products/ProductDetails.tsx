"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product, Artist } from "@/Types";
import { ShoppingCart, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  product: Product;
  artist: Artist | null;
};

const ProductDetails: React.FC<Props> = ({ product, artist }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Load cart count from localStorage on mount
  useEffect(() => {
    const cart: (Product & { quantity: number })[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalQuantity = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    setCartCount(totalQuantity);
  }, []);

  const handleAddToCart = () => {
    setIsAdding(true);
  
    setTimeout(() => {
      setIsAdding(false);
  
      // Get existing cart from localStorage
      let cart: (Product & { quantity: number })[] = JSON.parse(localStorage.getItem("cart") || "[]");
  
      // Find if the product already exists in the cart
      const existingProductIndex = cart.findIndex((item) => item.id === product.id);
  
      if (existingProductIndex !== -1) {
        // If product exists, increase quantity
        cart[existingProductIndex].quantity += 1;
      } else {
        // If product doesn't exist, add with quantity 1
        cart.push({ ...product, quantity: 1 });
      }
  
      // Update cart in localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
  
      // Update cart count
      const totalQuantity = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(totalQuantity);
  
      // Show toast notification
      toast.success(`${product.title} added to cart!`, {
        duration: 3000, // Auto-close after 3 seconds
      });
    }, 500);
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-container my-20">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-24 left-4 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-100 transition-all duration-200"
      >
        <ChevronLeft size={24} className="text-gray-800" />
      </button>

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
            <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
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
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg flex justify-center items-center border-t">
        <button
          onClick={handleAddToCart}
          className={`${
            isAdding ? "bg-green-500 animate-pulse" : "bg-green-600"
          } text-white w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ease-in-out hover:bg-green-700`}
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 right-6 z-50">
          <Link href="/cart">
            <button className="bg-green-800 text-white font-semibold py-3 px-5 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-700 transition-all duration-300">
              <ShoppingCart size={20} />
              <span>{cartCount}</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

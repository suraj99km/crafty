"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/Types";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Back Icon
import { useRouter } from "next/navigation";
import CartList from "@/components/cart/CartList"; // Assuming this is the correct import for CartList
import PopularProducts from "@/components/home/PopularProducts";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const handlePlaceOrder = () => {
    alert("Order Placed!");
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1)); // Multiplying price with quantity
    }, 0);
  };

  const router = useRouter();

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Handle Explore More Button
  const handleExploreMore = () => {
    router.push("/products?sort=recentlyAdded"); // Redirect to the explore page
  };

  return (
    <div className="mt-16 max-container min-h-screen flex flex-col p-3">
      {/* Back Button, Title, and Explore More Button */}
      <div className="flex items-center justify-between mb-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="bg-white rounded-full p-3 hover:bg-gray-100 transition-all duration-200"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>

        {/* Cart Title */}
        <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>

        {/* Explore More Button */}
        <button
          onClick={handleExploreMore}
          className="inline-block px-2 py-2 font-semibold truncate text-white bg-red-500 rounded-lg shadow-md transition-all duration-300 hover:bg-red-700 hover:shadow-lg active:scale-95"
        >
          Explore more
        </button>
      </div>

      <div className="mt-1 flex-1">
    {cartItems.length === 0 ? (
        <div>
        <p className="text-center text-gray-500">Your cart is empty. Add some products to it!</p>
        {/* Show Popular Products when cart is empty */}
        <div className="mt-6">
            <PopularProducts />
        </div>
        </div>
    ) : (
        <CartList cartItems={cartItems} setCartItems={setCartItems} />
    )}
    </div>


      {/* Place Order Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg flex justify-between items-center border-t">
          <span className="text-lg font-semibold">
            Total: ₹ {calculateTotal()}
          </span>
          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;

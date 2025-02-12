"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/Types";
import CartList from "@/components/cart/cartlist";
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

  return (
    <div className="max-container mt-20 min-h-screen flex flex-col p-3">
      <h1 className="text-3xl font-bold text-gray-800 ml-3">Your Cart</h1>
      <div className="mt-6 flex-1">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty. Add some products to it!</p>
        ) : (
          <CartList cartItems={cartItems} setCartItems={setCartItems} />
        )}
      </div>

      {/* Place Order Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg flex justify-between items-center border-t">
          <span className="text-lg font-semibold">
            Total: ₹ {cartItems.reduce((total, item) => total + item.price, 0)}
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

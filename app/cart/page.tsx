"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/Types";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import CartList from "@/components/cart/CartList";
import PopularProducts from "@/components/home/PopularProducts";
import Pricing from "@/components/cart/Pricing";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const getUpdatedCartItems = () =>
    cartItems.map((item) => ({ ...item, quantity: item.quantity ?? 0 }));

  const handlePlaceOrder = () => {
    alert("Order Placed!");
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (

    <div className="min-h-[calc(100vh-4rem-5rem)] mt-16 mb-20 flex flex-col p-3 bg-gray-100">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={router.back} className="p-3 bg-white rounded-full hover:bg-gray-100 transition">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
        <button
          onClick={() => router.push("/products?sort=recentlyAdded")}
          className="px-3 py-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-700 transition"
        >
          Explore more
        </button>
      </div>

      {/* Cart Content */}
      <div className="flex-1 overflow-auto">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500">
            Your cart is empty. Add some products!
            <div className="p-3">
              <PopularProducts />
            </div>
          </div>
        ) : (
          <>
            <CartList cartItems={getUpdatedCartItems()} setCartItems={setCartItems} />
            
            <Pricing cartItems={getUpdatedCartItems()} onTotalChange={setTotal} />
          </>
        )}
      </div>

      {/* Fixed Bottom Section */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg flex justify-between items-center border-t">
          <span className="text-lg font-semibold">Total: ₹ {total.toFixed(2)}</span>
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

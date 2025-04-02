"use client";

import React, { useState, useEffect, useRef } from "react";
import { Product, Address } from "@/Types";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import CartList from "@/components/cart/CartList";
import PopularProducts from "@/components/home/PopularProducts";
import Pricing from "@/components/cart/Pricing";
import SavedAddresses from "@/components/cart/SavedAddresses";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [highlightAddress, setHighlightAddress] = useState(false);
  const addressRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load saved cart and address from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);

    const storedAddress = JSON.parse(localStorage.getItem("selectedAddress") || "null");
    setSelectedAddress(storedAddress);

    const storedTotal = JSON.parse(sessionStorage.getItem("total") || "0");
    setTotal(storedTotal);
  }, []);

  // Store selected address in localStorage
  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
  };

  // Update localStorage on total change
  useEffect(() => {
    sessionStorage.setItem("total", JSON.stringify(total));
  }, [total]);

  const getUpdatedCartItems = () =>
    cartItems.map((item) => ({
      ...item,
      stock_quantity: item.stock_quantity ?? 1,
      platform_price: item.platform_price ?? 0, // Ensure platform_price is always a number
    }));

  const handleCheckout = () => {
    if (!selectedAddress) {
      setHighlightAddress(true);
      addressRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(() => setHighlightAddress(false), 2000);
      return;
    }

    // Store cart items (only id & quantity)
    const cartData = cartItems.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.stock_quantity ?? 1, // Default to 1 if undefined
    }));
    localStorage.setItem("cartData", JSON.stringify(cartData));

    router.push("/cart/checkout");
  };

  return (
    <div className="min-h-[calc(100vh-4rem-5rem)] mt-12 mb-20 flex flex-col p-3 bg-gray-100">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2 mt-6">
        <button
          onClick={router.back}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
        <button
          onClick={() => router.push("/products?sort=recentlyAdded")}
          className="px-3 py-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-700 transition"
        >
          Explore More
        </button>
      </div>

      {/* Cart Content */}
      <div className="flex-1 overflow-auto">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-2">
            Your cart is empty. Add some products!
            <div className="p-3">
              <PopularProducts />
            </div>
          </div>
        ) : (
          <>
            {/* Saved Addresses Section with Stronger Highlight */}
            <div
              ref={addressRef}
              className={`mt-1 transition duration-300 rounded-lg relative ${
                highlightAddress
                  ? "ring-4 ring-red-500 ring-offset-2 bg-red-100 shadow-xl scale-95"
                  : "bg-white"
              }`}
            >
              <SavedAddresses selectedAddress={selectedAddress} setSelectedAddress={handleSelectAddress} />
            </div>

            {/* Cart Items */}
            <CartList cartItems={getUpdatedCartItems()} setCartItems={setCartItems} />

            {/* Pricing Section */}
            <Pricing cartItems={getUpdatedCartItems()} onTotalChange={setTotal} />
          </>
        )}
      </div>

      {/* Fixed Bottom Section */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg flex justify-between items-center border-t">
          <span className="text-lg font-semibold">Total: ₹ {total.toFixed(2)}</span>
          <button
            onClick={handleCheckout}
            className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;

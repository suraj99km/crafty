"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/Types";
import { Trash2 } from "lucide-react"; // Delete Icon

type Props = {
  cartItems: Product[];
  setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
};

const CartList: React.FC<Props> = ({ cartItems, setCartItems }) => {
  const [updatedCart, setUpdatedCart] = useState<(Product & { quantity: number })[]>([]);

  // Load cart items with quantity on mount
  useEffect(() => {
    const cart: (Product & { quantity: number })[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setUpdatedCart(cart);
  }, [cartItems]); // Runs when `cartItems` updates

  // Handle item removal from cart
  const handleRemove = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="space-y-6">
      {updatedCart.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border border-gray-200">
          {/* Product Image */}
          <img src={item.image_url} alt={item.title} className="w-20 h-20 rounded-lg object-cover" />

          {/* Product Details */}
          <div className="flex-1 ml-4">
            <h3 className="text-md font-semibold text-gray-800">{item.title}</h3>
            <p className="text-gray-600">₹ {item.price}</p>
            <p className="text-sm text-green-600 mt-1">Estimated delivery: {Math.floor(Math.random() * 5) + 3} days</p>
          </div>

          {/* Quantity and Delete */}
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-600 mb-3">Qty: {item.quantity}</p>
            <button onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-800">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartList;

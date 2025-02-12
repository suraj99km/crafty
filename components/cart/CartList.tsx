"use client";

import React from "react";
import { Product } from "@/Types";
import { Trash2 } from "lucide-react"; // Delete Icon

type Props = {
  cartItems: Product[];
  setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
};

const CartList: React.FC<Props> = ({ cartItems, setCartItems }) => {
  const handleRemove = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="space-y-6">
      {cartItems.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border border-gray-200">
          {/* Product Image */}
          <img src={item.image_url} alt={item.title} className="w-20 h-20 rounded-lg object-cover" />

          {/* Product Details */}
          <div className="flex-1 ml-4">
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-gray-600">₹ {item.price}</p>
            <p className="text-sm text-green-600 mt-1">Estimated delivery: {Math.floor(Math.random() * 5) + 3} days</p>
          </div>

          {/* Delete Button */}
          <button onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-800">
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default CartList;

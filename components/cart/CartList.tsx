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
    <div className="space-y-4">
      {updatedCart.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-md border border-gray-200">
          {/* Product Image with Discount Badge */}
          <div className="relative">
            <img src={item.images[0]} alt={item.title} className="w-20 h-20 rounded-lg object-cover" />
            {item.final_sale_price && item.platform_price && item.final_sale_price < item.platform_price && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {Math.round(((item.platform_price - item.final_sale_price) / item.platform_price) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 ml-4">
            <h3 className="text-md font-semibold text-gray-800">{item.title}</h3>
            <div className="flex items-center gap-2">
              {item.final_sale_price && item.platform_price && item.final_sale_price < item.platform_price ? (
                <>
                  <p className="text-gray-600 line-through">₹ {item.platform_price}</p>
                  <p className="text-green-600 font-semibold">₹ {item.final_sale_price}</p>
                </>
              ) : (
                <p className="text-gray-600">₹ {item.platform_price || 0}</p>
              )}
            </div>
            <p className="text-sm text-green-600 font-semibold mt-1">
              Expected delivery <br /> by
              <span className="font-semibold ml-1">
                {new Date(Date.now() + (Math.floor(Math.random() * 5) + 2) * 24 * 60 * 60 * 1000)
                  .toLocaleDateString('en-GB', { day: 'numeric', month: 'short'})}
              </span>
            </p>
          </div>
          {/* Quantity and Delete */}
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-600 mb-3">Qty: {item.quantity_selected}</p>
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

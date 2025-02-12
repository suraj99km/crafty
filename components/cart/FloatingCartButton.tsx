"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

const FloatingCartButton = () => {
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Get cart count from localStorage or state management
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

  return (
    cartCount > 0 && (
      <button
        onClick={() => router.push("/cart")}
        className="fixed bottom-6 right-6 bg-green-800 text-white font-semibold py-3 px-5 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-700 transition-all duration-300 z-50"
      >
        <ShoppingCart size={20} />
        <span>{cartCount} Product{cartCount > 1 ? "s" : ""}</span>
      </button>
    )
  );
};

export default FloatingCartButton;

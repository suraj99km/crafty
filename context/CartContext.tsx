import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/Types";

type CartContextType = {
  cartItems: Product[];
  cartCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>(() => {
    // Load cart items from localStorage on initial load
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const cartCount = cartItems.length;

  const addToCart = (product: Product) => {
    const updatedCart = [...cartItems, product];
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

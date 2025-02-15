// components/cart/Pricing.tsx

"use client"

import { useState, useEffect } from "react";

interface PricingProps {
  cartItems: { price: number; quantity: number | undefined }[];
  onTotalChange: (total: number) => void; // Callback to pass the total back to CartPage
}

const Pricing = ({ cartItems, onTotalChange }: PricingProps) => {
  const [convenienceFee, setConvenienceFee] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Calculate the subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const quantity = item.quantity ?? 0; // Default to 0 if quantity is undefined
    return total + item.price * quantity;
  }, 0);

  // Update convenience fee & delivery fee dynamically
  useEffect(() => {
    const calculatedConvenienceFee = Math.min(Math.max(subtotal * 0.02, 10), 50);
    setConvenienceFee(calculatedConvenienceFee);

    const calculatedDeliveryFee = subtotal > 1000 ? 49 : 29;
    setDeliveryFee(calculatedDeliveryFee);

    const total = subtotal + convenienceFee + deliveryFee;
    onTotalChange(total); // Pass the total back to the parent component
  }, [subtotal, convenienceFee, deliveryFee, onTotalChange]);

  const total = subtotal + convenienceFee + deliveryFee;

  return (
    <div className="p-4 mt-6 bg-white shadow-md border-t">
      <h2 className="text-lg font-semibold mb-2">Price Breakup</h2>
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>₹ {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Convenience Fee:</span>
        <span>₹ {convenienceFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Delivery Charges:</span>
        <span>₹ {deliveryFee.toFixed(2)}</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between font-semibold text-lg">
        <span>Total:</span>
        <span>₹ {total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Pricing;

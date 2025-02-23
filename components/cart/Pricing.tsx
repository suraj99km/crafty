"use client";

import { useState, useEffect } from "react";

interface CartItem {
  title: string;
  price: number;
  quantity: number;
}

interface PricingProps {
  cartItems: CartItem[];
  onTotalChange: (total: number) => void;
}

const Pricing = ({ cartItems, onTotalChange }: PricingProps) => {
  const [subtotal, setSubtotal] = useState(0);
  const [convenienceFee, setConvenienceFee] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    const calculatedConvenienceFee = Math.min(Math.max(calculatedSubtotal * 0.03, 10), 100);
    const calculatedDeliveryFee = calculatedSubtotal > 1000 ? 50 : 30;
    const calculatedTotal = calculatedSubtotal + calculatedConvenienceFee + calculatedDeliveryFee;

    setSubtotal(calculatedSubtotal);
    setConvenienceFee(calculatedConvenienceFee);
    setDeliveryFee(calculatedDeliveryFee);
    setTotal(calculatedTotal);

    onTotalChange(calculatedTotal);
    sessionStorage.setItem("total", JSON.stringify(calculatedTotal));
  }, [cartItems, onTotalChange]);

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

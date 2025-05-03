"use client";

import { useState, useEffect } from "react";
import { isGlobalSaleActive, getGlobalSaleInfo, getGlobalConfig } from "@/lib/supabase-db/global-utils";
import { CheckCircle2 } from "lucide-react";

interface CartItem {
  title: string;
  platform_price: number;
  quantity_selected: number;
  final_sale_price?: number | null;
  is_discount_enabled?: boolean;
}

interface PricingProps {
  cartItems: CartItem[];
  onTotalChange: (total: number) => void;
}

const Pricing = ({ cartItems, onTotalChange }: PricingProps) => {
  const [subtotal, setSubtotal] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [globalSaleActive, setGlobalSaleActive] = useState(false);
  const [saleInfo, setSaleInfo] = useState<any>(null);
  const [freeDeliveryMinimum, setFreeDeliveryMinimum] = useState(1000);
  const [totalDiscount, setTotalDiscount] = useState(0);

  useEffect(() => {
    const checkGlobalSale = async () => {
      try {
        const saleActive = await isGlobalSaleActive();
        setGlobalSaleActive(saleActive);
        
        if (saleActive) {
          const info = await getGlobalSaleInfo();
          setSaleInfo(info);
        }

        const minForFreeDelivery = await getGlobalConfig("free_delivery_minimum", 1000);
        setFreeDeliveryMinimum(minForFreeDelivery);
      } catch (err) {
        console.error("Error checking global sale status:", err);
      }
    };

    checkGlobalSale();
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      // Calculate original total (without any discounts)
      const calculatedOriginalTotal = cartItems.reduce((sum, item) => {
        return sum + item.platform_price * (item.quantity_selected || 1);
      }, 0);

      // Calculate subtotal with sale prices
      const calculatedSubtotal = cartItems.reduce((sum, item) => {
        let itemPrice = item.platform_price;
        
        if (globalSaleActive) {
          if (item.is_discount_enabled && item.final_sale_price) {
            // Use item's specific sale price if available
            itemPrice = item.final_sale_price;
          } else if (saleInfo?.discountPercentage > 0) {
            // Apply global sale discount
            const discount = (itemPrice * saleInfo.discountPercentage) / 100;
            itemPrice = Math.round((itemPrice - discount) * 100) / 100;
          }
        }
        
        return sum + itemPrice * (item.quantity_selected || 1);
      }, 0);

      // Calculate total discount
      const calculatedDiscount = globalSaleActive ? calculatedOriginalTotal - calculatedSubtotal : 0;
      
      // Check if order qualifies for free delivery
      const calculatedDeliveryFee = calculatedSubtotal >= freeDeliveryMinimum ? 0 : 
        calculatedSubtotal > 1000 ? 50 : 30;

      const calculatedTotal = calculatedSubtotal + calculatedDeliveryFee;

      setOriginalTotal(calculatedOriginalTotal);
      setSubtotal(calculatedSubtotal);
      setTotalDiscount(calculatedDiscount);
      setDeliveryFee(calculatedDeliveryFee);
      setTotal(calculatedTotal);

      onTotalChange(calculatedTotal);
    };

    calculateTotal();
  }, [cartItems, globalSaleActive, saleInfo, freeDeliveryMinimum, onTotalChange]);

  return (
    <div className="p-4 mt-6 bg-white shadow-md border-t">
      <h2 className="text-lg font-semibold mb-2">Price Breakup</h2>
      
      <div className="flex justify-between">
        <span>Original Price:</span>
        <span>₹ {originalTotal.toFixed(2)}</span>
      </div>
      
      {totalDiscount > 0 && (
        <div className="flex justify-between text-red-600 mt-2">
          <span>Discount:</span>
          <span>- ₹ {totalDiscount.toFixed(2)}</span>
        </div>
      )}
      
      <div className="flex justify-between mt-2">
        <span>Delivery Charges:</span>
        <div className="flex items-center gap-2">
          {deliveryFee === 0 ? (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              FREE
            </span>
          ) : (
            <span>₹ {deliveryFee.toFixed(2)}</span>
          )}
        </div>
      </div>

      <hr className="my-2" />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total:</span>
        <span>₹ {total.toFixed(2)}</span>
      </div>
      
      {subtotal < freeDeliveryMinimum && (
        <div className="mt-2 text-sm text-gray-600">
          Add items worth ₹{(freeDeliveryMinimum - subtotal).toFixed(2)} more for free delivery
        </div>
      )}
    </div>
  );
};

export default Pricing;

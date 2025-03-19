"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import FeeStructureDialog, { feeStructure } from "./Pricing/FeeStructureDialog";
import PaymentMethodSelection from "./Pricing/PaymentMethodSelection";

interface PricingProps {
  product?: {
    artistPrice?: number,
    platformPrice?:number;
  };
  updateProduct?: (field: string, value: any) => void;
}

// Fee calculator function
const calculatePlatformFee = (price: number) => {
  const tier = feeStructure.find(tier => price >= tier.min && price <= tier.max);
  return tier ? (price * tier.percentage / 100) : 0;
};

const ProductPricing: React.FC<PricingProps> = ({ product, updateProduct }) => {
  const initialPrice = product?.artistPrice || 499;
  const [artistPrice, setArtistPrice] = useState(initialPrice);
  const [inputPrice, setInputPrice] = useState(initialPrice.toString());
  const [platformFee, setPlatformFee] = useState(calculatePlatformFee(initialPrice));
  const [finalPrice, setFinalPrice] = useState(initialPrice + calculatePlatformFee(initialPrice));
  const [currentTier, setCurrentTier] = useState(
    feeStructure.find(tier => initialPrice >= tier.min && initialPrice <= tier.max)?.percentage || 0
  );
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("bank_transfer");

  // Update all pricing related states
  const updatePricing = (newPrice: number) => {
    const validPrice = Math.max(50, Math.min(5000, newPrice));
    setArtistPrice(validPrice);
    
    const newFee = calculatePlatformFee(validPrice);
    setPlatformFee(newFee);
    setFinalPrice(validPrice + newFee);
    
    const tier = feeStructure.find(tier => validPrice >= tier.min && validPrice <= tier.max);
    setCurrentTier(tier?.percentage || 0);
    
    if (updateProduct) {
      updateProduct("artistPrice", validPrice);
      updateProduct("platformPrice", finalPrice);
    }

    return validPrice;
  };

  // Handle price change from slider
  const handleSliderChange = (values: number[]) => {
    const newPrice = values[0];
    const validPrice = updatePricing(newPrice);
    setInputPrice(validPrice.toString());
  };

// Handle price change from input field
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setInputPrice(value);

  const numValue = value === "" ? 50 : parseFloat(value);
  if (!isNaN(numValue)) {
    updatePricing(numValue);
  }
};

// Ensure the value is within the range when input loses focus
const handleInputBlur = () => {
  const numValue = parseFloat(inputPrice);
  if (!isNaN(numValue)) {
    if (numValue < 50) {
      setInputPrice("50");
      updatePricing(50);
    } else if (numValue > 5000) {
      setInputPrice("5000");
      updatePricing(5000);
    }
  }
};

  // Handle focus on input
  const handleInputFocus = () => {
    setInputFocused(true);
  };

  // Handle payment method change
  const handleMethodChange = (methodId: number) => {
      const savedProduct = JSON.parse(localStorage.getItem("productData") || "{}");
      const updatedProduct = {
          ...savedProduct,
          artistPrice: savedProduct.artistPrice || "",
          platformPrice: savedProduct.platformPrice || "",
          paymentMethodId: methodId
      };
      localStorage.setItem("productData", JSON.stringify(updatedProduct));
  };

  return (
    <motion.div
      className="flex justify-center items-center w-full p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl border border-gray-200 bg-white">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-center space-x-3 border-b pb-3">
            <h2 className="text-xl font-semibold text-white bg-red-500 rounded-lg px-4 py-1">Product Pricing</h2>
          </div>
          
          <div className="space-y-6">
            {/* Artist Price Controls */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold">
                Product Price by Artist
              </Label>
              
              {/* Input field and slider combination */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <div className="relative flex items-center w-full">
                    <span className="absolute left-3 text-gray-500">₹</span>
                    <Input
                      type="text"
                      value={inputPrice}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="pl-7 w-full font-medium text-gray-900"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Slider
                    value={[artistPrice]}
                    onValueChange={handleSliderChange}
                    min={50}
                    max={2000}
                    step={1}
                    className="py-2 w-full h-2 bg-red-400 rounded-lg relative"
                  />
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">₹50</span>
                      <span className="text-xs text-gray-400">Min</span>
                    </div>
                    <div className="ml-4 flex flex-col items-center">
                      <span className="text-xs text-gray-500">₹1000</span>
                      <span className="text-xs text-gray-400">Common</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500">₹2000</span>
                      <span className="text-xs text-gray-400">Premium</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick price presets */}
              <div className="grid grid-cols-4 gap-2">
                {[99, 199, 499, 999].map((price) => (
                  <button
                    key={price}
                    onClick={() => {
                      updatePricing(price);
                      setInputPrice(price.toString());
                    }}
                    className={`py-1 px-2 rounded-md text-sm ${
                      artistPrice === price 
                        ? "bg-red-500 text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ₹{price}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Artist Price:</span>
                <span className="font-medium">₹{artistPrice.toFixed(2)}</span>
              </div>
              
              {/* <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-600">Platform Fee:</span>
             
                </div>
                <span className="font-medium">₹{platformFee.toFixed(2)} ({currentTier}%)</span>
              </div> */}
              
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-semibold">Final Price to Customers:</span>
                <FeeStructureDialog currentPrice={artistPrice} />
                <span className="text-lg font-bold text-red-600 ml-2">₹{finalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Payment Method Selection */}
            <PaymentMethodSelection onSelect={(methodId: number) => handleMethodChange(methodId)} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductPricing;
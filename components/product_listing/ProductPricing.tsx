"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Percent } from "lucide-react";
import FeeStructureDialog, { feeStructure } from "./Pricing/FeeStructureDialog";
import PaymentMethodSelection from "./Pricing/PaymentMethodSelection";

interface PricingProps {
  product?: {
    artistPrice?: number,
    platformPrice?: number;
    isDiscountEnabled?: boolean;
    artistSalePrice?: number;
    finalSalePrice?: number;
    paymentMethodId: string,
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(product?.paymentMethodId || "");
  
  // Initialize artistSalePrice and finalSalePrice
  const initialSalePrice = product?.artistSalePrice || Math.round(initialPrice * 0.9); // Default 10% off
  const [artistSalePrice, setArtistSalePrice] = useState(initialSalePrice);
  const [inputSalePrice, setInputSalePrice] = useState(initialSalePrice.toString());
  const [finalSalePrice, setFinalSalePrice] = useState(initialSalePrice + calculatePlatformFee(initialSalePrice));
  
  // New state for discount toggle
  const [isDiscountEnabled, setIsDiscountEnabled] = useState(product?.isDiscountEnabled || false);
  const [discountPercent, setDiscountPercent] = useState(
    Math.round((1 - initialSalePrice/initialPrice) * 100) || 10
  );

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
      updateProduct("platformPrice", validPrice + newFee);
    }

    // Update sale price based on current discount percentage
    const newSalePrice = Math.max(50, Math.round(validPrice * (1 - discountPercent/100)));
    updateSalePrice(newSalePrice);

    return validPrice;
  };

  const updateSalePrice = (newPrice: number) => {
    const validPrice = Math.max(50, Math.min(artistPrice, newPrice));
    setArtistSalePrice(validPrice);
    setInputSalePrice(validPrice.toString());
    
    // Calculate the discount percentage
    const newDiscountPercent = Math.round((1 - validPrice/artistPrice) * 100);
    setDiscountPercent(newDiscountPercent);
    
    const salePlatformFee = calculatePlatformFee(validPrice);
    const newFinalSalePrice = validPrice + salePlatformFee;
    setFinalSalePrice(newFinalSalePrice);

    if (updateProduct) {
      updateProduct("artistSalePrice", validPrice);
      updateProduct("finalSalePrice", newFinalSalePrice);
    }

    return validPrice;
  };

  // Handle price change from slider
  const handleSliderChange = (values: number[]) => {
    const newPrice = values[0];
    const validPrice = updatePricing(newPrice);
    setInputPrice(validPrice.toString());
  };

  // Handle sale price change from input field
  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputSalePrice(value);

    const numValue = value === "" ? 50 : parseFloat(value);
    if (!isNaN(numValue)) {
      updateSalePrice(numValue);
    }
  };

  // Ensure the value is within the range when sale price input loses focus
  const handleSalePriceBlur = () => {
    const numValue = parseFloat(inputSalePrice);
    if (!isNaN(numValue)) {
      if (numValue < 50) {
        setInputSalePrice("50");
        updateSalePrice(50);
      } else if (numValue > artistPrice) {
        setInputSalePrice(artistPrice.toString());
        updateSalePrice(artistPrice);
      }
    } else {
      setInputSalePrice("50");
      updateSalePrice(50);
    }
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

  // Handle sale price change from slider
  const handleSalePriceSliderChange = (values: number[]) => {
    const newPrice = values[0];
    updateSalePrice(newPrice);
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
    } else {
      setInputPrice("50");
      updatePricing(50);
    }
  };

  // Handle focus on input
  const handleInputFocus = () => {
    setInputFocused(true);
  };

  // Handle discount percentage presets
  const handleDiscountPreset = (percentage: number) => {
    const newSalePrice = Math.max(50, Math.round(artistPrice * (1 - percentage/100)));
    updateSalePrice(newSalePrice);
  };

  // Handle payment method change
  const handleMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId); // Update state
    if (updateProduct) {
      updateProduct("paymentMethodId", methodId); // Ensure it's updated in the product state
    }

    const savedProduct = JSON.parse(localStorage.getItem("productData") || "{}");
    const updatedProduct = {
      ...savedProduct,
      artistPrice: savedProduct.artistPrice || "",
      platformPrice: savedProduct.platformPrice || "",
      isDiscountEnabled: isDiscountEnabled,
      artistSalePrice: savedProduct.artistSalePrice || "",
      finalSalePrice: savedProduct.finalSalePrice || "",
      paymentMethodId: methodId, // Store selected method ID
    };
    localStorage.setItem("productData", JSON.stringify(updatedProduct));
  };

  // Handle discount toggle change
  const handleDiscountToggle = () => {
    const newState = !isDiscountEnabled;
    setIsDiscountEnabled(newState);
    if (updateProduct) {
      updateProduct("isDiscountEnabled", newState);
    }
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
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-semibold w-2/3">
                  Price you will get:
                </Label>
                <div className="relative flex items-center w-1/3">
                  <span className="absolute left-3 font-semibold text-gray-500">₹</span>
                  <Input
                    type="text"
                    value={inputPrice}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="pl-7 w-full font-semibold text-gray-900"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
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
                {[99, 199, 499, 999, 1499, 2499, 3999, 4999].map((price) => (
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
            
            {/* Final Price to the Customers*/}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">Final Price to Customers:</span>
                <FeeStructureDialog currentPrice={artistPrice} />
                <span className="text-lg font-bold text-red-600 ml-2">₹{finalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Discount Toggle - Attractive Redesign */}
            <div className="mt-6 border border-red-100 rounded-lg p-4 bg-red-50">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="rounded-3xl p-1 bg-red-500 mr-2"><Percent size={16} className="text-white font-semibold"/></span> Participate in Flash Sales
            </h3>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-xs text-gray-600">Boost your visibility with <br/>limited-time discounts</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDiscountToggle}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      isDiscountEnabled ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isDiscountEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              {isDiscountEnabled && (
                <div className="space-y-4 mt-4 border-t border-red-200 pt-4">
                    <Label className="text-sm font-medium text-gray-700">
                      Current Discount: <span className="text-red-600 font-semibold">{discountPercent}% OFF</span>
                    </Label>
                    <div className="flex space-x-1">
                      {[10, 20, 30, 40, 50].map((percent) => (
                        <button
                          key={percent}
                          onClick={() => handleDiscountPreset(percent)}
                          className={`py-1 px-2 text-xs rounded ${
                            discountPercent === percent
                              ? 'bg-red-500 text-white'
                              : 'bg-white border border-red-300 text-red-500 hover:bg-red-50'
                          }`}
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium w-2/3">
                      Your earnings during sales:
                    </Label>
                    <div className="relative flex items-center w-1/3">
                      <span className="absolute left-3 font-semibold text-gray-500">₹</span>
                      <Input
                        type="text"
                        value={inputSalePrice}
                        onChange={handleSalePriceChange}
                        onBlur={handleSalePriceBlur}
                        className="pl-7 w-full font-semibold text-gray-900 border-red-200 focus:border-red-500 focus:ring-red-500"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Slider
                      value={[artistSalePrice]}
                      onValueChange={handleSalePriceSliderChange}
                      min={50}
                      max={artistPrice}
                      step={1}
                      className="py-2 w-full h-2 bg-red-400 rounded-lg relative"
                    />
                    <div className="flex justify-between items-center pt-1">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">₹50</span>
                        <span className="text-xs text-gray-400">Min</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">₹{artistPrice}</span>
                        <span className="text-xs text-gray-400">Max</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-red-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-gray-700">Customer sale price:</span>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 line-through mr-2">₹{finalPrice.toFixed(2)}</span>
                        <span className="text-lg font-bold text-red-600">₹{finalSalePrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Products with active discounts get featured in our promotional campaigns and flash sales.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <PaymentMethodSelection onSelect={handleMethodChange} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductPricing;
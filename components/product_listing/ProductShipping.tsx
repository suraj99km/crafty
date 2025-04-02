"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Package } from "lucide-react";
import SavedShippingAddresses from "./Shipping/SavedShippingAddresses";
import { Address } from "@/Types";
import { Slider } from "@/components/ui/slider"; // Importing the Slider component

// Types
type ErrorRecord = Partial<Record<"stockQuantity" | "address", string>>;

interface ProductShippingProps {
  product: {
    stock_quantity?: number;
    is_made_to_order?: boolean;
    shipping_address_id?: string;
  };
  updateProduct: (field: string, value: any) => void;
}

// Toggle Component
const Toggle: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  required?: boolean;
}> = ({ enabled, onChange, label, required = false }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <Label className="text-sm font-bold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
    </div>
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
        enabled ? 'bg-red-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
          enabled ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

// Main Component
const ProductShipping: React.FC<ProductShippingProps> = ({ product, updateProduct }) => {
  const [stockQuantity, setStockQuantity] = useState(product?.stock_quantity || 10);
  const [isMadeToOrder, setIsMadeToOrder] = useState(product?.is_made_to_order || false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [errors, setErrors] = useState<ErrorRecord>({});
  const [inputQuantity, setInputQuantity] = useState(stockQuantity.toString());

  // Quick quantity presets
  const quantityPresets = [1, 5, 10,15,25,50,75, 100];

  // Load saved address from localStorage on component mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress && !selectedAddress) {
      const parsedAddress = JSON.parse(savedAddress);
      setSelectedAddress(parsedAddress);
      updateProduct("shipping_address_id", parsedAddress.id);
    }
  }, []);

  // Validate on changes
  useEffect(() => {
    validateInputs();
  }, [stockQuantity, selectedAddress]);

  const validateInputs = () => {
    const newErrors: ErrorRecord = {};
    
    // Validate stock quantity
    if (stockQuantity <= 0) {
      newErrors.stockQuantity = "Stock quantity must be greater than zero";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMadeToOrderChange = (enabled: boolean) => {
    setIsMadeToOrder(enabled);
    updateProduct("is_made_to_order", enabled);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputQuantity(value);

    const numValue = value === "" ? 1 : parseInt(value);
    if (!isNaN(numValue)) {
      updateQuantity(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputQuantity);
    if (!isNaN(numValue)) {
      if (numValue < 1) {
        setInputQuantity("1");
        updateQuantity(1);
      } else if (numValue > 100) {
        setInputQuantity("100");
        updateQuantity(100);
      }
    } else {
      setInputQuantity("1");
      updateQuantity(1);
    }
  };

  const updateQuantity = (value: number) => {
    const validQuantity = Math.max(1, Math.min(100, value));
    setStockQuantity(validQuantity);
    updateProduct("stock_quantity", validQuantity);
    return validQuantity;
  };

  const handleSliderChange = (value: number[]) => {
    const validQuantity = updateQuantity(value[0]);
    setInputQuantity(validQuantity.toString());
  };

  const handleQuantityPresetClick = (quantity: number) => {
    updateQuantity(quantity);
    setInputQuantity(quantity.toString());
  };

  const fillPercentage = ((stockQuantity - 1) / (100 - 1)) * 100;

  // Handle address selection
  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    localStorage.setItem("selected_address", JSON.stringify(address));
    updateProduct("shipping_address_id", address.id);
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
            <h2 className="text-xl font-semibold text-white bg-red-500 rounded-lg px-4 py-1">Shipping & Availability</h2>
          </div>
          
          {Object.keys(errors).length > 0 && (
            <Alert className="bg-red-50 border border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription>
                Please correct the highlighted fields before proceeding.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Shipping Address <span className="text-red-500">*</span>
              </Label>
              <SavedShippingAddresses 
                selectedAddress={selectedAddress} 
                setSelectedAddress={handleSelectAddress} 
              />
            </div>
            
            {/* Stock Quantity - In the same style as Price controls */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-semibold w-2/3">
                  Stock Quantity <span className="text-red-500">*</span>
                </Label>
                <div className="relative flex items-center w-1/3">
                  <Input
                    type="text"
                    value={inputQuantity}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={`w-full font-semibold text-gray-900 ${
                      errors.stockQuantity ? "border-red-500 ring-1 ring-red-500" : ""
                    }`}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="space-y-1">
                  <Slider
                    value={[stockQuantity]}
                    onValueChange={handleSliderChange}
                    min={1}
                    max={100}
                    step={1}
                    className="py-2 w-full h-2 bg-red-400 rounded-lg relative"
                  />
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">1</span>
                      <span className="text-xs text-gray-400">Min</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">50</span>
                      <span className="text-xs text-gray-400">Common</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500">100</span>
                      <span className="text-xs text-gray-400">Max</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick quantity presets */}
              <div className="grid grid-cols-4 gap-2">
                {quantityPresets.map((quantity) => (
                  <button
                    key={quantity}
                    onClick={() => handleQuantityPresetClick(quantity)}
                    className={`py-1 px-2 rounded-md text-sm ${
                      stockQuantity === quantity 
                        ? "bg-red-500 text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {quantity}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Made-to-Order Toggle */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Toggle
                enabled={isMadeToOrder}
                onChange={handleMadeToOrderChange}
                label="Is This a Made-to-Order Product?"
                required={true}
              />
              
              {/* Production Time Note (only shown if Made-to-Order is enabled) */}
              {isMadeToOrder && (
                <div className="mt-3 border-l-2 border-red-300 pl-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Note:</span> Product's Preparation Time will determine shipping estimate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductShipping;
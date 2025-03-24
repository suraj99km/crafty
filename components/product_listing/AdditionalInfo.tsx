"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

// Toggle Component
const Toggle: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  required?: boolean;
}> = ({ enabled, onChange, label, required = false }) => (
  <div className="flex items-center justify-between">
    <Label className="text-sm font-bold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${
        enabled ? "bg-red-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

interface AdditionalInfoProps {
  product: {
    customizationAvailable: boolean;
    customizationInstructions: string;
    requiresAssembly: boolean;
    assemblyInstructions: string;
    careInstructions: string;
    returnPolicy: string;
  };
  updateProduct: (field: string, value: any) => void;
}

export default function AdditionalInfo({ product, updateProduct }: AdditionalInfoProps) {
  const [isCustomizationAvailable, setIsCustomizationAvailable] = useState(product.customizationAvailable || false);
  const [isAssemblyRequired, setIsAssemblyRequired] = useState(product.requiresAssembly || false);

  const handleCustomizationChange = (enabled: boolean) => {
    setIsCustomizationAvailable(enabled);
    updateProduct("customizationAvailable", enabled);
  };

  const handleAssemblyChange = (enabled: boolean) => {
    setIsAssemblyRequired(enabled);
    updateProduct("requiresAssembly", enabled);
  };

  // Load saved product data from localStorage on initial render
  useEffect(() => {
    try {
      const savedProductJSON = localStorage.getItem("productData");
      if (savedProductJSON) {
        const savedProduct = JSON.parse(savedProductJSON);

        setIsCustomizationAvailable(savedProduct.customizationAvailable || false);
        setIsAssemblyRequired(savedProduct.requiresAssembly || false);

        updateProduct("customizationAvailable", savedProduct.customizationAvailable || false);
        updateProduct("customizationInstructions", savedProduct.customizationInstructions || "");
        updateProduct("requiresAssembly", savedProduct.requiresAssembly || false);
        updateProduct("assemblyInstructions", savedProduct.assemblyInstructions || "");
        updateProduct("careInstructions", savedProduct.careInstructions || "");
        updateProduct("returnPolicy", savedProduct.returnPolicy || "");
      }
    } catch (error) {
      console.error("Error loading product data from localStorage:", error);
    }
  }, []);

  // Save product data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("productData", JSON.stringify(product));
    } catch (error) {
      console.error("Error saving product data to localStorage:", error);
    }
  }, [product]);

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
            <h2 className="text-xl font-semibold text-white bg-red-500 rounded-lg px-4 py-1">
              Additional Information
            </h2>
          </div>

          <div className="space-y-4">
            {/* Customization Available Toggle */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Toggle enabled={isCustomizationAvailable} onChange={handleCustomizationChange} label="Customization Available?" />

              {isCustomizationAvailable && (
                <div className="mt-3 border-l-2 border-red-300 pl-3">
                  <Label htmlFor="customizationInstructions" className="text-sm font-medium text-gray-700 mb-2 block">
                    Customization Instructions
                  </Label>
                  <Textarea
                    id="customizationInstructions"
                    placeholder="Describe what customizations are available..."
                    value={product.customizationInstructions || ""}
                    onChange={(e) => updateProduct("customizationInstructions", e.target.value)}
                    className="border text-sm border-gray-300 p-3 rounded-md w-full shadow-sm focus:ring-red-500 focus:border-red-500"
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Assembly Required Toggle */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Toggle enabled={isAssemblyRequired} onChange={handleAssemblyChange} label="Assembly Required?" />

              {isAssemblyRequired && (
                <div className="mt-3 border-l-2 border-red-300 pl-3">
                  <Label htmlFor="assemblyInstructions" className="text-sm font-medium text-gray-700 mb-2 block">
                    Assembly Instructions
                  </Label>
                  <Textarea
                    id="assemblyInstructions"
                    placeholder="Provide detailed assembly instructions..."
                    value={product.assemblyInstructions || ""}
                    onChange={(e) => updateProduct("assemblyInstructions", e.target.value)}
                    className="border text-sm border-gray-300 p-3 rounded-md w-full shadow-sm focus:ring-red-500 focus:border-red-500"
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Special Care Instructions */}
            <div className="space-y-2">
              <Label htmlFor="careInstructions" className="text-sm font-semibold text-gray-700">
                Special Care Instructions
              </Label>
              <Textarea
                id="careInstructions"
                placeholder="E.g., Hand-wash only, Keep away from moisture, etc."
                value={product.careInstructions || ""}
                onChange={(e) => updateProduct("careInstructions", e.target.value)}
                className="border text-sm border-gray-300 p-3 rounded-md w-full shadow-sm focus:ring-red-500 focus:border-red-500"
                rows={3}
              />
            </div>

            {/* Return Policy */}
            <div className="space-y-2">
              <Label htmlFor="returnPolicy" className="text-sm font-semibold text-gray-700">
                Return Policy *
              </Label>
              <Select value={product.returnPolicy || ""} onValueChange={(value) => updateProduct("returnPolicy", value)}>
                <SelectTrigger id="returnPolicy" className="w-full focus:ring-red-500 focus:border-red-500">
                  <SelectValue placeholder="Select return policy" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="No Returns">No Returns</SelectItem>
                  <SelectItem value="7 Days">7 Days</SelectItem>
                  <SelectItem value="15 Days">15 Days</SelectItem>
                  <SelectItem value="30 Days">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
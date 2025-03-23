"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface AdditionalInfoProps {
  product: any;
  updateProduct: (updates: Partial<any>) => void;
}

export default function AdditionalInfo({ product, updateProduct }: AdditionalInfoProps) {
  return (
    <motion.div
      className="flex justify-center items-center w-full p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl border border-gray-200 bg-white">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-3 border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-800">Additional Information</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="customizationAvailable"
                checked={product.customizationAvailable || false}
                onChange={(e) => updateProduct({ customizationAvailable: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="customizationAvailable" className="text-sm font-medium text-gray-700">
                Customization Available?
              </label>
            </div>
            {product.customizationAvailable && (
              <div className="flex flex-col">
                <label htmlFor="customizationInstructions" className="text-sm font-medium text-gray-700">
                  Customization Instructions
                </label>
                <input
                  type="text"
                  id="customizationInstructions"
                  value={product.customizationInstructions || ''}
                  onChange={(e) => updateProduct({ customizationInstructions: e.target.value })}
                  className="border p-2 rounded-md"
                />
              </div>
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requiresAssembly"
                checked={product.requiresAssembly || false}
                onChange={(e) => updateProduct({ requiresAssembly: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="requiresAssembly" className="text-sm font-medium text-gray-700">
                Does This Product Require Assembly?
              </label>
            </div>
            {product.requiresAssembly && (
              <div className="flex flex-col">
                <label htmlFor="assemblyInstructions" className="text-sm font-medium text-gray-700">
                  Assembly Instructions
                </label>
                <input
                  type="text"
                  id="assemblyInstructions"
                  value={product.assemblyInstructions || ''}
                  onChange={(e) => updateProduct({ assemblyInstructions: e.target.value })}
                  className="border p-2 rounded-md"
                />
              </div>
            )}
            <div className="flex flex-col">
              <label htmlFor="specialCareInstructions" className="text-sm font-medium text-gray-700">
                Special Care Instructions
              </label>
              <input
                type="text"
                id="specialCareInstructions"
                value={product.specialCareInstructions || ''}
                onChange={(e) => updateProduct({ specialCareInstructions: e.target.value })}
                className="border p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="returnPolicy" className="text-sm font-medium text-gray-700">
                Return Policy
              </label>
              <select
                id="returnPolicy"
                value={product.returnPolicy || 'No Returns'}
                onChange={(e) => updateProduct({ returnPolicy: e.target.value })}
                className="border p-2 rounded-md"
              >
                <option value="No Returns">No Returns</option>
                <option value="7 Days">7 Days</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
              </select>
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}
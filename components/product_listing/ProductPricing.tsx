"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function ProductPricing() {
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
            <span className="rounded-full h-8 w-8 flex items-center justify-center bg-red-500 text-white text-lg font-bold">5</span>
            <h2 className="text-xl font-semibold text-gray-800">Product Pricing</h2>
          </div>

          {/* Pricing and Fee Breakdown - To be implemented */}

        </CardContent>
      </Card>
    </motion.div>
  );
}
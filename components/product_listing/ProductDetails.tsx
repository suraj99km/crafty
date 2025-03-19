"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import ProductImagesUploader from "@/components/product_listing/ProductImagesUploader";
import ProductVideosUploader from "@/components/product_listing/ProductVideosUploader";

const categories = [
  "Painting",
  "Sculpture",
  "Handmade Jewelry",
  "Woodwork",
  "Metal Art",
  "Textile Art",
  "Pottery",
  "Other",
];

export default function ProductDetails({
  product,
  updateProduct,
}: {
  product: {
    title: string;
    category: string;
    description: string;
    images: string[];
    // qualityVideo: string | null;
    // demoVideo: string | null;
  };
  updateProduct: (key: string, value: string | string[] | null) => void;
}) {
  useEffect(() => {
    if (
      product.title &&
      product.category &&
      product.description &&
      product.images.length >= 3
    ) {
      // toast.success("All required fields are filled!");
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
            {/* <span className="rounded-full h-8 w-8 flex items-center justify-center bg-red-500 text-white text-lg font-bold">
              1
            </span> */}
            <h2 className="text-xl font-bold text-white bg-red-500 rounded-lg px-6 py-1">Product Details</h2>
          </div>

          {/* Product Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Product Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter product title"
              value={product.title || ""}
              onChange={(e) => updateProduct("title", e.target.value)}
              className="border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>

          {/* Product Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Product Category <span className="text-red-500">*</span>
            </label>
            <Select
              defaultValue={product.category || ""}
              onValueChange={(value) => updateProduct("category", value)}
            >
              <SelectTrigger className="w-full border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Description */}
          <div className="space-y-2 relative">
            <label className="text-sm font-semibold text-gray-700">
              Product Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={4}
              placeholder="Describe your product in detail"
              value={product.description || ""}
              onChange={(e) => updateProduct("description", e.target.value)}
              className="border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all rounded-xl h-40 pb-10"
            />
            {/* Word Counter */}
            <div
              className={`text-xs text-right ${
                product.description && product.description.trim().split(/\s+/).length < 50
                  ? "text-red-500"
                  : product.description?.trim().split(/\s+/).length >= 180
                  ? "text-orange-500"
                  : "text-gray-600"
              }`}
            >
              {product.description ? product.description.trim().split(/\s+/).length : 0} / 200 words
              {product.description && product.description.trim().split(/\s+/).length < 50
                ? " (minimum 50 words required)"
                : ""}
            </div>
          </div>

          {/* Product Images Uploader */}
          <ProductImagesUploader product={product} updateProduct={updateProduct} />

          {/* Product Videos Uploader */}
          {/* <ProductVideosUploader product={product} updateProduct={updateProduct} /> */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
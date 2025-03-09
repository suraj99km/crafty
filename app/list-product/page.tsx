"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductDetails from "@/components/product_listing/ProductDetails";
import ProductSpecifications from "@/components/product_listing/ProductSpecifications";
import ProductPricing from "@/components/product_listing/ProductPricing";
import ProductShipping from "@/components/product_listing/ProductShipping";
import AdditionalInfo from "@/components/product_listing/AdditionalInfo";

export default function ProductListingPage() {
  const [product, setProduct] = useState({
    title: "",
    category: "",
    description: "",
    images: [],
    qualityVideo: null,
    demoVideo: null,
    dimensions: { length: "", width: "", height: "", weight: "" },
    material: "",
    prepTime: "",
    priceByArtist: "",
    priceOnPlatform: "",
    paymentMethod: "",
    shippingAddress: "",
    internationalShipping: false,
    additionalShippingCost: "",
    stockQuantity: "",
    madeToOrder: false,
    customizationAvailable: false,
    customizationInstructions: "",
    requiresAssembly: false,
    assemblyInstructions: "",
    careInstructions: "",
    returnPolicy: "",
  });

  const updateProduct = (field: string, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Final Product Data:", product);
    // Submit to database (to be implemented)
  };

  return (
    <div className="mt-20 max-w-4xl mx-auto">
    {/* Updated Branding Heading */}
    <h1 className="text-center text-2xl font-bold text-gray-900 leading-snug">
      <span className="text-xl font-extrabold text-white bg-red-500 rounded-lg px-5 py-1 shadow-md">
        CraftID
      </span>
      <span className="text-gray-800 font-bold"> Product Listing</span>
      <br />
      <span className="text-gray-600 text-lg italic font-medium">"Where crafts come alive."</span>
    </h1>

      {/* Reduced Space Between Sections */}
      <div className="space-y-1">
        <ProductDetails product={product} updateProduct={updateProduct} />
        <ProductSpecifications product={product} updateProduct={updateProduct} />
        <ProductPricing product={product} updateProduct={updateProduct} />
        <ProductShipping product={product} updateProduct={updateProduct} />
        <AdditionalInfo product={product} updateProduct={updateProduct} />
      </div>

      <div className="flex justify-center mt-6 px-4">
      <Button className="px-6 py-2 font-bold rounded-2xl text-md text-white bg-red-500 hover:bg-red-600 shadow-md transition-all">
        Submit Product
      </Button>
    </div>

    </div>
  );
}
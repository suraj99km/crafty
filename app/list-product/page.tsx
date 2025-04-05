"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductDetails from "@/components/product_listing/ProductDetails";
import ProductSpecifications from "@/components/product_listing/ProductSpecifications";
import ProductPricing from "@/components/product_listing/ProductPricing";
import ProductShipping from "@/components/product_listing/ProductShipping";
import AdditionalInfo from "@/components/product_listing/AdditionalInfo";
import { toast } from "sonner";

export default function ProductListingPage() {
  const [product, setProduct] = useState({
    title: "",
    category: "",
    description: "",
    images: [],
    demo_video: null,

    // Product Specifications Step
    dimensions: { length: undefined, width: undefined, height: undefined, weight: undefined },
    material: "",
    prep_time: undefined,

    // Product Pricing Step
    artist_price: undefined,
    platform_price: undefined,
    is_discount_enabled: false,
    artist_sale_price: undefined,
    final_sale_price: undefined,
    payment_method_id: "",
    
    // Product Shipping Step
    shipping_address_id: "",
    stock_quantity: undefined,
    made_to_order: false,

    // Product Additional Info Step
    customization_available: false,
    customization_instructions: "",
    requires_assembly: false,
    assembly_instructions: "",
    care_instructions: "",
    return_policy: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // Load saved product data from localStorage after the component has mounted
  useEffect(() => {
    setIsClient(true);

    const savedProduct = JSON.parse(localStorage.getItem("productData") || "{}");
    setProduct((prev) => ({
      ...prev,
      title: savedProduct.title || "",
      category: savedProduct.category || "",
      description: savedProduct.description || "",
      images: savedProduct.images || [],
      demo_video: savedProduct.demo_video || null,

      dimensions: savedProduct.dimensions || { length: undefined, width: undefined, height: undefined, weight: undefined },
      material: savedProduct.material || "",
      prep_time: savedProduct.prep_time || undefined,

      artist_price: savedProduct.artist_price || undefined,
      platform_price: savedProduct.platform_price || undefined,
      is_discount_enabled: savedProduct.is_discount_enabled || false,
      artist_sale_price: savedProduct.artist_sale_price || undefined,
      final_sale_price: savedProduct.final_sale_price || undefined,
      payment_method_id: savedProduct.payment_method_id || "",

      shipping_address_id: savedProduct.shipping_address_id || "",
      stock_quantity: savedProduct.stock_quantity || undefined,
      made_to_order: savedProduct.made_to_order || false,
      
      customization_available: savedProduct.customization_available || false,
      customization_instructions: savedProduct.customization_instructions || "",
      requires_assembly: savedProduct.requires_assembly || false,
      assembly_instructions: savedProduct.assembly_instructions || "",
      care_instructions: savedProduct.care_instructions || "",
      return_policy: savedProduct.return_policy || "",
    }));
  }, []);

  // Rest of the component remains the same...
  const updateProduct = (field: string, value: any) => {
    setProduct((prev) => {
      const updatedProduct = { ...prev, [field]: value };
      // Save the updated product data to localStorage
      localStorage.setItem("productData", JSON.stringify(updatedProduct));
      return updatedProduct;
    });
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 5)); // Max step 5
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1)); // Min step 1
  };

  const handlePreview = () => {
    // Save the final product data to localStorage before redirecting
    localStorage.setItem("productData", JSON.stringify(product));
    
    // Redirect to the preview page
    window.location.href = "/list-product/preview";
  };

  const isProductValid = () => {
    try {
      const savedProduct = JSON.parse(localStorage.getItem("productData") || "{}");

      return (
        savedProduct.title?.trim() &&
        savedProduct.category?.trim() &&
        savedProduct.description?.trim().length >= 50 &&
        Array.isArray(savedProduct.images) &&
        savedProduct.images.length >= 3 &&
        savedProduct.dimensions?.length &&
        savedProduct.dimensions?.width &&
        savedProduct.dimensions?.height &&
        savedProduct.dimensions?.weight &&
        savedProduct.material?.trim() &&
        savedProduct.prep_time &&
        savedProduct.artist_price &&
        savedProduct.platform_price &&
        savedProduct.payment_method_id?.trim() &&
        savedProduct.shipping_address_id?.trim() &&
        (savedProduct.stock_quantity || savedProduct.made_to_order === true) &&
        savedProduct.return_policy?.trim()
      );
    } catch (error) {
      console.error("Error validating product data:", error);
      return false;
    }
  };

  if (!isClient) {
    // Prevent rendering until the client-side JavaScript has mounted
    return null;
  }

  return (
    <div className="mt-20 max-w-4xl mx-auto">

    {/* Step Indicator */}
    <div className="relative flex items-center justify-between max-w-3xl mx-auto px-4">
      {["Details", "Specifications", "Pricing", "Shipping", "Additional Info"].map((step, index) => (
        <div key={index} className="relative flex flex-col items-center w-1/5 text-center cursor-pointer" onClick={() => setCurrentStep(index + 1)}>
          
          {/* Step Number Circle */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white
              ${currentStep >= index + 1 ? "bg-red-500" : "bg-gray-300"} z-[3]`}
          >
            {index + 1}
          </div>

          {/* Connecting Line - Hide last connector */}
          {index < 4 && (
            <div className={`absolute top-4 left-[55%] w-full h-[4px] ${currentStep > index + 1 ? "bg-red-500" : "bg-gray-100"} z-[2]`}>
                <div className="h-full w-full border-dotted border-t-2 border-red-500 z-[1]"></div>
            </div>
          )}
          
        </div>
      ))}
    </div>

      {/* Step-based Section Rendering */}
      <div>
        {currentStep === 1 && <ProductDetails product={product} updateProduct={updateProduct} />}
        {currentStep === 2 && <ProductSpecifications product={product} updateProduct={updateProduct} />}
        {currentStep === 3 && <ProductPricing product={product} updateProduct={updateProduct} />}
        {currentStep === 4 && <ProductShipping product={product} updateProduct={updateProduct} />}
        {currentStep === 5 && <AdditionalInfo product={product} updateProduct={updateProduct} />}
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center mt-4 mb-6 px-4 gap-4">
        {currentStep > 1 && (
          <Button
            onClick={handlePrevStep}
            className="px-6 py-2 font-bold rounded-2xl text-md text-white bg-gray-500 hover:bg-gray-600 shadow-md transition-all"
          >
            Back
          </Button>
        )}

        {currentStep < 5 ? (
          <Button
            onClick={handleNextStep}
            className="px-6 py-2 font-bold rounded-2xl text-md text-white bg-red-500 hover:bg-red-600 shadow-md transition-all"
          >
            Next
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={handlePreview}
              disabled={!isProductValid()}
              className={`px-6 py-2 font-bold rounded-2xl text-md text-white shadow-md transition-all ${
                isProductValid()
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Preview Product
            </Button>
            {!isProductValid() && (
              <p className="text-xs text-red-500 mt-1">
                Please complete all required fields before previewing.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
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
    qualityVideo: null,
    demoVideo: null,
    dimensions: { length: undefined, width: undefined, height: undefined, weight: undefined }, // <-- Use undefined instead of null
    material: "",
    prepTime: undefined,
    artistPrice: undefined,
    platformPrice: undefined,
    paymentMethodId: "",
    
    shippingAddressId: "",
    stockQuantity: undefined,
    madeToOrder: false,

    customizationAvailable: false,
    customizationInstructions: "",
    requiresAssembly: false,
    assemblyInstructions: "",
    careInstructions: "",
    returnPolicy: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false); // State to check if the component is mounted on the client

  // Load saved product data from localStorage after the component has mounted
  useEffect(() => {
    setIsClient(true); // Mark the component as mounted on the client

    const savedProduct = JSON.parse(localStorage.getItem("productData") || "{}");
    setProduct((prev) => ({
      ...prev,
      title: savedProduct.title || "",
      category: savedProduct.category || "",
      description: savedProduct.description || "",
      images: savedProduct.images || [],
      qualityVideo: savedProduct.qualityVideo || null,
      demoVideo: savedProduct.demoVideo || null,

      dimensions: savedProduct.dimensions || { length: null, width: null, height: null, weight: null },
      material: savedProduct.material || "",
      prepTime: savedProduct.prepTime || null,

      artistPrice: savedProduct.artistPrice || "",
      platformPrice: savedProduct.platformPrice || "",
      paymentMethodId: savedProduct.paymentMethodId || "",


      shippingAddressId: savedProduct.shippingAddressId || "",
      stockQuantity: savedProduct.stockQuantity || null,
      madeToOrder: savedProduct.madeToOrder || false,
      
      customizationAvailable: savedProduct.customizationAvailable || false,
      customizationInstructions: savedProduct.customizationInstructions || "",
      requiresAssembly: savedProduct.requiresAssembly || false,
      assemblyInstructions: savedProduct.assemblyInstructions || "",
      careInstructions: savedProduct.careInstructions || "",
      returnPolicy: savedProduct.returnPolicy || "",
    }));
  }, []);

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
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1)); // Min step 1
  };

  const handleSubmit = () => {
    console.log("Final Product Data:", product);
    // Submit to database (to be implemented)
    toast.success("Product submitted successfully!");
    // Clear the product data from localStorage once the product is submitted
    localStorage.removeItem("productData");
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
          <Button
            onClick={handleSubmit}
            className="px-6 py-2 font-bold rounded-2xl text-md text-white bg-red-500 hover:bg-red-600 shadow-md transition-all"
          >
            Submit Product
          </Button>
        )}
      </div>
    </div>
  );
}
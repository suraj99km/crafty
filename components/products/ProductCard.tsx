import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/Types";
import { isGlobalSaleActive, getGlobalSaleInfo } from "@/lib/supabase-db/global-utils";
import { useState, useEffect } from "react";

const ProductCard = ({ product }: { product: Product }) => {
  const [globalSaleActive, setGlobalSaleActive] = useState<boolean>(false);
  const [saleInfo, setSaleInfo] = useState<any>(null);

  // Check if global sale is active
  useEffect(() => {
    const checkGlobalSale = async () => {
      try {
        const saleActive = await isGlobalSaleActive().catch(() => false);
        setGlobalSaleActive(saleActive);
        
        if (saleActive) {
          const info = await getGlobalSaleInfo().catch(() => ({
            isActive: false,
            discountPercentage: 0,
            startDate: null,
            endDate: null
          }));
          setSaleInfo(info);
        }
      } catch (err) {
        console.error("Error checking global sale status:", err);
        setGlobalSaleActive(false);
        setSaleInfo(null);
      }
    };
    
    checkGlobalSale();
  }, []);

  // Calculate sale price based on global sale settings
  const calculateSalePrice = () => {
    // If global sale is not active, only use product-specific discounts
    if (!globalSaleActive) {
      return product.is_discount_enabled && product.final_sale_price 
        ? product.final_sale_price 
        : product.platform_price || 0;
    }
    
    // If product has its own discount and it's enabled, use that
    if (product.is_discount_enabled && product.final_sale_price) {
      return product.final_sale_price;
    }
    
    // If global sale is active and has discount percentage
    if (saleInfo?.discountPercentage > 0) {
      const discount = ((product.platform_price || 0) * saleInfo.discountPercentage) / 100;
      return Math.round(((product.platform_price || 0) - discount) * 100) / 100;
    }
    
    // Default to regular price
    return product.platform_price || 0;
  };

  // Check if product is on sale
  const isProductOnSale = () => {
    // If global sale is not active, only check product-specific discount
    if (!globalSaleActive) {
      return false; // Don't show sale indicators when global sale is inactive
    }
    
    // Product has its own discount
    if (product.is_discount_enabled && product.final_sale_price) {
      return true;
    }
    
    // Global sale is active with discount percentage
    if (saleInfo?.discountPercentage > 0) {
      return true;
    }
    
    return false;
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    const originalPrice = product.platform_price || 0;
    const salePrice = calculateSalePrice();
    
    if (originalPrice === salePrice) return 0;
    
    const discountPercentage = ((originalPrice - salePrice) / originalPrice) * 100;
    return Math.round(discountPercentage);
  };

  return (
    <Link key={product.id} href={`/products/${product.id}`} passHref>
      <div className="border p-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-lg flex flex-col h-full">
        <div className="relative group">
          <div className="relative aspect-square">
            <Image 
              src={product.images[0]} 
              alt={product.title}
              fill
              className="object-cover rounded-lg"
            />
            {product.final_sale_price && product.platform_price && product.final_sale_price < product.platform_price && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                {Math.round(((product.platform_price - product.final_sale_price) / product.platform_price) * 100)}% OFF
              </div>
            )}
          </div>
          
          <div className="mt-2">
            <h3 className="text-sm font-medium">{product.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              {product.final_sale_price && product.platform_price && product.final_sale_price < product.platform_price ? (
                <>
                  <p className="text-gray-600 line-through text-sm">₹{product.platform_price}</p>
                  <p className="text-green-600 font-semibold">₹{product.final_sale_price}</p>
                </>
              ) : (
                <p className="text-gray-600">₹{product.platform_price || 0}</p>
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-left mt-2">Artist: {product.artist_name}</p>
      </div>
    </Link>
  );
};

export default ProductCard;

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchLatestProductsWithCategories } from "@/lib/supabase-db/utils";
import { isGlobalSaleActive, getGlobalSaleInfo } from "@/lib/supabase-db/global-utils";
import { ArrowUpDown, Tag, Zap } from "lucide-react"; // Added Tag icon for sale badge
import Link from "next/link";
import CountdownTimer from "@/components/ui/countdown-timer";

// Native debounce function to avoid flickering
const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("sales_count"); // Default: Popularity
  const [globalSaleActive, setGlobalSaleActive] = useState<boolean>(false);
  const [saleInfo, setSaleInfo] = useState<any>(null);

  // Handle Search Input with Debounce
  const handleSearch = useCallback(
    debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  // Check if global sale is active
  useEffect(() => {
    const checkGlobalSale = async () => {
      try {
        // First check if the table exists and has data
        const saleActive = await isGlobalSaleActive().catch(() => false);
        setGlobalSaleActive(saleActive);
        
        // Only fetch additional sale info if sale is active
        if (saleActive) {
          const info = await getGlobalSaleInfo().catch(() => ({
            isActive: false,
            startDate: null,
            endDate: null
          }));
          setSaleInfo(info);
        }
      } catch (err) {
        console.error("Error checking global sale status:", err);
        // Set defaults if there's an error
        setGlobalSaleActive(false);
        setSaleInfo(null);
      }
    };
    
    checkGlobalSale();
  }, []);

  // Check if product is on sale
  const isProductOnSale = (product: any) => {
    if (!globalSaleActive) return false;
    
    return (
      (product.is_discount_enabled && product.final_sale_price !== null && product.final_sale_price !== undefined) ||
      (saleInfo?.discountPercentage > 0)
    );
  };

  // Calculate sale platform_price based on global sale settings
  const calculateSalePrice = (product: any) => {
    const platformPrice = product.platform_price || 0;
    const finalSalePrice = product.final_sale_price || 0;

    // If global sale is not active, return regular price
    if (!globalSaleActive) {
      return platformPrice;
    }
    
    // If product has its own discount and it's enabled, use that
    if (product.is_discount_enabled && finalSalePrice > 0) {
      return finalSalePrice;
    }
    
    // Global sale with percentage
    if (saleInfo?.discountPercentage > 0) {
      const discount = (platformPrice * saleInfo.discountPercentage) / 100;
      return Math.round((platformPrice - discount) * 100) / 100;
    }
    
    return platformPrice;
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (product: any) => {
    const originalPrice = product.platform_price || 0;
    const salePrice = calculateSalePrice(product);
    
    if (originalPrice <= 0 || originalPrice === salePrice) return 0;
    
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  // Fetch Products from DB & Apply Sorting
  useEffect(() => {
    const loadLatestProducts = async () => {
      setLoading(true);
      const data = await fetchLatestProductsWithCategories(sortOption);
      if (data) {
        let sortedProducts = data.products;

        // Apply Price Sorting considering discounts
        if (sortOption === "price_low_to_high") {
          sortedProducts = [...sortedProducts].sort((a, b) => {
            const priceA = a.is_discount_enabled && a.final_sale_price ? a.final_sale_price : a.platform_price;
            const priceB = b.is_discount_enabled && b.final_sale_price ? b.final_sale_price : b.platform_price;
            return priceA - priceB;
          });
        } else if (sortOption === "price_high_to_low") {
          sortedProducts = [...sortedProducts].sort((a, b) => {
            const priceA = a.is_discount_enabled && a.final_sale_price ? a.final_sale_price : a.platform_price;
            const priceB = b.is_discount_enabled && b.final_sale_price ? b.final_sale_price : b.platform_price;
            return priceB - priceA;
          });
        }

        setProducts(sortedProducts);
        setCategories(data.categories);
      }
      setLoading(false);
    };

    loadLatestProducts();
  }, [sortOption]); // Re-fetch when sort changes

  // Handle sorting cycle
  const handleSortCycle = () => {
    const sortOrder = [
      "sales_count",
      "recentlyAdded",
      "recentlyModified",
      "price_low_to_high",
      "price_high_to_low",
    ];
    const currentIndex = sortOrder.indexOf(sortOption);
    const nextIndex = (currentIndex + 1) % sortOrder.length;
    setSortOption(sortOrder[nextIndex]);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 rounded-full animate-spin border-t-red-500"></div>
      </div>
    );

  return (
    <section className="container mx-auto p-2 mt-14 min-h-screen">
      {/* Global Sale Banner - Show only if active */}
      {globalSaleActive && saleInfo?.endDate && (
        <div className="flex flex-col gap-2 bg-red-50 p-3 rounded-lg mb-4">
          <div className="flex flex-center text-sm text-center font-bold text-red-600">
            <Zap size="18" className="mr-1 text-yellow-500 fill-yellow-500"/>
            Weekend Sale Ends In:
            </div>
          <CountdownTimer 
            endDate={saleInfo.endDate} 
            onExpire={() => setGlobalSaleActive(false)}
          />
        </div>
      )}

      {/* Search & Sorting Bar (No Sticky) */}
      <div className="mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="border p-2 rounded-lg flex-grow shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Compact Sort Button */}
          <button
            className="flex items-center gap-1 border p-2 rounded-lg bg-white text-sm shadow-sm hover:bg-gray-100 transition"
            onClick={handleSortCycle}
          >
            <ArrowUpDown size={18} className="text-gray-600" />
            <span className="text-xs text-gray-600">
              {sortOption === "sales_count"
                ? "Popularity"
                : sortOption === "recentlyAdded"
                ? "Recently Added"
                : sortOption === "recentlyModified"
                ? "Recently Modified"
                : sortOption === "price_low_to_high"
                ? "Price: Low to High"
                : "Price: High to Low"}
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable Categories */}
      <div className="flex overflow-x-auto space-x-4 mb-4 lg:hidden">
        <button
          className={`p-1 px-3 text-xs rounded-lg ${
            selectedCategory === "All" ? "bg-red-500 text-white border-2 border-red-500" : "bg-white border-2"
          }`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`p-1 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ease-in-out ${
              selectedCategory === category ? "bg-red-500 text-white shadow-lg border-2 border-red-500" : "bg-white border-2 text-gray-700"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar for categories on large screens */}
        <aside className="hidden lg:block w-1/6">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            <li className="cursor-pointer" onClick={() => setSelectedCategory("All")}>
              All
            </li>
            {categories.map((category) => (
              <li key={category} className="cursor-pointer" onClick={() => setSelectedCategory(category)}>
                {category}
              </li>
            ))}
          </ul>
        </aside>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-4 flex-1">
          {products
            .filter(
              (product) =>
                (selectedCategory === "All" || product.category === selectedCategory) &&
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} passHref>
                <div className="border p-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-lg flex flex-col h-full">
                  <div className="relative">
                    <img 
                      src={product.image_url || (product.images && product.images[0])} 
                      alt={product.title} 
                      className="w-full h-40 object-cover rounded-md" 
                    />
                    {/* Sale badge - only show if product is actually on sale */}
                    {isProductOnSale(product) && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-md">
                        {calculateDiscountPercentage(product)}% OFF
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 font-semibold flex-grow">{product.title}</h3>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <p className="font-bold text-left text-red-600">₹ {calculateSalePrice(product)}</p>
                      {/* Show original platform_price if on sale */}
                      {isProductOnSale(product) && (
                        <p className="ml-2 text-xs text-gray-500 line-through">₹ {product.platform_price}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 text-left">Artist: {product.artist_name}</p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}

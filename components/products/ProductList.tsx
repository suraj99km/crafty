"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchLatestProductsWithCategories } from "@/lib/supabase-db/utils";
import { isGlobalSaleActive, getGlobalSaleInfo } from "@/lib/supabase-db/global-utils";
import { ArrowUpDown, Tag } from "lucide-react"; // Added Tag icon for sale badge
import Link from "next/link";

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

  // Calculate sale platform_price based on global sale settings
  const calculateSalePrice = (product: any) => {
    // If global sale is not active, only use product-specific discounts
    if (!globalSaleActive) {
      return product.is_discount_enabled && product.final_sale_price 
        ? product.final_sale_price 
        : product.platform_price;
    }
    
    // If product has its own discount and it's enabled, use that
    if (product.is_discount_enabled && product.final_sale_price) {
      return product.final_sale_price;
    }
    
    // If global sale is active and has discount percentage
    if (saleInfo?.discountPercentage > 0) {
      const discount = (product.platform_price * saleInfo.discountPercentage) / 100;
      return Math.round((product.platform_price - discount) * 100) / 100;
    }
    
    // Default to regular platform_price
    return product.platform_price;
  };

  // Check if product is on sale
  const isProductOnSale = (product: any) => {
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
  const calculateDiscountPercentage = (product: any) => {
    const originalPrice = product.platform_price;
    const salePrice = calculateSalePrice(product);
    
    if (originalPrice === salePrice) return 0;
    
    const discountPercentage = ((originalPrice - salePrice) / originalPrice) * 100;
    return Math.round(discountPercentage);
  };

  // Fetch Products from DB & Apply Sorting
  useEffect(() => {
    const loadLatestProducts = async () => {
      setLoading(true);
      const data = await fetchLatestProductsWithCategories(sortOption);
      if (data) {
        let sortedProducts = data.products;

        // Apply platform_price Sorting
        if (sortOption === "price_low_to_high") {
          sortedProducts = [...sortedProducts].sort((a, b) => a.platform_price - b.platform_price);
        } else if (sortOption === "price_high_to_low") {
          sortedProducts = [...sortedProducts].sort((a, b) => b.platform_price - a.platform_price);
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
      {globalSaleActive && saleInfo && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            <span className="font-bold">Sale Active!</span>
            {saleInfo.discountPercentage > 0 && (
              <span className="ml-2">Up to {saleInfo.discountPercentage}% off selected items</span>
            )}
          </div>
          {saleInfo.endDate && (
            <div className="text-sm">
              Ends: {new Date(saleInfo.endDate).toLocaleDateString()}
            </div>
          )}
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
                ? "platform_price: Low to High"
                : "platform_price: High to Low"}
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

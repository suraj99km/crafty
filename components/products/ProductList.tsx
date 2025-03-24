"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchLatestProductsWithCategories } from "@/lib/supabase-db/utils";
import { ArrowUpDown } from "lucide-react"; // Sort icon
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

  // Handle Search Input with Debounce
  const handleSearch = useCallback(
    debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  // Fetch Products from DB & Apply Sorting
  useEffect(() => {
    const loadLatestProducts = async () => {
      setLoading(true);
      const data = await fetchLatestProductsWithCategories(sortOption);
      if (data) {
        let sortedProducts = data.products;

        // Apply Price Sorting
        if (sortOption === "price_low_to_high") {
          sortedProducts = [...sortedProducts].sort((a, b) => a.price - b.price);
        } else if (sortOption === "price_high_to_low") {
          sortedProducts = [...sortedProducts].sort((a, b) => b.price - a.price);
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
                  <img src={product.image_url} alt={product.title} className="w-full h-40 object-cover rounded-md" />
                  <h3 className="mt-2 font-semibold flex-grow">{product.title}</h3>
                  <div className="mt-2">
                    <p className="font-bold text-left">₹ {product.price}</p>
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

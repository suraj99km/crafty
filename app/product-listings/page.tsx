"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown,Plus, Search, Filter, Star, TrendingUp, Package, AlertCircle, IndianRupee, ChevronDown, Edit2 } from "lucide-react";
import { toast } from "sonner";

import { Product } from "@/Types";
import supabase from "@/lib/supabase-db/supabaseClient";
import { getArtistId } from "@/lib/supabase-db/utils";

export default function ProductListingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<string>("created_at");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    inStock: false,
    onSale: false,
    madeToOrder: false,
    hasOrders: false
  });
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const artistId = await getArtistId();
        if (!artistId) {
          toast.error("Artist profile not found. Please complete your profile first.");
          router.push("/join-as-artist");
          return;
        }

        let query = supabase
          .from("Products")
          .select("*")
          .eq("artist_id", artistId);

        // Apply sorting
        if (sortOption === "created_at") {
          query = query.order("created_at", { ascending: false });
        } else if (sortOption === "platform_price") {
          query = query.order("platform_price", { ascending: false });
        } else if (sortOption === "sales_count") {
          query = query.order("sales_count", { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data?.map(product => product.category) || []));
        setCategories(uniqueCategories);
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortOption, router]);

  // Apply filters and search
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    
    const matchesFilters = (
      (!filters.inStock || (!product.made_to_order && (product.stock_quantity ?? 0) > 0)) &&
      (!filters.onSale || product.is_discount_enabled) &&
      (!filters.madeToOrder || product.made_to_order) &&
      (!filters.hasOrders || (product.sales_count && product.sales_count > 0))
    );

    return matchesSearch && matchesCategory && matchesFilters;
  });

  // Group products by status
  const getProductGroups = () => {
    const groups = {
      needsAttention: [] as Product[],
      onSale: [] as Product[],
      outOfStock: [] as Product[],
      active: [] as Product[]
    };

    filteredProducts.forEach(product => {
      if (!product.made_to_order && (product.stock_quantity ?? 0) === 0) {
        groups.needsAttention.push(product);
      } else if (product.is_discount_enabled) {
        groups.onSale.push(product);
      } else if (!product.made_to_order && (product.stock_quantity ?? 0) < 5) {
        groups.outOfStock.push(product);
      } else {
        groups.active.push(product);
      }
    });

    return groups;
  };

  const productGroups = getProductGroups();

  // Handle sorting cycle
  const handleSortCycle = () => {
    const sortOrder = ["created_at", "platform_price", "sales_count"];
    const currentIndex = sortOrder.indexOf(sortOption);
    const nextIndex = (currentIndex + 1) % sortOrder.length;
    setSortOption(sortOrder[nextIndex]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 rounded-full animate-spin border-t-red-500"></div>
      </div>
    );
  }

  const renderProductCard = (product: Product) => (
    <motion.div 
      key={product.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex flex-col">
        {/* Main Content */}
        <div className="flex p-3">
          {/* Image */}
          <Link href={`/products/${product.id}`} className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover rounded-md"
            />
          </Link>
          
          {/* Content */}
          <div className="flex-1 ml-3 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <Link href={`/products/${product.id}`} className="flex-1 min-w-0">
                    <h3 className="font-medium text-[15px] text-gray-800 truncate leading-tight">{product.title}</h3>
                  </Link>
                  {/* CraftID style edit button */}
                  <Link 
                    href={`/list-product/preview?edit=${product.id}`}
                    className="ml-2 p-1.5 -mt-1 -mr-1 rounded-md hover:bg-gray-50 transition-colors group"
                    title="Edit Product"
                  >
                    <Edit2 size={15} className="text-gray-400 group-hover:text-gray-600" />
                  </Link>
                </div>

                {/* Essential Info Row */}
                <div className="mt-1.5 flex items-center gap-3 text-sm">
                  <span className={`${(product.stock_quantity ?? 0) > 0 ? 'text-red-500' : 'text-red-600'} font-medium`}>
                    {product.made_to_order ? 'Made to Order' : 
                      (product.stock_quantity ?? 0) > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-gray-500">{product.category}</span>
                </div>

                {/* Price Row */}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-gray-900">₹{product.final_sale_price || product.platform_price}</span>
                  {product.is_discount_enabled && (
                    <>
                      <span className="text-sm text-gray-400 line-through">₹{product.platform_price}</span>
                      <span className="text-sm text-green-600 font-medium">
                        {Math.round(((product.platform_price ?? 0) - (product.final_sale_price ?? 0)) / (product.platform_price ?? 1) * 100)}% off
                      </span>
                    </>
                  )}
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {product.made_to_order && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                      {product.prep_time} days delivery
                    </span>
                  )}
                  {!product.made_to_order && (product.stock_quantity ?? 0) < 5 && (product.stock_quantity ?? 0) > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-orange-50 text-orange-700 rounded-full">
                      Low Stock
                    </span>
                  )}
                  {product.is_discount_enabled && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                      On Sale
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Button */}
        <button
          onClick={() => setOpenAccordionId(openAccordionId === product.id ? null : product.id)}
          className="w-full px-3 py-2 flex items-center justify-between text-sm text-gray-500 hover:bg-gray-50 border-t"
        >
          <span className="font-medium">More Details</span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              openAccordionId === product.id ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Accordion Content */}
        <AnimatePresence>
          {openAccordionId === product.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t bg-gray-50"
            >
              <div className="p-3 space-y-4 text-sm">
                {/* Product Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Stock Status</div>
                    <div className="text-gray-900">
                      {product.made_to_order ? 'Made to Order' : `${product.stock_quantity ?? 0} units`}
                    </div>
                  </div>
                  {product.made_to_order && (
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Preparation Time</div>
                      <div className="text-gray-900">{product.prep_time} days</div>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Your Earnings</div>
                    <div className="text-gray-900">₹{product.artist_price}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Created On</div>
                    <div className="text-gray-900">
                      {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>

                {product.is_discount_enabled && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Original Price</div>
                        <div className="text-gray-900">₹{product.platform_price}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Sale Price</div>
                        <div className="text-gray-900">₹{product.final_sale_price}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 mt-14">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100 flex flex-col justify-between">
          <p className="text-xs text-gray-500">Listed Products</p>
          <p className="text-lg font-semibold">{filteredProducts.length}</p>
        </div>
        <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100 flex flex-col justify-between">
          <p className="text-xs text-gray-500"></p>
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-lg font-semibold text-red-500">
            {products.filter(p => (p.made_to_order || (p.stock_quantity ?? 0) > 0)).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100 flex flex-col justify-between">
        <p className="text-xs text-gray-500"></p>
          <p className="text-xs text-gray-500">On Sale</p>
          <p className="text-lg font-semibold text-red-500">{products.filter(p => p.is_discount_enabled).length}</p>
        </div>
        <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100 flex flex-col justify-between">
          <p className="text-xs text-gray-500">Out of Stock</p>
          <p className="text-lg font-semibold text-red-500">
            {products.filter(p => !p.made_to_order && (p.stock_quantity ?? 0) === 0).length}
          </p>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-gray-400 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setFilterModalOpen(true)}
          className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
          title="Filter Products"
        >
          <Filter size={16} className="text-gray-600" />
        </button>
        <button
          onClick={handleSortCycle}
          className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
          title="Sort Products"
        >
          <ArrowUpDown size={16} className="text-gray-600" />
        </button>
        <Link href="/list-product">
          <button className="px-2 py-2 flex bg-red-500 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
            <Plus size={18} className="mr-1" />
            Add New
          </button>
        </Link>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "All"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
          <p className="text-gray-500 text-sm">
            {searchTerm ? "No products found matching your search" : "Start by adding your first product"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries({
            "Needs Attention": { items: productGroups.needsAttention, icon: AlertCircle, color: "red" },
            "On Sale": { items: productGroups.onSale, icon: TrendingUp, color: "red" },
            "Low Stock": { items: productGroups.outOfStock, icon: Package, color: "red" },
            "Active Products": { items: productGroups.active, icon: Star, color: "red" }
          }).map(([title, { items, icon: Icon, color }]) => 
            items.length > 0 && (
              <div key={title}>
                <div className={`flex items-center gap-1.5 text-red-500 mb-2 px-1`}>
                  <Icon size={14} />
                  <span className="text-sm font-medium">{title}</span>
                  <span className="text-xs text-gray-500">({items.length})</span>
                </div>
                <div className="space-y-2">
                  {items.map(product => renderProductCard(product))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Filter Modal with updated styling */}
      <AnimatePresence>
        {filterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setFilterModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">Filter Products</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={e => setFilters(f => ({ ...f, inStock: e.target.checked }))}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm">In Stock</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={e => setFilters(f => ({ ...f, onSale: e.target.checked }))}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm">On Sale</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.madeToOrder}
                    onChange={e => setFilters(f => ({ ...f, madeToOrder: e.target.checked }))}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm">Made to Order</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.hasOrders}
                    onChange={e => setFilters(f => ({ ...f, hasOrders: e.target.checked }))}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm">Has Orders</span>
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setFilters({
                      inStock: false,
                      onSale: false,
                      madeToOrder: false,
                      hasOrders: false
                    });
                    setFilterModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFilterModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

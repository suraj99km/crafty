"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Product, Artist } from "@/Types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Play, Heart, Share2, Truck, Shield, Package, RefreshCw,
  ShoppingCart, ArrowLeft, ArrowRight, Clock, Hammer, Info, ArrowUpDown,
  Star, Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isGlobalSaleActive, getGlobalSaleInfo } from "@/lib/supabase-db/global-utils";

type Props = {
  product: Product;
  artist: Artist | null;
};

const ProductDetails: React.FC<Props> = ({ product, artist }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [globalSale, setGlobalSale] = useState<{ active: boolean; discountPercentage: number }>({ 
    active: false, 
    discountPercentage: 0 
  });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const allMedia = [...product.images, ...(product.demo_video ? [product.demo_video] : [])];

  useEffect(() => {
    const cart: (Product & { quantity: number })[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalQuantity = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    setCartCount(totalQuantity);
  }, []);

  useEffect(() => {
    const checkGlobalSale = async () => {
      const active = await isGlobalSaleActive();
      if (active) {
        const saleInfo = await getGlobalSaleInfo();
        setGlobalSale({ active: true, discountPercentage: saleInfo?.discountPercentage || 0 });
      }
    };
    checkGlobalSale();
  }, []);

  const handleAddToCart = () => {
    setIsAdding(true);
  
    setTimeout(() => {
      setIsAdding(false);
  
      let cart: (Product & { quantity: number })[] = JSON.parse(localStorage.getItem("cart") || "[]");
  
      const existingProductIndex = cart.findIndex((item) => item.id === product.id);
  
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
  
      localStorage.setItem("cart", JSON.stringify(cart));
  
      const totalQuantity = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(totalQuantity);
  
      toast.success(`${product.title} added to cart!`, {
        duration: 3000,
      });
    }, 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev + 1) % allMedia.length);
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPrice = () => {
    const platformPrice = product.platform_price || 0;
    const finalSalePrice = product.final_sale_price || 0;

    if (globalSale.active && product.is_discount_enabled && platformPrice > 0 && finalSalePrice > 0) {
      const discount = Math.round(((platformPrice - finalSalePrice) / platformPrice) * 100);
      return {
        currentPrice: finalSalePrice,
        originalPrice: platformPrice,
        discount
      };
    }
    return {
      currentPrice: platformPrice,
      originalPrice: null,
      discount: 0
    };
  };

  return (
    <div className="mt-14 min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="pb-24">
        {/* Image Gallery */}
        <div 
          ref={galleryRef}
          className="relative bg-gray-100 aspect-square touch-pan-x"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {currentImageIndex < product.images.length ? (
                <img
                  src={allMedia[currentImageIndex]}
                  alt={`${product.title} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={product.demo_video || ''}
                  controls
                  className="w-full h-full object-cover"
                >
                  Your browser doesn't support video playback.
                </video>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {allMedia.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentImageIndex === idx ? "w-6 bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="px-4 py-6 bg-white">
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Basic Info & Price */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <button
                    onClick={router.back}
                    className="flex items-center text-gray-600 mb-2"
                  >
                    <ChevronLeft size={20} />
                    <span className="text-sm">Back</span>
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  {product.verified && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={16} className="text-green-500 fill-green-500" />
                      <span className="text-sm text-green-600">Verified Product</span>
                    </div>
                  )}
                </div>
                <div className="flex items-end">
                  {globalSale.active && product.is_discount_enabled && product.final_sale_price ? (
                    <>
                      <span className="text-2xl font-bold text-gray-900">₹{product.final_sale_price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">₹{product.platform_price}</span>
                      <span className="text-sm font-medium text-green-600 ml-2">
                        {product.platform_price && product.final_sale_price && 
                          Math.round(((product.platform_price - product.final_sale_price) / product.platform_price) * 100)}% off
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">₹{product.platform_price}</span>
                  )}
                </div>
              </div>

              {/* Artist Info */}
              {artist && (
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                  <img src={artist.profile_picture} alt={artist.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Crafted by</p>
                    <Link href={`/artists/${artist.id}`} className="text-lg font-semibold text-gray-900 hover:text-red-500">
                      {artist.name}
                    </Link>
                    {product.sales_count !== undefined && product.sales_count > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {product.sales_count} {product.sales_count === 1 ? 'sale' : 'sales'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Key Product Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-red-500" />
                <div className="text-sm">
                  <p className="font-medium">Preparation Time</p>
                  <p className="text-gray-600">{product.prep_time} days</p>
                </div>
              </div>
              {product.material && (
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <Hammer className="w-5 h-5 text-red-500" />
                  <div className="text-sm">
                    <p className="font-medium">Material</p>
                    <p className="text-gray-600">{product.material}</p>
                  </div>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <ArrowUpDown className="w-5 h-5 text-red-500" />
                  <div className="text-sm">
                    <p className="font-medium">Dimensions</p>
                    <p className="text-gray-600">
                      {product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height} cm
                      {product.dimensions.weight && ` • ${product.dimensions.weight}g`}
                    </p>
                  </div>
                </div>
              )}
              {!product.made_to_order && product.stock_quantity !== undefined && (
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <Package className="w-5 h-5 text-red-500" />
                  <div className="text-sm">
                    <p className="font-medium">Stock</p>
                    <p className="text-gray-600">{product.stock_quantity} units available</p>
                  </div>
                </div>
              )}
              {product.made_to_order && (
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-red-500" />
                  <div className="text-sm">
                    <p className="font-medium">Made to Order</p>
                    <p className="text-gray-600">Crafted upon order</p>
                  </div>
                </div>
              )}
              {product.created_at && (
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <Calendar className="w-5 h-5 text-red-500" />
                  <div className="text-sm">
                    <p className="font-medium">Listed on</p>
                    <p className="text-gray-600">{formatDate(product.created_at)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
            </div>

            {/* Product Features */}
            {(product.customization_available || product.requires_assembly) && (
              <div className="flex flex-wrap gap-2">
                {product.customization_available && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    Customizable
                  </span>
                )}
                {product.requires_assembly && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
                    Assembly Required
                  </span>
                )}
              </div>
            )}

            {/* Additional Information */}
            {(product.customization_available || product.requires_assembly || product.care_instructions || product.return_policy) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                {product.customization_available && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Customization Instructions</p>
                    <p className="text-gray-600">{product.customization_instructions}</p>
                  </div>
                )}
                {product.requires_assembly && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Assembly Instructions</p>
                    <p className="text-gray-600">{product.assembly_instructions}</p>
                  </div>
                )}
                {product.care_instructions && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Care Instructions</p>
                    <p className="text-gray-600">{product.care_instructions}</p>
                  </div>
                )}
                {product.return_policy && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Return Policy</p>
                    <p className="text-gray-600">{product.return_policy}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-20">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleAddToCart}
            disabled={!product.made_to_order && product.stock_quantity === 0}
            className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 
              ${isAdding 
                ? "bg-green-500 animate-pulse" 
                : !product.made_to_order && product.stock_quantity === 0 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-red-500 hover:bg-red-600"
              } text-white`}
          >
            {!product.made_to_order && product.stock_quantity === 0 
              ? "Out of Stock" 
              : isAdding 
                ? "Adding..." 
                : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Floating Cart Counter */}
      {cartCount > 0 && (
        <div className="fixed bottom-24 right-6 z-30">
          <Link href="/cart">
            <button className="bg-red-500 text-white font-semibold py-3 px-5 rounded-full shadow-lg flex items-center gap-2 hover:bg-red-600 transition-all duration-300">
              <ShoppingCart size={20} />
              <span>{cartCount}</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

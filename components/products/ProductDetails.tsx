"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Product, Artist } from "@/Types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Play, Heart, Share2, Truck, Shield, Package, RefreshCw,
  ShoppingCart, ArrowLeft, ArrowRight, Clock, Hammer, Info, ArrowUpDown,
  Star, Calendar, ChevronDown,
  CheckIcon,
  CheckCircle2Icon,
  CheckCheckIcon,
  CheckCircle2,
  CheckCheck,
  CheckSquareIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isGlobalSaleActive, getGlobalSaleInfo } from "@/lib/supabase-db/global-utils";
import { MdCheckCircle } from "react-icons/md";
import CompactCountdownTimer from '../ui/compact-countdown';

type Props = {
  product: Product;
  artist: Artist | null;
};

const ProductDetails: React.FC<Props> = ({ product, artist }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [globalSale, setGlobalSale] = useState<{ 
    active: boolean; 
    endDate?: string;
  }>({ 
    active: false
  });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});

  const router = useRouter();
  const allMedia = useMemo(() => [...product.images, ...(product.demo_video ? [product.demo_video] : [])], [product.images, product.demo_video]);

  useEffect(() => {
    const getCartAndWishlist = () => {
      try {
        const cart: (Product & { quantity: number })[] = JSON.parse(localStorage.getItem("cart") || "[]");
        const totalQuantity = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
        setCartCount(totalQuantity);
        
        const wishlist: string[] = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setIsWishlisted(wishlist.includes(product.id));
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    };

    getCartAndWishlist();
  }, [product.id]);

  useEffect(() => {
    const checkGlobalSale = async () => {
      const active = await isGlobalSaleActive();
      if (active) {
        const saleInfo = await getGlobalSaleInfo();
        if (saleInfo?.endDate) {
          setGlobalSale({ 
            active: true,
            endDate: saleInfo.endDate.toString()
          });
        }
      }
    };
    checkGlobalSale();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsScrollingUp(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsScrollingUp(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    allMedia.forEach((media, index) => {
      if (index >= product.images.length && videoRefs.current[index]) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                videoRefs.current[index]?.play();
              } else {
                videoRefs.current[index]?.pause();
              }
            });
          },
          { threshold: 0.7 }
        );
        observer.observe(videoRefs.current[index]);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [currentImageIndex, allMedia, product.images.length]);

  const handleAddToCart = () => {
    setIsAdding(true);
  
    setTimeout(() => {
      setIsAdding(false);
  
      let cart: (Product & { quantity_selected: number })[] = JSON.parse(localStorage.getItem("cart") || "[]");
  
      const existingProductIndex = cart.findIndex((item) => item.id === product.id);
  
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity_selected += 1;
      } else {
        cart.push({ ...product, quantity_selected: 1 });
      }
  
      localStorage.setItem("cart", JSON.stringify(cart));
  
      const totalQuantity = cart.reduce((acc, item) => acc + (item.quantity_selected || 1), 0);
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

    if (product.is_discount_enabled && platformPrice > 0 && finalSalePrice > 0) {
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

  const toggleWishlist = () => {
    let wishlist: string[] = JSON.parse(localStorage.getItem("wishlist") || "[]");
    
    if (isWishlisted) {
      wishlist = wishlist.filter(id => id !== product.id);
      toast.info("Removed from wishlist");
    } else {
      wishlist.push(product.id);
      toast.success("Added to wishlist");
    }
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this amazing product: ${product.title}`,
          url: url
        });
      } catch (err) {
        console.error("Error sharing:", err);
        // Fallback to copying to clipboard
        copyToClipboard(url);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch(err => {
      console.error("Could not copy text: ", err);
    });
  };

  const priceInfo = getPrice();

  return (
    <div className="mt-14 min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="absolute top-16 left-4 z-10">
        <button
          onClick={router.back}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md"
          aria-label="Go back"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="absolute top-16 right-4 z-10 flex space-x-2">
        <button
          onClick={toggleWishlist}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            size={20} 
            className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-700"} 
          />
        </button>
        <button
          onClick={handleShare}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md"
          aria-label="Share product"
        >
          <Share2 size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Main Content */}
      <div className="pb-24 max-w-6xl mx-auto">
        {/* Image Gallery - Carousel Style */}
        <div className="relative bg-gray-100 aspect-square overflow-hidden">
          <div 
            ref={galleryRef}
            className="flex transition-transform duration-300 ease-out h-full w-full"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {allMedia.map((media, index) => (
              <div key={index} className="min-w-full h-full flex-shrink-0">
                {index < product.images.length ? (
                  <img
                    src={media}
                    alt={`${product.title} - ${index + 1}`}
                    className="w-full h-full aspect-square object-cover bg-gray-100"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
                    <video
                      ref={el => { if (el) videoRefs.current[index] = el }}
                      src={media}
                      controls
                      playsInline
                      muted
                      loop
                      className="max-w-full max-h-full"
                    >
                      Your browser doesn't support video playback.
                    </video>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {allMedia.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hidden sm:block"
                aria-label="Previous image"
              >
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
              <button 
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allMedia.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hidden sm:block"
                aria-label="Next image"
              >
                <ArrowRight size={20} className="text-gray-700" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {allMedia.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentImageIndex === idx ? "w-6 bg-white" : "bg-white/50"
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="px-4 py-6 bg-white shadow-sm relative z-10">
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Basic Info & Price */}
            <div className="space-y-3">
            <div className="space-y-3">
              {globalSale.active && product.is_discount_enabled && globalSale.endDate && (
                <span className="inline-flex items-center gap-2 text-sm bg-red-50 text-red-600 px-6 py-2 rounded-full">
                  <span className="font-medium">Sale ends in:</span>
                  <CompactCountdownTimer
                    endDate={globalSale.endDate} 
                    onExpire={() => setGlobalSale({ active: false })}
                  />
                </span>
              )}
            </div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{product.category}</p>
                {product.verified && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-green-600">Handmade Verified</span>
                    <MdCheckCircle size={16} className="text-green-500" />
                  </div>
                )}
              </div>
              
              <div className="flex items-baseline gap-3">
                {product.is_discount_enabled && product.final_sale_price ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-red-600">₹{product.final_sale_price}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-gray-500 line-through">₹{product.platform_price}</span>
                        <div className="bg-red-100 text-red-700 px-2 py-0.5 rounded-md text-sm font-semibold">
                          {product.platform_price && product.final_sale_price && 
                            Math.round(((product.platform_price - product.final_sale_price) / product.platform_price) * 100)}% OFF
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">₹{product.platform_price}</span>
                )}
              </div>
            </div>

            {/* Artist Info */}
            {artist && (
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <img src={artist.profile_picture} alt={artist.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
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

            {/* Stock/Made to Order Info */}
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
              {product.made_to_order ? (
                <>
                  <Clock className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium">Made to Order</p>
                    <p className="text-gray-600">Preparation time: {product.prep_time} days</p>
                  </div>
                </>
              ) : (
                <>
                  <Package className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium">Stock Available</p>
                    <p className="text-gray-600">
                      {product.stock_quantity === 0 ? 
                        "Out of Stock" : 
                        `${product.stock_quantity} units available`}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Product Details Grid */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Material */}
                {product.material && (
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <Hammer className="w-5 h-5 text-red-500" />
                    <div className="text-sm">
                      <p className="font-medium">Material</p>
                      <p className="text-gray-600">{product.material}</p>
                    </div>
                  </div>
                )}

                {/* Dimensions */}
                {product.dimensions && (
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <ArrowUpDown className="w-5 h-5 text-red-500" />
                    <div className="text-sm">
                      <p className="font-medium">Dimensions</p>
                      <p className="text-gray-600">
                        {product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height} cm
                      </p>
                    </div>
                  </div>
                )}

                {/* Weight */}
                {product.dimensions?.weight && (
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <Package className="w-5 h-5 text-red-500" />
                    <div className="text-sm">
                      <p className="font-medium">Weight</p>
                      <p className="text-gray-600">
                        {product.dimensions.weight >= 1000 
                          ? `${(product.dimensions.weight / 1000).toFixed(1)} kg`
                          : `${product.dimensions.weight} g`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Return Policy */}
                {product.return_policy && (
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-red-500" />
                    <div className="text-sm">
                      <p className="font-medium">Return Policy</p>
                      <p className="text-gray-600">{product.return_policy}</p>
                    </div>
                  </div>
                )}
              </div>
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

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">{product.description}</p>
            </div>

            {/* Accordion sections for additional information */}
            {(product.customization_available || product.requires_assembly || product.care_instructions || product.return_policy) && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                
                {product.customization_available && (
                  <details className="group bg-gray-50 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between p-4 cursor-pointer">
                      <span className="font-medium">Customization Instructions</span>
                      <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 pt-0 border-t border-gray-100">
                      <p className="text-gray-600">{product.customization_instructions}</p>
                    </div>
                  </details>
                )}
                
                {product.requires_assembly && (
                  <details className="group bg-gray-50 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between p-4 cursor-pointer">
                      <span className="font-medium">Assembly Instructions</span>
                      <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 pt-0 border-t border-gray-100">
                      <p className="text-gray-600">{product.assembly_instructions}</p>
                    </div>
                  </details>
                )}
                
                {product.care_instructions && (
                  <details className="group bg-gray-50 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between p-4 cursor-pointer">
                      <span className="font-medium">Care Instructions</span>
                      <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 pt-0 border-t border-gray-100">
                      <p className="text-gray-600">{product.care_instructions}</p>
                    </div>
                  </details>
                )}
                
                {product.return_policy && (
                  <details className="group bg-gray-50 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between p-4 cursor-pointer">
                      <span className="font-medium">Return Policy</span>
                      <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 pt-0 border-t border-gray-100">
                      <p className="text-gray-600">{product.return_policy}</p>
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 p-3 bg-white border-t shadow-lg z-20 transition-transform duration-300 sm:transform-none ${
        isScrollingUp ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={toggleWishlist}
            className={`p-4 rounded-lg border ${isWishlisted ? 'border-red-200 bg-red-50' : 'border-gray-200'} flex-shrink-0`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              size={20} 
              className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"} 
            />
          </button>
          
          <div className="flex-1">
            <button
              onClick={handleAddToCart}
              disabled={!product.made_to_order && product.stock_quantity === 0}
              className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 
                ${isAdding 
                  ? "bg-green-500 animate-pulse" 
                  : !product.made_to_order && product.stock_quantity === 0 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-red-500 hover:bg-red-600"
                } text-white flex items-center justify-center gap-2`}
            >
              <ShoppingCart size={20} />
              {!product.made_to_order && product.stock_quantity === 0 
                ? "Out of Stock" 
                : isAdding 
                  ? "Adding..." 
                  : "Add to Cart"}
            </button>
          </div>

          <button
            onClick={handleShare}
            className="p-4 rounded-lg border border-gray-200 flex-shrink-0 hover:bg-gray-50 transition-colors"
            aria-label="Share product"
          >
            <Share2 size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Floating Cart Counter */}
      {cartCount > 0 && (
        <div className={`fixed bottom-24 right-6 z-20 transition-transform duration-300 ${
          isScrollingUp ? 'translate-y-0' : 'translate-y-[100%]'
        }`}>
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

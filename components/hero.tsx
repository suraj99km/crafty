"use client";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-db/supabaseClient";
import { User } from "@supabase/supabase-js";
import OurMission from "@/components/home/ourmission";
import HowItWorks from "@/components/home/howitworks";
import { motion, AnimatePresence } from "framer-motion";
// Import Lucide icons
import { CheckCircle, ArrowRight, Gift } from "lucide-react";

const Hero = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [productImages, setProductImages] = useState<string[]>(["/hero.jpg"]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Fetch product images for slideshow
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const { data, error } = await supabase
          .from('Products')
          .select('id, image_url')
          .not('image_url', 'is', null); 
          
        if (error) {
          console.error('Error fetching product images:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Filter valid URLs and prepare data
          const validProducts = data.filter(product => product.image_url && product.image_url.trim() !== '');
            
          if (validProducts.length > 0) {
            // Select random products from the pool
            const randomProducts = getRandomProducts(validProducts, 5);
            setProductImages(randomProducts.map(product => product.image_url));
            setProductIds(randomProducts.map(product => product.id));
          }
        }
      } catch (err) {
        console.error('Error in fetching product images:', err);
      }
    };
    
    // Helper function to get random products from array
    const getRandomProducts = (products: any[], count: number) => {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, products.length));
    };
    
    fetchProductImages();
    
    // Set up interval to refresh the image selection periodically
    const refreshInterval = setInterval(() => {
      fetchProductImages();
    }, 60000); // Refresh image selection every minute
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Handle product image click
  const handleProductClick = (index: number) => {
    if (productIds[index]) {
      router.push(`/products/${productIds[index]}`);
    }
  };
  
  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [productImages.length]);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;
      setUser(data.user);
    };
    checkUser();
  }, []);

  const handleJoinAsArtist = async () => {
    if (!user) {
      router.push("/login?redirect=/join-as-artist");
      return;
    }
    try {
      const { data: artist, error } = await supabase
        .from("Artists")
        .select("email_address")
        .eq("email_address", user.email)
        .single();
        
      if (error && error.code !== "PGRST116") {
        console.error("Error fetching artist data:", error);
      }
      
      if (artist) {
        router.push("/profile");
      } else {
        router.push("/join-as-artist");
      }
    } catch (err) {
      console.error("Error checking artist status:", err);
    }
  };

  // Animation variants
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  // Image animation variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  // Updated animation variants for smoother horizontal slide without gaps
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1
    })
  };

  // Auto-advance slideshow - slower transition speed
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // Increased from 4000ms to 6000ms for more natural pace
    
    return () => clearInterval(interval);
  }, [productImages.length]);

  // Track slide direction
  const [direction, setDirection] = useState(1);

  // Function to go to next slide
  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % productImages.length);
  };

  // Function to go to previous slide
  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="w-full font-poppins overflow-hidden">
      {/* Mobile Layout (default) */}
      <div className="lg:hidden flex flex-col items-center">
        {/* Hero Image Slideshow - updated to maintain 1:1 aspect ratio */}
        <motion.div 
          className="mt-14 relative w-full aspect-square max-w-md mx-auto overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          {/* Horizontal swipe area */}
          <div 
            className="absolute inset-0 z-20 cursor-pointer"
            onClick={() => handleProductClick(currentSlide)}
            onTouchStart={(e) => {
              const touchStart = e.touches[0].clientX;
              const handleTouchEnd = (e: TouchEvent) => {
                const touchEnd = e.changedTouches[0].clientX;
                if (touchEnd - touchStart > 50) {
                  prevSlide();
                } else if (touchStart - touchEnd > 50) {
                  nextSlide();
                }
                document.removeEventListener('touchend', handleTouchEnd);
              };
              document.addEventListener('touchend', handleTouchEnd);
            }}
          />
          
          <AnimatePresence initial={false} custom={direction} mode="sync">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ 
                x: { type: "spring", stiffness: 200, damping: 30 },
                opacity: { duration: 0 }
              }}
              className="absolute inset-0"
            >
              <div className="relative w-full h-full">
                <img
                  src={productImages[currentSlide]}
                  alt={`Featured Craft ${currentSlide + 1}`}
                  className="w-full h-full object-cover object-center shadow-xl"
                  loading={currentSlide === 0 ? "eager" : "lazy"}
                />
                {/* Enhanced gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Slideshow indicators - repositioned for better visibility */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(index > currentSlide ? 1 : -1);
                  setCurrentSlide(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-white w-5" : "bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Standard heading overlay on image */}
          <motion.div 
            className="absolute bottom-16 left-0 right-0 text-white z-5 px-6 text-center pointer-events-none"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold leading-tight text-shadow">
              Handmade Treasures, <br /> 
              <span className="text-red-100">Crafted with Love</span>
            </h1>
          </motion.div>
          
          {/* Featured tag */}
          <motion.div 
            className="absolute bottom-6 left-5 text-white z-5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="text-xs uppercase tracking-wider font-semibold bg-red-600/80 backdrop-blur-sm inline-block px-2 py-0.5 rounded-sm">
              Featured
            </div>
          </motion.div>
        </motion.div>

        {/* Authentic Indian Crafts tag for mobile - FIXED: moved outside absolute positioning */}
        <div className="relative h-0">
          <motion.div 
            className="absolute -bottom-8 -right-40 bg-white/90 backdrop-blur-sm w-20 h-20 rounded-full shadow-lg z-5 flex items-center justify-center border-2 border-red-100"
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            animate={{ opacity: 1, scale: 0.9, rotate: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            style={{ willChange: "transform, opacity" }}
          >
            <div className="text-center">
              <p className="text-red-600 text-[10px] font-bold leading-tight">VERIFIED</p>
              <div className="h-px w-10 bg-red-200 my-0.5 mx-auto"></div>
              <p className="text-red-600 text-[9px] font-medium leading-tight">ARTISTS &</p>
              <p className="text-red-600 text-[9px] font-medium leading-tight">CRAFTS</p>
            </div>
          </motion.div>
        </div>
        
        {/* Content section - adjusted spacing for better balance with square image */}
        <div className="w-full px-6 text-center mt-8 pb-8">
          <motion.p 
            className="text-base text-gray-700 max-w-md mx-auto leading-relaxed"
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUpVariants}
          >
            Discover unique handcrafted products made with passion by talented artists
          </motion.p>
          
          {/* Buttons with improved styling - using Lucide icon */}
          <motion.div 
            className="flex flex-col sm:flex-row sm:justify-center gap-3 mt-6 max-w-sm mx-auto"
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUpVariants}
          >
            <CustomButton
              title="Explore Crafts"
              btnType="button"
              containerStyles="w-full sm:w-auto px-6 py-3 text-base font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              handleClick={() => router.push("/products")}
              rightIcon={<ArrowRight className="w-4 h-4 ml-1 font-semibold" />}
            />
            <CustomButton
              title="Join as an Artist"
              btnType="button"
              containerStyles="flex-center w-full sm:w-auto px-6 py-3 text-base font-semibold border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
              handleClick={handleJoinAsArtist}
            />
          </motion.div>
          
          {/* Refined decorative element */}
          <motion.div 
            className="h-0.5 w-12 bg-gradient-to-r from-red-400 to-red-500 mx-auto my-5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          />
          
          <motion.p 
            className="text-sm text-gray-600 italic font-semibold"
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeUpVariants}
          >
            "Where crafts come alive"
          </motion.p>
        </div>
      </div>
      
      {/* Desktop Layout - enhanced with authentic Indian arts circular tag */}
      <div className="mt-24 hidden lg:flex min-h-[650px] items-center justify-center px-8 xl:px-16 py-16 max-w-7xl mx-auto">
        {/* Left Text Content */}
        <div className="w-1/2 pr-12">
          {/* Decorative element */}
          <motion.div 
            initial={{ width: 0, x: -80, y: -138 }}
            animate={{ width: 130, x: -80, y: -138 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-1 bg-red-500 mb-12 left-2 hidden lg:block"
          />
      
          <motion.h1
            className="text-5xl font-bold text-gray-900 leading-tight"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUpVariants}
          >
            Handmade Treasures, <br /> 
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Crafted with Love
            </span>
          </motion.h1>
      
          <motion.p
            className="text-xl text-gray-700 mt-6 max-w-xl"
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUpVariants}
          >
            Discover unique handcrafted products made with passion by talented artists across India.
          </motion.p>
      
          {/* Buttons */}
          <motion.div
            className="flex gap-4 mt-8 max-w-md"
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUpVariants}
          >
            <CustomButton
              title="Explore Crafts"
              btnType="button"
              containerStyles="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center"
              handleClick={() => router.push("/products")}
              rightIcon={<ArrowRight className="w-5 h-5 ml-2" />}
            />
            <CustomButton
              title="Join as an Artist"
              btnType="button"
              containerStyles="px-8 py-4 text-lg font-semibold border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all hover:scale-105"
              handleClick={handleJoinAsArtist}
            />
          </motion.div>
      
          <motion.p
            className="text-lg text-gray-500 italic mt-12 font-semibold"
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeUpVariants}
          >
            "Where crafts come alive"
          </motion.p>
        </div>
      
        {/* Right Image with slideshow */}
        <motion.div
          className="w-1/2 relative h-[500px] flex items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1, ease: "easeOut", delay: 0.3 },
            },
          }}
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
            {/* Clickable area */}
            <div 
              className="absolute inset-0 z-20 cursor-pointer"
              onClick={() => handleProductClick(currentSlide)}
            />
            
            <AnimatePresence initial={false} custom={direction} mode="sync">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ 
                  x: { type: "spring", stiffness: 200, damping: 30 },
                  opacity: { duration: 0 }
                }}
                className="absolute inset-0 bg-black"
              >
                <img
                  src={productImages[currentSlide]}
                  alt={`Featured Craft ${currentSlide + 1}`}
                  className="w-full h-full object-cover object-center"
                  loading={currentSlide === 0 ? "eager" : "lazy"}
                />
                {/* Enhanced gradient overlay with more depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              </motion.div>
            </AnimatePresence>
            
            
            {/* Slideshow indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-white w-5" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Floating badge - using Lucide icon */}
            <motion.div 
              className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg text-sm font-semibold text-red-600 border border-red-100 z-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5" />
                100% Handcrafted
              </div>
            </motion.div>
          </div>
        {/* Decorative floating elements */}
        <motion.div 
            className="absolute -bottom-6 -left-6 bg-red-50 w-28 h-28 rounded-full shadow-lg z-10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="text-center">
              <p className="text-red-600 font-bold">Verified</p>
              <p className="text-xs text-gray-600">Artists & Crafts</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <OurMission />
      <HowItWorks/>
    </div>
  );
};

export default Hero;
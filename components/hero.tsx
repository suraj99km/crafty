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
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Fetch product images for slideshow
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const { data, error } = await supabase
          .from('Products')
          .select('image_url')
          .not('image_url', 'is', null); // Fetch more images to have a larger pool
          
        if (error) {
          console.error('Error fetching product images:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Filter valid URLs
          const validImages = data
            .map(product => product.image_url)
            .filter(url => url && url.trim() !== '');
            
          if (validImages.length > 0) {
            // Select 5 random images from the pool
            const randomImages = getRandomImages(validImages, 5);
            setProductImages(randomImages);
          }
        }
      } catch (err) {
        console.error('Error in fetching product images:', err);
      }
    };
    
    // Helper function to get random images from array
    const getRandomImages = (images: string[], count: number) => {
      const shuffled = [...images].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, images.length));
    };
    
    fetchProductImages();
    
    // Set up interval to refresh the image selection periodically
    const refreshInterval = setInterval(() => {
      fetchProductImages();
    }, 60000); // Refresh image selection every minute
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productImages.length);
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

  return (
    <div className="w-full font-poppins overflow-hidden">
      {/* Mobile Layout (default) */}
      <div className="lg:hidden flex flex-col items-center">
        {/* Hero Image Slideshow - increased height to take approximately half the screen */}
        <motion.div 
          className="mt-14 relative w-full h-[40vh] min-h-[350px] max-h-[400px]"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <img
                src={productImages[currentSlide]}
                alt={`Featured Craft ${currentSlide + 1}`}
                className="w-full h-full object-cover object-center rounded-b-[2rem] shadow-xl"
                loading={currentSlide === 0 ? "eager" : "lazy"}
              />
              {/* Enhanced gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-b-[2rem]"></div>
            </motion.div>
          </AnimatePresence>
          
          {/* Slideshow indicators - repositioned for better visibility */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-white w-5" : "bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Repositioned badge with improved styling - using Lucide icon */}
          {/* <motion.div 
            className="absolute top-5 right-5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-xs font-medium text-red-600 border border-red-100 flex items-center z-5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <CheckCircle className="w-3 h-3 mr-1 text-red-500" />
            100% Handcrafted
          </motion.div> */}
          
          {/* Standard heading overlay on image */}
          <motion.div 
            className="absolute bottom-16 left-0 right-0 text-white z-10 px-6 text-center"
            initial={{ opacity: 0, y: 10 }}
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
            className="absolute bottom-6 left-5 text-white z-10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="text-xs uppercase tracking-wider font-semibold bg-red-600/80 backdrop-blur-sm inline-block px-2 py-0.5 rounded-sm">
              Featured
            </div>
          </motion.div>
        </motion.div>
        
        {/* Content section - streamlined for better mobile experience */}
        <div className="w-full px-6 text-center mt-6 pb-8">
          <motion.p 
            className="text-base text-gray-700 max-w-md mx-auto leading-relaxed"
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUpVariants}
          >
            Discover unique handcrafted products made with passion by talented artisans across India.
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
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
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
            className="text-sm text-gray-600 italic font-medium"
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeUpVariants}
          >
            "Where crafts come alive"
          </motion.p>
        </div>
      </div>
      
      {/* Desktop Layout - also update with slideshow */}
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
            Handmade Treasures, <br /> Crafted with Love
          </motion.h1>
      
          <motion.p
            className="text-xl text-gray-700 mt-6 max-w-xl"
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUpVariants}
          >
            Discover unique handcrafted products made with passion by talented artisans across India.
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
              containerStyles="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all flex items-center"
              handleClick={() => router.push("/products")}
              rightIcon={<ArrowRight className="w-5 h-5 ml-2" />}
            />
            <CustomButton
              title="Join as an Artist"
              btnType="button"
              containerStyles="px-8 py-4 text-lg font-semibold border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
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
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                <img
                  src={productImages[currentSlide]}
                  alt={`Featured Craft ${currentSlide + 1}`}
                  className="w-full h-full object-cover object-center"
                  loading={currentSlide === 0 ? "eager" : "lazy"}
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Enhanced subtle decorative element */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>
            
            {/* Slideshow indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-white w-5" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Floating badge - using Lucide icon */}
            <motion.div 
              className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg text-sm font-semibold text-red-600 border border-red-100 z-10"
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
            className="absolute -bottom-6 -left-6 bg-red-50 w-32 h-32 rounded-full shadow-lg z-10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="text-center">
              <p className="text-red-600 font-bold">Authentic</p>
              <p className="text-xs text-gray-600">Indian Crafts</p>
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
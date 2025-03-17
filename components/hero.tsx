"use client";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-db/supabaseClient";
import { User } from "@supabase/supabase-js";
import OurMission from "@/components/home/ourmission";
import HowItWorks from "@/components/home/howitworks";
import { motion } from "framer-motion";

const Hero = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
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
        {/* Hero Image */}
        <motion.div 
          className="mt-16 relative w-full h-[230px]"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <Image
            src="/hero.jpg"
            alt="Handmade Treasures"
            fill
            className="object-cover object-center rounded-b-3xl shadow-lg"
            priority
          />
          {/* Overlay gradient for better text visibility if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-b-3xl"></div>
        </motion.div>
        
        {/* Hero Content */}
        <div className="w-full px-6 text-center mt-8 pb-10">
          <motion.h1 
            className="text-3xl font-bold text-gray-900 leading-tight"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUpVariants}
          >
            Handmade Treasures, <br /> Crafted with Love
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-700 mt-4 max-w-md mx-auto"
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUpVariants}
          >
            Discover unique handcrafted products made with passion.
          </motion.p>
          
          {/* Buttons */}
          <motion.div 
            className="flex flex-col gap-4 mt-6 max-w-sm mx-auto"
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUpVariants}
          >
            <CustomButton
              title="Explore Crafts"
              btnType="button"
              containerStyles="w-full p-4 text-lg font-semibold bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all"
              handleClick={() => router.push("/products")}
            />
            <CustomButton
              title="Join as an Artist"
              btnType="button"
              containerStyles="w-full p-4 text-lg font-semibold border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
              handleClick={handleJoinAsArtist}
            />
          </motion.div>
          
          <motion.p 
            className="text-md text-gray-500 italic mt-8 font-semibold"
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeUpVariants}
          >
            "Every craft carries an Identity."
          </motion.p>
        </div>
      </div>
      
      {/* Desktop Layout */}
      <div className="mt-28 hidden lg:flex min-h-[600px] items-center px-8 xl:px-16 py-16 max-w-7xl mx-auto">
        {/* Left Text Content */}
        <div className="w-1/2 pr-8">

          {/* Decorative element */}
          <motion.div 
          initial={{ width: 0, x: -80, y: -160 }} // Start slightly right and lower
          animate={{ width: 135, x: -80, y: -160 }} // Move left and up while expanding
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
            Discover unique handcrafted products made with passion.
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
              containerStyles="px-8 py-4 text-lg font-semibold bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all"
              handleClick={() => router.push("/products")}
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
            "Every craft carries an Identity."
          </motion.p>
        </div>

        {/* Right Image */}
        <motion.div
          className="w-1/2 relative h-[500px]"
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
          <div className="absolute inset-0 -right-8 rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/hero.jpg"
              alt="Handmade Treasures"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Subtle decorative element */}
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </motion.div>
      </div>
      
      <OurMission />
      <HowItWorks/>
    </div>
  );
};

export default Hero;
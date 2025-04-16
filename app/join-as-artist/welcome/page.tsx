"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Palette, ShoppingBag, Users } from "lucide-react";

// Separate component for content that uses useSearchParams
function WelcomeContent() {
  const router = useRouter();
  const [artistName, setArtistName] = useState<string>("Artist");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the name from URL in a safe way
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get("name");
    
    if (nameFromUrl) {
      setArtistName(nameFromUrl);
      setIsLoading(false);
    } else {
      // Only redirect if we're sure there's no name parameter
      const timeoutId = setTimeout(() => {
        router.replace("/join-as-artist");
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative h-full flex flex-col items-center justify-center px-4 py-8">
      {/* Logo and Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <Image
            src="/logo-white.png"
            alt="CraftID Logo"
            width={180}
            height={140}
            className="mx-auto drop-shadow-lg mb-2"
          />
          <p className="text-white mb-12 italic">"Where crafts come alive"</p>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Welcome, {artistName}!
        </h1>
      </motion.div>

      {/* Feature Cards - Compact Version */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-4 w-full max-w-3xl mb-12"
      >
        {[
          { icon: <Palette className="w-6 h-6 text-white" />, text: "Showcase Art" },
          { icon: <ShoppingBag className="w-6 h-6 text-white" />, text: "Start Selling" },
          { icon: <Users className="w-6 h-6 text-white" />, text: "Join Community" }
        ].map((feature, index) => (
          <div 
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
          >
            <div className="bg-white/10 rounded-lg p-2 w-fit mx-auto mb-2">
              {feature.icon}
            </div>
            <p className="text-white text-sm font-medium">
              {feature.text}
            </p>
          </div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md"
      >
        <Button
          onClick={() => router.push("/profile")}
          className="w-full bg-white hover:bg-white/90 text-red-600 py-6 rounded-xl text-lg font-bold shadow-lg transition-all duration-200"
        >
          Start Your Creative Journey!
        </Button>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => router.push("/list-product")}
          className="w-full text-white/80 hover:text-white font-medium mt-4 py-2 transition-colors text-md"
        >
          List Your First Product →
        </motion.button>
      </motion.div>
    </div>
  );
}

// Loading component
function Loading() {
  return (
    <div className="h-screen bg-red-600 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Main component
export default function WelcomePage() {
  return (
    <div className="h-screen bg-red-600 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white opacity-5"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 rounded-full bg-white opacity-5"></div>
        <div className="absolute -bottom-32 -left-20 w-64 h-64 rounded-full bg-white opacity-5"></div>
      </div>

      <Suspense fallback={<Loading />}>
        <WelcomeContent />
      </Suspense>
    </div>
  );
}
"use client";

import { useState } from "react";
import supabase from "@/lib/supabase-db/supabaseClient";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import { toast } from "sonner";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function OAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  const signInWithProvider = async (provider: "google" | "linkedin" | "twitter") => {
    setLoading(provider);
  
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      },
    });
  
    if (error) {
      toast.error("Error signing you in. Please try again.");
    }
  
    setLoading(null);
  };
  
  return (
    <div className="space-y-4">
      {/* Google Sign-In */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          className="w-full flex items-center justify-center gap-3 p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 text-gray-700 font-medium"
          onClick={() => signInWithProvider("google")}
          disabled={loading === "google"}
          variant="outline"
        >
          <FaGoogle className="text-red-500 text-xl" />
          <span className="ml-2">
            {loading === "google" ? "Signing in..." : "Continue with Google"}
          </span>
        </Button>
      </motion.div>

      {/* LinkedIn Sign-In */}
      {/* <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          className="w-full flex items-center justify-center gap-3 p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 text-gray-700 font-medium"
          onClick={() => signInWithProvider("linkedin")}
          disabled={loading === "linkedin"}
          variant="outline"
        >
          <FaLinkedin className="text-blue-600 text-xl" />
          <span className="ml-2">
            {loading === "linkedin" ? "Signing in..." : "Continue with LinkedIn"}
          </span>
        </Button>
      </motion.div> */}

      {/* X.com (Twitter) Sign-In */}
      {/* <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Button
          className="w-full flex items-center justify-center gap-3 p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 text-gray-700 font-medium"
          onClick={() => signInWithProvider("twitter")}
          disabled={loading === "twitter"}
          variant="outline"
        >
          <FaXTwitter className="text-black text-xl" />
          <span className="ml-2">
            {loading === "twitter" ? "Signing in..." : "Continue with X"}
          </span>
        </Button>
      </motion.div> */}
    </div>
  );
}

"use client";

import { useState } from "react";
import supabase from "@/lib/supabase-db/supabaseClient";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import { toast } from "sonner";
import { FaXTwitter } from "react-icons/fa6"; // Import X.com (formerly Twitter) icon

export default function OAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  const signInWithProvider = async (provider: "google" | "linkedin" | "twitter") => {
    setLoading(provider);
  
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`, // Redirect to a secure server route
      },
    });
  
    if (error) {
      toast.error("Error signing you in. Please try again.");
    }
  
    setLoading(null);
  };
  
  return (
    <>
      {/* Google Sign-In */}
      <Button
        className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-xl bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-300"
        onClick={() => signInWithProvider("google")}
        disabled={loading === "google"}
      >
        <FaGoogle className="text-red-500 text-lg" />
        {loading === "google" ? "Signing in..." : "Sign in with Google"}
      </Button>

      {/* LinkedIn Sign-In */}
      {/* <Button
        className="mt-4 w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-xl bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-300"
        onClick={() => signInWithProvider("linkedin")}
        disabled={loading === "linkedin"}
      >
        <FaLinkedin className="text-blue-600 text-lg" />
        {loading === "linkedin" ? "Signing in..." : "Sign in with LinkedIn"}
      </Button> */}

      {/* X.com (Twitter) Sign-In */}
      {/* <Button
        className="mt-4 w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-xl bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-300"
        onClick={() => signInWithProvider("twitter")}
        disabled={loading === "twitter"}
      >
        <FaXTwitter className="text-black text-lg" />
        {loading === "twitter" ? "Signing in..." : "Sign in with X.com"}
      </Button> */}
    </>
  );
}

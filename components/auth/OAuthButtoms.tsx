"use client";

import { useState } from "react";
import supabase from "@/db/supabaseClient";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Import X.com (formerly Twitter) icon

export default function OAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  const signInWithProvider = async (provider: "google" | "linkedin" | "twitter") => {
    setLoading(provider);
  
    const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`;
    console.log(process.env.NEXT_PUBLIC_BASE_URL);
  
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
  
    if (error) {
      console.error("OAuth Error:", error);
      alert("Error signing in: " + error.message);
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
      <Button
        className="mt-4 w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-xl bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-300"
        onClick={() => signInWithProvider("linkedin")}
        disabled={loading === "linkedin"}
      >
        <FaLinkedin className="text-blue-600 text-lg" />
        {loading === "linkedin" ? "Signing in..." : "Sign in with LinkedIn"}
      </Button>

      {/* X.com (Twitter) Sign-In */}
      <Button
        className="mt-4 w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-xl bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-300"
        onClick={() => signInWithProvider("twitter")}
        disabled={loading === "twitter"}
      >
        <FaXTwitter className="text-black text-lg" />
        {loading === "twitter" ? "Signing in..." : "Sign in with X.com"}
      </Button>
    </>
  );
}

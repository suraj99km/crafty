"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-db/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdEmail } from "react-icons/md";
import { toast } from "sonner";

export default function EmailAuth() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/');
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Send Magic Link
  const sendLoginLink = async () => {
    setLoading(true);
    const toastId = toast.loading("Sending login link...");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { 
          emailRedirectTo: `${window.location.origin}/`,
          data: { timestamp: new Date().toISOString() }
        },
      });

      if (error) throw error;

      toast.success("Login link sent! Check your email.", {
        id: toastId
      });

      router.push("/");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
        id: toastId
      });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Email Input */}
      <Input
        type="email"
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Send Login Link Button */}
      <Button
        className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
        onClick={sendLoginLink}
        disabled={loading || !email.includes("@")}
      >
        <MdEmail className="text-white text-lg" /> {loading ? "Sending..." : "Get Login Link"}
      </Button>
    </div>
  );
}

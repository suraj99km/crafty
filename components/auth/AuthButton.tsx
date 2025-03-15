"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import supabase from "@/lib/supabase-db/supabaseClient";
import { toast } from "sonner";

export default function AuthButton() {
  const [user, setUser] = useState<{ firstName?: string } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData?.session) {
          console.warn("No active session found.");
          setUser(null);
          return;
        }

        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          console.warn("Error fetching user:", error);
          toast.error(error?.message || "User session not found.");
          setUser(null);
          return;
        }

        const fullName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.display_name ||
          data.user.user_metadata?.name ||
          "User";

        setUser({ firstName: fullName.split(" ")[0] });
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Failed to fetch user data.");
      }
    };

    getUser();

    // Listen for authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (session) getUser();
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return user ? (
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-200">
        <User size={20} className="text-gray-700" />
        <span className="font-semibold">Hi, {user.firstName}!</span>
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-200"
    >
      <User size={20} className="text-gray-700" />
      <span className="font-semibold">Sign In / Login</span>
    </Link>
  );
}
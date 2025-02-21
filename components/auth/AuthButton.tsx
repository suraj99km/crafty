"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import supabase from "@/db/supabaseClient";

export default function AuthButton() {
  const [user, setUser] = useState<{ firstName?: string } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUser(null);
        return;
      }

      const fullName =
        data.user.user_metadata?.full_name ||
        data.user.user_metadata?.display_name ||
        data.user.user_metadata?.name ||
        "User";

      const firstName = fullName.split(" ")[0];
      setUser({ firstName });
    };

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null); // Clear user state on logout
      } else {
        getUser(); // Fetch user if signed in
      }
    });

    getUser();

    return () => {
      listener?.subscription.unsubscribe(); // Cleanup listener
    };
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

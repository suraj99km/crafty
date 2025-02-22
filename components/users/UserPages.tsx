"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import supabase from "@/db/supabaseClient";

const artistPages = [
  { name: "List a Product", path: "/list-product" },
  { name: "Product Listings", path: "/product-listings" },
  { name: "Track Your Sales", path: "/track-sales" },
  { name: "Get Help", path: "/user-help" },
];

const userPages = [
  { name: "Orders", path: "/orders" },
  { name: "Saved Addresses", path: "/addresses" },
  { name: "Get Help", path: "/artist-help" },
];

export default function UserPages({ onClick }: { onClick?: () => void }) {
  const [user, setUser] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;

      setUser(true);

      // Fetch user data from Supabase to get the `is_artist` field
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("is_artist")
        .eq("id", data.user.id)
        .single();

      if (!userError) {
        setIsArtist(userData?.is_artist === 1);
      }
    };

    checkUser();
  }, []);

  const handleJoinAsArtist = async () => {
    if (user) {
      router.push("/join-as-artist");
    } else {
      router.push("/login?redirect=/join-as-artist");
    }
    onClick?.(); // Close sidebar after clicking
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      window.location.href = "/"; // Refresh & redirect to home
    }
  };

  return (
    <div className="mt-4 w-full">
      {/* Join as Artist Button */}
      {!isArtist && (
        <button
          onClick={handleJoinAsArtist}
          className="block text-lg text-white hover:text-gray-200 transition duration-200 text-center py-3 w-full"
        >
          Join as Artist
        </button>
      )}

      {/* Show different menus for users and artists */}
      {(user ? (isArtist ? artistPages : userPages) : []).map((page) => (
        <Link
          key={page.path}
          href={page.path}
          className="block text-lg text-white hover:text-gray-200 transition duration-200 text-center py-3"
          onClick={onClick} // Close sidebar on clicking any page
        >
          {page.name}
        </Link>
      ))}

      {/* Logout Button */}
      {user && (
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center justify-center gap-2 w-full text-white py-2 transition duration-200 hover:text-gray-200"
        >
          <LogOut size={20} className="text-white" />
          <span className="font-medium">Logout</span>
        </button>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShoppingCart, Users, Package, HelpCircle, List } from "lucide-react";
import supabase from "@/lib/supabase-db/supabaseClient";

const userPages = [
  { name: "Shopping Cart", path: "/cart", icon: <ShoppingCart size={18} /> },
  { name: "Orders Tracking", path: "/orders", icon: <Package size={18} /> },
  { name: "Saved Addresses", path: "/addresses", icon: <List size={18} /> },
];

const profilePages = [
  { name: "Refer a Friend", path: "/refer-friend", icon: <Users size={18} /> },
  { name: "Get Help", path: "/artist-help", icon: <HelpCircle size={18} /> },
];

const artistPages = [
  { name: "List a Product", path: "/list-product", icon: <List size={18} /> },
  { name: "Product Listings", path: "/product-listings", icon: <List size={18} /> },
  { name: "Track Your Sales", path: "/track-sales", icon: <Package size={18} /> },
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
    router.push(user ? "/join-as-artist" : "/login?redirect=/join-as-artist");
    onClick?.();
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4 py-2 text-white">

      {/* Join as Artist Button */}
      {!isArtist && (
        <button
          onClick={handleJoinAsArtist}
          className="w-full flex items-center justify-center gap-2 text-lg font-semibold bg-white text-red-500 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
        >
          <Users size={20} className="text-red-500" />
          Join as Artist
        </button>
      )}


      {/* User Shopping Section */}
      {!isArtist && user && (
        
        <div className="w-full px-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Shopping & Orders</h3>
          <div className="flex flex-col mt-2 space-y-2">
            {userPages.map((page) => (
              <Link key={page.path} href={page.path} className="flex items-center gap-2 text-lg hover:text-gray-200 transition duration-200 py-2" onClick={onClick}>
                {page.icon}
                {page.name}
              </Link>
            ))}
          </div>
        </div>
      )}

        {/* User Profile Section */}
        <div className="w-full px-4">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Profile</h3>
        <div className="flex flex-col mt-2 space-y-2">
          {profilePages.map((page) => (
            <Link key={page.path} href={page.path} className="flex items-center gap-2 text-lg hover:text-gray-200 transition duration-200 py-2" onClick={onClick}>
              {page.icon}
              {page.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Artist Dashboard Section */}
      {isArtist && (
        <div className="w-full px-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Artist Dashboard</h3>
          <div className="flex flex-col mt-2 space-y-2">
            {artistPages.map((page) => (
              <Link key={page.path} href={page.path} className="flex items-center gap-2 text-lg hover:text-gray-200 transition duration-200 py-2" onClick={onClick}>
                {page.icon}
                {page.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Logout Button */}
      {user && (
        <div className="w-full px-4 border-t border-white mt-2 pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-lg py-3 transition duration-200 hover:text-gray-200"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}



"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShoppingCart, Users, Package, HelpCircle, List } from "lucide-react";
import supabase from "@/lib/supabase-db/supabaseClient";

const userPages = [
  { name: "Shopping Cart", path: "/cart", icon: <ShoppingCart size={20} /> },
  { name: "Orders Tracking", path: "/orders", icon: <Package size={20} /> },
  { name: "Saved Addresses", path: "/addresses", icon: <List size={20} /> },
];

const profilePages = [
  { name: "Refer a Friend", path: "/refer-friend", icon: <Users size={20} /> },
  { name: "Get Help", path: "/artist-help", icon: <HelpCircle size={20} /> },
];

const artistPages = [
  { name: "List a Product", path: "/list-product", icon: <List size={20} /> },
  { name: "Product Listings", path: "/product-listings", icon: <List size={20} /> },
  { name: "Track Your Sales", path: "/track-sales", icon: <Package size={20} /> },
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
    <div className="w-full h-full flex flex-col justify-between text-white">
      <div className="flex flex-col space-y-4 py-2">

        {/* Join as Artist Button */}
        {!isArtist && (
          <button
            onClick={handleJoinAsArtist}
            className="w-full flex items-center justify-center gap-2 text-base font-semibold bg-white text-red-500 px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            <Users size={22} className="text-red-500" />
            Join as Artist
          </button>
        )}

        {/* User Shopping Section */}
        {!isArtist && user && (
          <div className="w-full px-4">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Shopping & Orders</h3>
            <div className="flex flex-col mt-2 space-y-2">
              {userPages.map((page) => (
                <Link key={page.path} href={page.path} className="flex items-center gap-2 text-base hover:text-gray-200 transition py-2" onClick={onClick}>
                  {page.icon}
                  {page.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="w-full px-4">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Profile</h3>
          <div className="flex flex-col mt-2 space-y-2">
            {profilePages.map((page) => (
              <Link key={page.path} href={page.path} className="flex items-center gap-2 text-base hover:text-gray-200 transition py-2" onClick={onClick}>
                {page.icon}
                {page.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Artist Dashboard Section */}
        {isArtist && (
          <div className="w-full px-4">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Artist Dashboard</h3>
            <div className="flex flex-col mt-2 space-y-2">
              {artistPages.map((page) => (
                <Link key={page.path} href={page.path} className="flex items-center gap-2 text-base hover:text-gray-200 transition py-2" onClick={onClick}>
                  {page.icon}
                  {page.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Logout Button (Always at Bottom) */}
      {user && (
        <div className="w-full px-4 border-t border-white pt-3 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-base font-medium text-gray-200 hover:text-white transition py-3"
          >
            <LogOut size={22}/>
            Logout
          </button>
        </div>
      )}

    </div>
  );
}

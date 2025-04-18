"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShoppingCart, Users, User, Package, Truck, HelpCircle, LocateFixed , ClipboardPenLine, ArrowLeftRight, ChartNoAxesCombined, MapPinned, Paintbrush, ShoppingBag} from "lucide-react";
import supabase from "@/lib/supabase-db/supabaseClient";

const userPages = [
  { name: "Shopping Cart", path: "/cart", icon: <ShoppingCart size={20} /> },
  { name: "Orders Tracking", path: "/orders", icon: <Truck size={20} /> },
  { name: "Saved Addresses", path: "/addresses", icon: <MapPinned size={20} /> },
];

const profilePages = [
  { name: "Refer a Friend", path: "/refer-friend", icon: <Users size={20} /> },
  { name: "Get Help", path: "/artist-help", icon: <HelpCircle size={20} /> },
];

const artistPages = [
  { name: "Profile", path: "/profile", icon: <User size={20} /> },
  { name: "List a Product", path: "/list-product", icon: <ClipboardPenLine size={20} /> },
  { name: "Product Listings", path: "/product-listings", icon: <Package size={20} /> },
  { name: "Order Status", path: "/order-status", icon: <LocateFixed  size={20} /> },
  { name: "Track Your Sales", path: "/track-sales", icon: <ChartNoAxesCombined size={20} /> },
];

export default function UserPages({ onClick }: { onClick?: () => void }) {
  const [user, setUser] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [mode, setMode] = useState<"user" | "artist">("user");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;

      setUser(true);

      const { data: artistData, error: artistError } = await supabase
        .from("Artists")
        .select("id")
        .eq("email_address", data.user.email)
        .single();

      if (!artistError && artistData) {
        setIsArtist(true);
        // Load stored mode or default to "artist"
        const storedMode = localStorage.getItem("profileMode");
        setMode(storedMode === "user" ? "user" : "artist");
      } else {
        setIsArtist(false);
        setMode("user");
      }
    };

    checkUser();
  }, []);

  const handleJoinAsArtist = async () => {
    router.push(user ? "/join-as-artist" : "/login?redirect=/join-as-artist");
    onClick?.();
  };

  const handleToggleMode = () => {
    const newMode = mode === "user" ? "artist" : "user";
    setMode(newMode);
    localStorage.setItem("profileMode", newMode);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      sessionStorage.clear();
      localStorage.removeItem("profileMode");
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

      {isArtist && (
        <button
          onClick={handleToggleMode}
          className="w-full flex items-center justify-center gap-2 text-base font-semibold bg-white text-red-500 border-2 border-red-500 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <ArrowLeftRight size={22} className="text-red-500" />
          {mode === "user" ? "Switch to Artist" : "Switch to User"}
        </button>
      )}


        {/* User Shopping Section */}
        {mode === "user" && user && (
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

        {/* Artist Dashboard Section */}
        {mode === "artist" && isArtist && (
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
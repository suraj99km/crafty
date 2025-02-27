"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Home, Store, Users } from "lucide-react";
import AuthButton from "./auth/AuthButton";
import UserPages from "./users/UserPages";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-10 transition-all duration-300 ${
        isScrolled ? "py-1 shadow-md bg-white" : "py-4 bg-white"
      }`}
    >
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center px-6 sm:px-16 transition-all duration-300">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={30}
            className={`object-contain transition-all duration-300 ${
              isScrolled ? "w-28" : "w-44"
            }`}
          />
        </Link>

        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-full bg-red-500 text-white transition-all duration-300 hover:bg-red-600 ${
            isScrolled ? "scale-75" : "scale-100"
          }`}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={` fixed top-0 right-0 w-[260px] h-full bg-red-500 text-white transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col justify-between`}
      >
        {/* Header */}
        <div className="ml-4 flex justify-between items-center p-3 border-b border-white/20">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={toggleSidebar} className="text-white">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="ml-2 overflow-y-auto flex-grow p-3 space-y-3 scrollbar-hide">
          {/* Auth Button */}
          <div className="flex justify-start w-full">
            <AuthButton />
          </div>

          {/* Navigation */}
          <div className="border-t border-white/20 pt-3">
            <p className="text-xs uppercase opacity-75">Explore</p>
            <Link href="/" className="flex items-center gap-2 py-2 text-base hover:text-gray-200" onClick={toggleSidebar}>
              <Home size={18} />
              Home
            </Link>
            <Link href="/products" className="flex items-center gap-2 py-2 text-base hover:text-gray-200" onClick={toggleSidebar}>
              <Store size={18} />
              Products
            </Link>
            <Link href="/artists" className="flex items-center gap-2 py-2 text-base hover:text-gray-200" onClick={toggleSidebar}>
              <Users size={18} />
              Artists
            </Link>
          </div>

          {/* User Pages */}
          <div className="border-t border-white/20 pt-3">
            <UserPages onClick={toggleSidebar} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`${
        isScrolled ? "py-2" : "py-4"
      } xl:absolute w-full z-10 fixed top-0 left-0 xl:bg-transparent bg-white shadow-sm transition-all duration-300`}
    >
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 transition-all duration-300">
        <Link href="/" className="flex justify-center items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={30}
            className={`object-contain transition-all duration-300 ${
              isScrolled ? "w-32" : "w-44"
            }`}
          />
        </Link>

        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`p-2 px-4 bg-red-500 text-red-500 font-bold text-3xl rounded-lg bg-transparent lg:text-white transition-all duration-300 ${
            isScrolled ? "text-sm" : "text-3xl"
          }`}
        >
          &#9776; {/* This is the hamburger icon */}
        </button>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-[250px] h-full bg-red-500 text-white transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleSidebar} className="text-white text-2xl">
            &times; {/* This is the close icon */}
          </button>
        </div>
        <div className="flex flex-col items-center space-y-6 pt-10">
          <Link
            href="/"
            className="text-lg text-white hover:text-gray-200 transition duration-200"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-lg text-white hover:text-gray-200 transition duration-200"
          >
            Products
          </Link>
          <Link
            href="/artists"
            className="text-lg text-white hover:text-gray-200 transition duration-200"
          >
            Artists
          </Link>
          <Link
            href="/join-artist"
            className="text-lg text-white hover:text-gray-200 transition duration-200"
          >
            Join as Artist
          </Link>
          <Link
            href="/login"
            className="text-lg text-white hover:text-gray-200 transition duration-200"
          >
            Sign In / Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

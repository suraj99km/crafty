"use client";

import { Card } from "@/components/ui/card";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import PhoneAuth from "@/components/login/PhoneAuth";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-500 to-red-600 p-6">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/logo-white.png" // Replace with your CraftID logo path
          alt="CraftID Logo"
          width={180}
          height={160}
          className="mx-auto"
        />
      </div>

      {/* Tagline */}
      <p className="text-white text-md font-semibold mb-6 tracking-wide">
        "Every craft has an identity."
      </p>

      {/* Login Card */}
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white">
        <h4 className="text-center text-2xl font-extrabold text-gray-800 mb-6">
          Sign in to <span className="text-red-500">CraftID.in</span>
        </h4>

        {/* Phone Authentication */}
        <PhoneAuth />

        {/* Divider */}
        <div className="relative my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign-In */}
        <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-xl bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-300">
          <FaGoogle className="text-red-500 text-lg" />
          <span className="font-semibold text-gray-700">Sign in with Google</span>
        </button>

        {/* LinkedIn Sign-In */}
        <button className="mt-4 w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-xl bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-300">
          <FaLinkedin className="text-blue-600 text-lg" />
          <span className="font-semibold text-gray-700">Sign in with LinkedIn</span>
        </button>

        {/* Email Sign-In */}
        <button className="w-full mt-4 p-3 border border-gray-300 rounded-xl bg-gray-200 hover:bg-gray-300 shadow-md hover:shadow-lg transition duration-300 font-semibold">
          Sign in with Email
        </button>
      </Card>
    </div>
  );
}

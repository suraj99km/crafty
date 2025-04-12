"use client";

import { Card } from "@/components/ui/card";
import OAuthButtons from "@/components/auth/OAuthButtons";
import EmailAuth from "@/components/auth/EmailAuth";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <motion.div
      className="flex items-center flex-col justify-center min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white opacity-10"></div>
        <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-white opacity-5"></div>
        <div className="absolute bottom-20 -left-10 w-48 h-48 rounded-full bg-white opacity-5"></div>
      </div>

      {/* Logo with animation */}
      <motion.div 
        className="mb-4 relative z-10"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Image
          src="/logo-white.png"
          alt="CraftID Logo"
          width={180}
          height={160}
          className="mx-auto drop-shadow-lg"
        />
      </motion.div>

      {/* Tagline with animation */}
      <motion.p 
        className="text-white text-lg font-medium mb-8 tracking-wide italic relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        "Where crafts come alive"
      </motion.p>

      {/* Login Card with animation */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="p-8 rounded-3xl shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20">
          <h4 className="text-center text-2xl font-extrabold text-gray-800 mb-8">
            Sign in to <span className="text-red-500">CraftID.in</span>
          </h4>

          {/* OAuth Buttons */}
          <OAuthButtons />

          {/* Divider */}
          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Email Authentication */}
          <EmailAuth />

          {/* Terms & Conditions Clause */}
          <p className="mt-6 text-xs text-gray-600 text-center">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-red-500 hover:underline font-medium">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-red-500 hover:underline font-medium">
              Privacy Policy
            </Link>
            .
          </p>
        </Card>
      </motion.div>
      
      {/* Help with login */}
      <motion.div 
        className="mt-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Link href="/help" className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white font-medium text-sm">Trouble logging in?</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
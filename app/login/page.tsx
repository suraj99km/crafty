"use client";

import { Card } from "@/components/ui/card";
import OAuthButtons from "@/components/auth/OAuthButtoms";
import EmailAuth from "@/components/auth/EmailAuth";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-500 to-red-600 p-6">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/logo-white.png"
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
        <p className="mt-4 text-xs text-gray-600 text-center">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-red-500 hover:underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-red-500 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-db/supabaseClient";
import { User } from "@supabase/supabase-js"; // Import the User type

const Hero = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // ✅ Fix: Explicitly set the type

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;
      setUser(data.user); // ✅ No more TypeScript errors
    };
    checkUser();
  }, []);

  const handleJoinAsArtist = async () => {
    if (!user) {
      router.push("/login?redirect=/join-as-artist"); // Redirect if not logged in
      return;
    }

    try {
      const { data: artist, error } = await supabase
        .from("Artists")
        .select("email_address")
        .eq("email_address", user.email) // ✅ user.email is now safe
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching artist data:", error);
      }

      if (artist) {
        router.push("/profile"); // If user is an artist, redirect to profile
      } else {
        router.push("/join-as-artist"); // Otherwise, go to onboarding
      }
    } catch (err) {
      console.error("Error checking artist status:", err);
    }
  };

  return (
    <div className="w-full min-h-[775px] flex flex-col items-center font-poppins">
      {/* Hero Image */}
      <div className="mt-16 relative w-full h-[250px]">
        <Image
          src="/hero.jpg"
          alt="Handmade Treasures"
          fill
          className="object-cover object-center rounded-b-3xl"
        />
      </div>

      {/* Hero Content */}
      <div className="w-full px-6 text-center mt-5 pb-10">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          Handmade Treasures, <br /> Crafted with Love
        </h1>
        <p className="text-lg text-gray-700 mt-2">
          Discover unique handcrafted products made with passion.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <CustomButton
            title="Explore Crafts"
            btnType="button"
            containerStyles="w-full p-3 text-lg font-semibold bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all"
            handleClick={() => router.push("/products")}
          />
          <CustomButton
            title="Join as an Artist"
            btnType="button"
            containerStyles="w-full p-3 text-lg font-semibold border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
            handleClick={handleJoinAsArtist}
          />
        </div>

        <p className="text-md text-gray-500 italic mt-6 font-semibold">
          "Every craft carries an Identity."
        </p>
      </div>

      <div className="flex-1 pt-10 pb-16 padding-x bg-gray-100">
          <h1 className="text-3xl font-bold mt-5 sm:mt-0">Our Mission</h1>
          <p className="hero__mission">
            At <span className="text-white bg-red-500 rounded-lg p-1 font-bold">CraftID.in</span>,  
            we believe <span className="text-red-500 font-extrabold">every artist deserves a stage.</span>
          </p>

          <blockquote className="border-l-4 border-red-500 italic text-gray-700 pl-4 mt-4">
            "Every product at CraftID carries a story—  
            a story of passion, dedication, and craftsmanship."
          </blockquote>

          <p className="hero__mission">
            We empower artists to <span className="font-bold text-blue-500">showcase their work</span>,  
            build their profiles, and expand their reach, ensuring they receive the  
            <span className="text-red-500 font-bold"> recognition</span> they deserve.
          </p>

          <p className="hero__mission">
            Our platform is more than just transactions—it's about  
            <span className="text-gray-900 font-semibold"> meaningful connections </span>  
            between artists and buyers.
          </p>

          <p className="hero__mission">
            <span className="text-xl font-bold text-gray-900">Join us in celebrating creativity!</span>
          </p>

          <div className="text-center mt-6">
            <a
              href="/products"
              className="inline-block font-bold px-6 py-3 text-white bg-red-500 rounded-lg shadow-md transition-all duration-300 hover:bg-red-700 hover:shadow-lg active:scale-95"
            >
              Explore Unique Crafts ➜
            </a>
          </div>
        </div>
    </div>
  );
};

export default Hero;
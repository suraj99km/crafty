"use client";

import React, { useEffect, useState } from 'react';
import CustomButton from './CustomButton';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import supabase from "@/db/supabaseClient";

const Hero = () => {
    const router = useRouter();
    const [user, setUser] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) return;
            setUser(true);
        };
        checkUser();
    }, []);

    const handleJoinAsArtist = () => {
        if (user) {
            router.push("/join-as-artist");
        } else {
            router.push("/signin?redirect=/join-as-artist");
        }
    };

  return (
    <div>
      <div className='hero'>
        <div className="flex-1 pt-20 xl:pt-36 padding-x">
          <h1 className="hero__title mt-5">
            Handmade Treasures, crafted with love
            <span className="inline-flex items-center">
              <img src="/love.png" alt="Your Image" className="h-[0.8em] ml-3 -mb-2" />
            </span>
          </h1>
          <p className="hero__subtitle">
            Discover handcrafted products made with heart and passion.
          </p>
          <div className="inline-flex gap-3 sm:gap-5 flex-wrap mt-8 mb-5 text-[14px] 2xl:text-[18px]">
            <CustomButton 
              title="Explore crafts"
              btnType='button'
              containerStyles="hover:bg-red-400 p-3 px-6 rounded-full font-medium transition-all duration-200 ease-in-out bg-red-500 text-white lg:text-lg lg:px-8"
              handleClick={() => router.push('/products')}
            />
            <CustomButton
              title="Join as an Artist"
              btnType='button'
              containerStyles="hover:bg-red-500 hover:text-white transition-all duration-200 ease-in-out text-red-500 font-medium rounded-full bg-transparent border-red-500 border lg:text-lg lg:px-8"
              handleClick={handleJoinAsArtist}
            />
          </div>
        </div>

        <div className="hero__image-container">
          <div className="hero__image overflow-hidden relative 2xl:h-[1500px] h-[500px]">
            <Image src="/hero.jpg" alt="hero" fill className="object-cover object-center" />
          </div>
        </div>
      </div>

      <div className="hero">
        <div className="xl:flex-[0.895] flex justify-end items-end w-full xl:h-auto hidden xl:block">
          <div className="relative xl:w-full w-[100%] xl:h-full h-[300px] z-0 overflow-hidden">
            <Image src="/mission_hero.png" alt="hero" fill className="object-cover object-center" />
          </div>
        </div>

        <div className="flex-1 pt-10 pb-10 padding-x">
          <h1 className="hero__title2 mt-5 sm:mt-0">Our Mission</h1>
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
    </div>
  );
}

export default Hero;

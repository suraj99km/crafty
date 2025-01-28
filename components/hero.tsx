"use client";

import React from 'react';
import CustomButton from './CustomButton';
import Image from "next/image";
import { useRouter } from 'next/navigation';

const Hero = () => {

    const router = useRouter(); // Initialize the router

    const handleScroll = () => {
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
            handleClick={() => {
                // Redirect to /products when the button is clicked
                router.push('/products');
        }}
            />
            <CustomButton
            title="Join as an Artist"
            btnType='button'
            containerStyles="hover:bg-red-500 hover:text-white transition-all duration-200 ease-in-out text-red-500 font-medium rounded-full bg-transparent border-red-500 border lg:text-lg lg:px-8"
            handleClick={handleScroll}
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
        <h1 className="hero__title2 mt-5 sm:mt-0">
        Our Mission
        </h1>
        <p className="hero__mission">
        At CraftID.in, our mission is to provide artists with a platform to express their creativity while offering a built-in marketplace for customers to discover and buy their unique crafts. We foster an environment of trust, authenticity, and passion for art, where each creation is celebrated and valued.
        </p>
        <p className="hero__mission">
        We empower artists to showcase their work, build their profiles, and expand their reach, ensuring they receive the recognition and fair credit they deserve for their craftsmanship. Our platform helps connect artists and buyers in meaningful ways, creating lasting relationships beyond mere transactions.
        </p>
        <p className="hero__mission">
        At CraftID.in, we proudly celebrate the stories of the artists and their extraordinary talent. Join us in showing them the love and recognition they truly deserve."
        </p>
        </div>
    </div>
    </div>

  )
}

export default Hero

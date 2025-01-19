"use client";

import React from 'react';
import CustomButton from './CustomButton';
import Image from "next/image";

const Hero = () => {

    const handleScroll = () => {

    }

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
            containerStyles="bg-red-500 text-white rounded-full"
            handleClick={handleScroll}
            />
            <CustomButton
            title="Join as an Artist"
            btnType='button'
            containerStyles="hover:bg-red-500 hover:text-white transition-all duration-200 ease-in-out text-red-500 font-medium rounded-full bg-transparent border-red-500 border "
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
        "At The Crafty Indians, our mission is to connect talented artists with people who cherish creative art and handicrafts. We’re more than just a marketplace—we’re a community that celebrates craftsmanship and ensures artists receive fair credit for their work.
        </p>
        <p className="hero__mission">
            Our platform empowers artists to showcase their creations, build their profiles, and expand their reach. By providing this supportive space, we enable meaningful connections between artists and buyers, fostering relationships that go beyond transactions.
        </p>
        <p className="hero__mission">
        We take pride in celebrating The Crafty Indians and their incredible stories. Come, let’s show them the love and recognition they truly deserve!"
        </p>
        </div>
    </div>
    </div>

  )
}

export default Hero

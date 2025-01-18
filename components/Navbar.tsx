"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import CustomButton from './CustomButton'


const Navbar = () => {
  return (

    <header className="w-full absolute z-10">
        <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
            <Link href="/" className="flex justify-center items-center">
                <Image src="/logo.png" alt="Car Hub Logo" width={250} height={40} className="object-contain" />
            </Link>

            <CustomButton
                title="Sign In"
                btnType="button"
                // handleClick={() => handleLoginWithOAuth("google")}
                containerStyles='text-red-500 font-semibold min w-[130px] xl:text-white sm:text-red-500 md:text-red-500'
            />
        </nav>
    </header>
  )
}

export default Navbar

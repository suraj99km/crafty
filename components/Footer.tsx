import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { footerLinks } from '@/constants'
import { Space } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="flex flex-col text-black-100 mt-5 border-t border-gray-100">
        <div className="flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10">
            <div className="flex flex-col justify-start items-start gap-6">
                <Image src="/logo.png" alt="CraftID" width={200} height={18} className="object-contain" />
                <p className="text-base text-gray-700">
                    CraftID.in 2025 <br />
                    All rights reserved &copy;
                </p>
            </div>

        </div>
    </footer>
  )
}

export default Footer

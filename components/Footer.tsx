import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Mail} from 'lucide-react'

const Footer = () => {
  return (
    <footer className="flex flex-col bg-gray-100 text-gray-800 mt-5 border-t border-gray-300">
      <div className="flex flex-wrap justify-between gap-10 sm:px-16 px-6 py-10 max-w-7xl mx-auto">

        {/* Right Section - Subscribe to Newsletter */}
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <h3 className="font-semibold text-lg text-gray-900">Subscribe for Updates</h3>
          <p className="text-sm text-gray-600">Get the latest updates on new arrivals and exclusive offers.</p>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2 shadow-sm">
            <Mail className="text-gray-500 w-5 h-5" />
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 outline-none bg-transparent text-sm text-gray-800"
            />
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all">
              Subscribe
            </button>
          </div>
        </div>
        {/* Left Section - Logo & Info */}
        <div className="flex flex-col justify-start gap-4">
          <Image src="/logo.png" alt="CraftID" width={200} height={50} className="object-contain" />
          <p className="text-sm text-gray-600">
            CraftID.in 2025 <br />
            All rights reserved &copy;
          </p>

          <div className="flex gap-4 mt-2">
          <Link href="https://facebook.com" target="_blank">
            <Facebook className="w-6 h-6 text-gray-700 hover:text-red-500 transition-all" />
          </Link>
          <Link href="https://instagram.com" target="_blank">
            <Instagram className="w-6 h-6 text-gray-700 hover:text-red-500 transition-all" />
          </Link>
          <Link href="https://x.com" target="_blank">
            <Twitter className="w-6 h-6 text-gray-700 hover:text-red-500 transition-all" />
          </Link>
          <Link href="https://linkedin.com" target="_blank">
            <Linkedin className="w-6 h-6 text-gray-700 hover:text-red-500 transition-all" />
          </Link>
        </div>
        </div>

        {/* Middle Section - Policy Links */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-lg text-gray-900">Quick Links</h3>
          <Link href="/shipping-policy" className="text-sm hover:text-red-500 transition-all">Shipping Policy</Link>
          <Link href="/refund-policy" className="text-sm hover:text-red-500 transition-all">Refund Policy</Link>
          <Link href="/privacy-policy" className="text-sm hover:text-red-500 transition-all">Privacy Policy</Link>
          <Link href="/terms-of-service" className="text-sm hover:text-red-500 transition-all">Terms of Service</Link>
          <Link href="/get-help" className="text-sm hover:text-red-500 transition-all">Get Help</Link>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-sm font-semibold text-gray-600 py-4 border-t border-gray-300">
        Made with ❤️ by CraftID.in
      </div>
    </footer>
  );
};

export default Footer;

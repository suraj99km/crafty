"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Correct useRouter for App Router
import { Artist, Product } from "@/Types";

type Props = {
  artist: Artist;
  relatedProducts: Product[];
};

const ArtistDetails: React.FC<Props> = ({ artist, relatedProducts }) => {
  const router = useRouter();

  return (
    <section className="max-w-6xl mx-auto mt-20 p-6">
      {/* Back Button */}
      {/* <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
      >
        ← Back
      </button> */}

      {/* Artist Profile Section */}
      <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="w-full md:w-1/3">
          <img
            src={artist.profile_picture}
            alt={artist.name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="w-full md:w-2/3 p-6">
          <h1 className="text-4xl font-bold text-gray-800">{artist.name}</h1>
          <p className="text-md text-gray-600 mt-2">
            {artist.bio || "No biography available."}
          </p>

{/* Social Links */}
<div className="mt-4 flex gap-4">
  {artist.instagram && (
    <a href={artist.instagram} target="_blank" rel="noopener noreferrer" className="text-red-500 font-medium hover:underline">
      Instagram
    </a>
  )}
  {artist.portfolio && (
    <a href={artist.portfolio} target="_blank" rel="noopener noreferrer" className="text-red-500 font-medium hover:underline">
      Portfolio
    </a>
  )}
  {artist.other_social && (
    <a href={artist.other_social} target="_blank" rel="noopener noreferrer" className="text-red-500 font-medium hover:underline">
      Other
    </a>
  )}
</div>

        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Crafted Products</h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
          {relatedProducts.length === 0 ? (
            <p className="text-center text-gray-600">No crafted products found.</p>
          ) : (
            relatedProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} passHref>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-95 duration-300 transition-transform cursor-pointer">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-[250px] object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-gray-800 text-lg">{product.title}</h2>
                    <p className="text-gray-900 text-sm font-semibold mt-2">₹ {product.price}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Crafted by <span className="font-bold text-red-500">{artist.name}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ArtistDetails;

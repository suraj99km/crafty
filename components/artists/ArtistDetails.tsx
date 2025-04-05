"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Artist, Product } from "@/Types";
import { Instagram, Globe, ExternalLink, User, BookOpen, MapPin } from "lucide-react";

type Props = {
  artist: Artist;
  relatedProducts: Product[];
};

const ArtistDetails: React.FC<Props> = ({ artist, relatedProducts }) => {
  const router = useRouter();

  return (
    <section className="max-w-6xl mx-auto mt-14 p-6">
      {/* Artist Profile Section */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        {/* Header with subtle background */}
        <div className="bg-gradient-to-r from-red-50 to-gray-50 p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Profile Image - Smaller and secondary */}
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
              <img
                src={artist.profile_picture}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Artist name and tagline */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{artist.name}</h1>
              {artist.tagline && (
                <p className="text-red-500 font-medium mt-2 italic">"{artist.tagline}"</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Bio and info */}
            <div className="lg:w-2/3">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-red-500" />
                  Artist Story
                </h2>
                <div className="text-gray-600 leading-relaxed">
                  {artist.bio || "No biography available."}
                </div>
              </div>
              
              {/* Additional info */}
              {/* {artist.location && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                    Location
                  </h2>
                  <p className="text-gray-600">{artist.location}</p>
                </div>
              )} */}
              
              {/* Other artist-specific fields can be added here */}
            </div>
            
            {(artist.instagram || artist.portfolio || artist.other_social) && (
              <div className="lg:w-1/3 bg-gray-50 rounded-lg p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-red-500" />
                  Connect
                </h2>
              
                <div className="space-y-4">
                  {artist.instagram && (
                    <a 
                      href={artist.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-300"
                    >
                      <Instagram className="w-5 h-5 text-red-500 mr-3" />
                      <span className="text-gray-700">Instagram</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                  
                  {artist.portfolio && (
                    <a 
                      href={artist.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-300"
                    >
                      <Globe className="w-5 h-5 text-red-500 mr-3" />
                      <span className="text-gray-700">Portfolio</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                  
                  {artist.other_social && (
                    <a 
                      href={artist.other_social} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-300"
                    >
                      <ExternalLink className="w-5 h-5 text-red-500 mr-3" />
                      <span className="text-gray-700">Other Links</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                </div>
            </div>)}
          </div>
        </div>
      </div>
      
      {/* Related Products Section - Left as is per instruction */}
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
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-[250px] object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-gray-800 text-lg">{product.title}</h2>
                    <p className="text-gray-900 text-sm font-semibold mt-2">₹ {product.platform_price}</p>
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
import React from "react";
import Link from "next/link";
import { Artist, Product } from "@/Types"; // Assuming you have these types defined

type Props = {
  artist: Artist;
  relatedProducts: Product[];
};

const ArtistDetails: React.FC<Props> = ({ artist, relatedProducts }) => {
  return (
    <section className="max-container mt-20">
      <div className="flex flex-col items-center">
        {/* Artist Profile Section */}
        <div className="flex flex-col md:flex-row w-full bg-white shadow-lg overflow-hidden">
          <div className="w-full md:w-1/3">
            <img
              src={artist.profile_picture}
              alt={artist.name}
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="w-full md:w-2/3 p-6">
            <h1 className="text-4xl font-bold text-gray-800">{artist.name}</h1>
            <p className="text-md text-gray-600 mt-2">{artist.bio || "No biography available."}</p>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12 w-full">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">Crafted Products</h2>
          
          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 gap-4 flex-1 mt-4 p-4">
            {relatedProducts.length === 0 ? (
              <p>No crafted products found.</p>
            ) : (
              relatedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} passHref>
                  <div className="border p-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg flex flex-col h-full cursor-pointer">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-80 object-cover rounded-md"
                    />
                    <h3 className="mt-2 font-semibold flex-grow">{product.title}</h3>
                    <div className="mt-2">
                      <p className="font-bold text-left">₹ {product.price}</p>
                      <p className="text-xs text-gray-500 text-left">Artist: {artist.name}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistDetails;

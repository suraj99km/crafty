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
          <h2 className="text-3xl font-bold text-gray-800 text-center">Crafted Products</h2>
          
          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 gap-8 flex-1 p-8">
            {relatedProducts.length === 0 ? (
              <p>No crafted products found.</p>
            ) : (
              relatedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} passHref>
                <div key={product.id} className="product__card">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-[280px] object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
                  />
                  <div className="flex justify-between items-center mt-4 mb-3 font-palanquin">
                    <h2 className="font-bold ml-6 text-gray-800 text-md 2xl:text-xl">{product.title}</h2>
                    <p className="text-gray-900 mr-4 text-sm 2xl:text-lg font-semibold">₹ {product.price}</p>
                  </div>
                  <p className="text-center text-xs text-gray-700 mb-2">
                    Crafted by <span className="font-bold text-gray-900">{artist.name || "Unknown Artist"}</span>
                  </p>
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

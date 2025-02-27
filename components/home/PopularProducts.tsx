'use client';

import { useEffect, useState } from 'react';
import { fetchProductsWithArtists } from '@/lib/supabase-db/utils';
import { Product } from '@/Types';
import Link from 'next/link';

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchedProducts = await fetchProductsWithArtists();
        if (fetchedProducts) {
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <section id="Products" className="max-w-7xl mx-auto px-2 py-10">
      <div className="flex flex-col">
        {/* Section Title */}
        <h2 className="text-3xl font-extrabold text-gray-900">Popular Products</h2>

        {/* Loader */}
        {products.length === 0 ? (
          <div className="mt-16 flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-gray-300 rounded-full animate-spin border-t-red-500"></div>
          </div>
        ) : (
          <div className="mt-8 grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {products.slice(0, visibleCount).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} passHref>
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-95 cursor-pointer">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-[280px] object-cover rounded-t-xl"
                  />
                  <div className="px-4 py-3">
                    <div className="flex justify-between items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">{product.title}</h2>
                      <p className="text-gray-800 font-bold text-lg">₹ {product.price}</p>
                    </div>
                    <p className="text-gray-700 text-sm text-center mt-2">
                      Crafted by <span className="font-semibold text-gray-900">{product.artist_name || "Unknown Artist"}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Buttons Section */}
      <div className="text-center mt-6">
        {visibleCount < 8 && visibleCount < products.length && (
          <button
            className="py-2 px-4 text-red-500 font-semibold underline transition-all duration-300 hover:text-red-700"
            onClick={handleShowMore}
          >
            Show More
          </button>
        )}

        {visibleCount >= 8 && products.length > 8 && (
          <div className="flex justify-center mt-8">
            <a
              href="/products"
              className="inline-block px-6 py-3 font-bold text-white bg-red-500 rounded-lg shadow-lg transition-all duration-300 hover:bg-red-700 hover:shadow-xl active:scale-95"
            >
              Explore All
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularProducts;

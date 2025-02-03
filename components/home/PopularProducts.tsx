'use client';

import { useEffect, useState } from 'react';
import { fetchProductsWithArtists } from '@/lib/supabase/utils';
import { Product } from '@/Types';

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 products

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
    <section id="Products" className="max-container max-sm:mt-12">
      <div className="flex flex-col justify-start">
        <h2 className="text-4xl font-palanquin font-bold">Popular Products</h2>
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="mt-8 grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {products.slice(0, visibleCount).map((product) => (
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
                  Crafted by <span className="font-bold text-gray-900">{product.artist_name || "Unknown Artist"}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons Section */}
      <div className="text-center mt-6">
        {visibleCount < 10 && visibleCount < products.length && (
          <button
            className="py-2 px-4 text-black underline font-semibold transition-all duration-300 hover:text-gray-700"
            onClick={handleShowMore}
          >
            Show More
          </button>
        )}

        {visibleCount >= 10 && products.length > 10 && (
          <div className="flex justify-center mt-8">
            <a
              href="/products"
              className="inline-block px-6 py-3 text-white bg-red-600 rounded-lg shadow-md transition-all duration-300 hover:bg-red-700 hover:shadow-lg active:scale-95"
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

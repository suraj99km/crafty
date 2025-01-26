'use client';

import { useEffect, useState } from 'react';
import { fetchProductsWithArtists } from '@/lib/supabase/utils';
import { Product } from '@/Types'; // Assuming your `Product` type is exported from this path

const PopularProducts = () => {
  // Use the Product interface here
  const [products, setProducts] = useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false); 

  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchedProducts = await fetchProductsWithArtists();
        
        if (fetchedProducts) {
          setProducts(fetchedProducts); // This should now match the defined type
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, []);

  // Function to handle toggle for showing all products
  const handleShowAll = () => {
    setShowAll((prev) => !prev); // Toggle the value of showAll
  };

  // Determine the products to show based on showAll state
  const productsToShow = showAll ? products : products.slice(0, 4);

  return (
    <section id="Products" className="max-container max-sm:mt-12">
    <div className="flex flex-col justify-start">
      <h2 className="text-4xl font-palanquin font-bold">Popular Products</h2>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="mt-8 grid xl-grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 sm:gap-4 lg:gap-6 xl:gap-8">
          {productsToShow.map((product) => (
            <div key={product.id} className="product__card">
              <img src={product.image_url} alt={product.title} className="w-full 2xl:h-[280px] h-[280px] object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"/>
              <div className="flex justify-between items-center mt-4 mb-3 font-palanquin">
                <h2 className="font-bold ml-6 text-gray-800 text-md 2xl:text-xl">{product.title}</h2>
                <p className="text-gray-900 mr-4 text-sm 2xl:text-lg font-semibold">₹ {product.price}</p>
              </div>

              <p className="text-center text-xs text-gray-700 mb-2">
              Crafted by <span className="font-bold text-gray-900">
              {product.artist_name || "Unknown Artist"}
              </span>
              </p>
            </div>
          ))}
        </div>
      )}
      </div>
     {/* Show All / Show Less Button with simple navigation */}
     <div className="text-center mt-6">
        <button
          className="py-2 px-4 text-blackw-500 underline font-semibold"
          onClick={handleShowAll}
        >
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      </div>

    </section>
  );
};

export default PopularProducts;

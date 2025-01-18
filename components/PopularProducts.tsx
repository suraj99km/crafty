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
        <div className="mt-8 grid xl-grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-6 sm:gap-4 lg:gap-6 xl:gap-8">
          {productsToShow.map((product) => (
            <div key={product.id} className="flex flex-col w-full max-w-xs mx-auto bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <img src={product.image_url} alt={product.title} className="w-full h-[280px] object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"/>
              <h2 className="font-bold mt-4 text-center text-xl font-palanquin text-gray-800">{product.title}</h2>
              <p className="text-right text-lg font-semibold py-1 text-gray-900 mr-4">₹ {product.price}</p>
              <p className="text-center text-sm text-gray-700 mb-2">
                Crafted by <span className="font-bold text-gray-900">
                {product.Artists[0]?.name || 'Unknown Artist'}
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

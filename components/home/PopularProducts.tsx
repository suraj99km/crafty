'use client';

import { useEffect, useState } from 'react';
import { fetchProductsWithArtists } from '@/lib/supabase-db/utils';
import { Product } from '@/Types';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Define how many products to show initially per device size
  const getInitialCount = () => {
    if (typeof window === "undefined") return 5; // Default for SSR
    if (window.innerWidth >= 1280) return 5; // xl
    if (window.innerWidth >= 1024) return 4; // lg
    if (window.innerWidth >= 768) return 6; // md
    if (window.innerWidth >= 640) return 6; // sm
    return 5; // xs
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await fetchProductsWithArtists();
        if (fetchedProducts) {
          setProducts(fetchedProducts);
          // Set initial visible products
          const initialCount = getInitialCount();
          setVisibleProducts(fetchedProducts.slice(0, initialCount));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Reset visible products to first row when screen size changes
      const initialCount = getInitialCount();
      setVisibleProducts(products.slice(0, initialCount));
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [products]);

  const handleShowMore = () => {
    // Add 5 more products to the visible list
    const currentCount = visibleProducts.length;
    const newCount = currentCount + 5;
    setVisibleProducts(products.slice(0, newCount));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="w-full px-4 pt-8 md:px-8 lg:px-12 bg-white">
      {/* Section Title */}
      <div className="relative inline-block mb-10">
        <motion.h2 className="text-3xl font-bold text-center mb-2">
          Popular Products
        </motion.h2>
        <motion.span className="absolute -bottom-2 left-0 h-1 bg-red-500"
          initial={{ width: 0 }} 
          whileInView={{ width: "60%" }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-t-red-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <motion.div 
            className="mt-8 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6"
            variants={typeof window !== "undefined" && window.innerWidth >= 768 ? containerVariants : undefined}
            initial={typeof window !== "undefined" && window.innerWidth >= 768 ? "hidden" : undefined}
            animate={typeof window !== "undefined" && window.innerWidth >= 768 ? "visible" : undefined}
          >
            <AnimatePresence>
              {visibleProducts.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  id={`product-${index}`}  
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  variants={typeof window !== "undefined" && window.innerWidth >= 768 ? itemVariants : undefined}
                  whileHover={typeof window !== "undefined" && window.innerWidth >= 768 ? { scale: 1.03 } : undefined}
                  whileTap={typeof window !== "undefined" && window.innerWidth >= 768 ? { scale: 0.98 } : undefined}
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden">
                      <img src={product.image_url || "/placeholder.png"} 
                        alt={product.title} className="w-full h-full object-cover"/>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 truncate">{product.title}</h3>
                      <p className="font-bold">₹ {product.price}</p>
                      <p className="flex items-center justify-center text-gray-900 text-sm mt-2">
                        Crafted by <span className="font-semibold ml-1">{product.artist_name || "Unknown Artist"}</span>
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Action Buttons - Now positioned properly after the grid */}
          <div className="flex justify-center mt-8 w-full">
            {visibleProducts.length < products.length && visibleProducts.length < 8 ? (
              <motion.button
                onClick={handleShowMore}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                Show More
              </motion.button>
            ) : visibleProducts.length >= 8 && products.length > 8 ? (
              <motion.button
                onClick={() => window.location.href = '/products'}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                Explore All
              </motion.button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default PopularProducts;
'use client';

import { useState, useEffect } from 'react';
import { fetchPopularArtists } from '@/lib/supabase-db/utils';
import { Artist } from '@/Types';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const PopularArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [visibleArtists, setVisibleArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  // Define how many artists to show initially per device size
  const getInitialCount = () => {
    if (typeof window === "undefined") return 5; // Default for SSR
    if (window.innerWidth >= 1280) return 5; // xl
    if (window.innerWidth >= 1024) return 4; // lg
    if (window.innerWidth >= 768) return 6; // md
    if (window.innerWidth >= 640) return 6; // sm
    return 5; // xs
  };

  useEffect(() => {
    const getArtists = async () => {
      setLoading(true);
      try {
        const fetchedArtists = await fetchPopularArtists();
        if (fetchedArtists) {
          setArtists(fetchedArtists);
          // Set initial visible artists
          const initialCount = getInitialCount();
          setVisibleArtists(fetchedArtists.slice(0, initialCount));
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setLoading(false);
      }
    };
    getArtists();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Reset visible artists to first row when screen size changes
      const initialCount = getInitialCount();
      setVisibleArtists(artists.slice(0, initialCount));
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [artists]);

  const handleShowMore = () => {
    // Add 5 more artists to the visible list
    const currentCount = visibleArtists.length;
    const newCount = currentCount + 5;
    setVisibleArtists(artists.slice(0, newCount));
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
    <section id="PopularArtists" className="w-full px-4 py-8 md:px-8 lg:px-12 bg-white">
      {/* Section Title */}
      <div className="relative inline-block mb-10">
        <motion.h2 className="text-3xl font-bold text-center mb-2">
          Popular Artists
        </motion.h2>
        <motion.span className="absolute -bottom-2 left-0 h-1 bg-red-500"
          initial={{ width: 0 }} 
          whileInView={{ width: "60%" }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Artist Grid */}
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
              {visibleArtists.map((artist, index) => (
                <motion.div 
                  key={artist.id} 
                  id={`artist-${index}`}  
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  variants={typeof window !== "undefined" && window.innerWidth >= 768 ? itemVariants : undefined}
                  whileHover={typeof window !== "undefined" && window.innerWidth >= 768 ? { scale: 1.03 } : undefined}
                  whileTap={typeof window !== "undefined" && window.innerWidth >= 768 ? { scale: 0.98 } : undefined}
                >
                  <Link href={`/artists/${artist.id}`}>
                    <div className="relative aspect-square overflow-hidden">
                      <img src={artist.profile_picture || "/placeholder.png"} 
                        alt={artist.name} className="w-full h-full object-cover"/>
                    </div>
                    <div className="p-2 text-center">
                      <h3 className="font-semibold text-lg mb-1 truncate">{artist.name}</h3>
                      {artist.tagline?.trim() && (
                        <p className="text-gray-600 text-xs mt-1 italic">"{artist.tagline}"</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Action Buttons - Now positioned properly after the grid */}
          <div className="flex justify-center mt-8 w-full">
            {visibleArtists.length < artists.length && visibleArtists.length < 8 ? (
              <motion.button
                onClick={handleShowMore}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                Show More
              </motion.button>
            ) : visibleArtists.length >= 8 && artists.length > 8 ? (
              <motion.button
                onClick={() => window.location.href = '/artists'}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                Explore All
              </motion.button>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
};

export default PopularArtists;
'use client';

import { useState, useEffect } from 'react';
import { fetchPopularArtists } from '@/lib/supabase/utils';
import { Artist } from '@/Types';
import Link from 'next/link';

const PopularArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const getArtists = async () => {
      try {
        const fetchedArtists = await fetchPopularArtists();
        if (fetchedArtists) {
          setArtists(fetchedArtists);
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    getArtists();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <section id="PopularArtists" className="max-container max-sm:mt-2">
      <div className="flex flex-col justify-start">
        <h2 className="text-3xl font-palanquin font-bold">Popular Artists</h2>

        {artists.length === 0 ? (
          <div className="mt-16 flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-gray-300 rounded-full animate-spin border-t-red-500"></div>
          </div>
        ) : (
          <div className="mt-8 grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-2 gap-6">
            {artists.slice(0, visibleCount).map((artist) => (
              <Link key={artist.id} href={`/artists/${artist.id}`}>
                <div
                  className="product__card transform transition-transform duration-500 hover:scale-95"
                >
                  <img
                    src={artist.profile_picture}
                    alt={artist.name}
                    className="w-full h-[280px] object-cover rounded-t-lg"
                  />
                  <h2 className="font-bold my-4 text-center text-xl font-palanquin text-gray-800">
                    {artist.name}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Buttons Section */}
      <div className="text-center mt-6">
        {visibleCount < artists.length && (
          <button
            className="py-2 px-4 text-black underline font-semibold transition-all duration-300 hover:text-gray-700"
            onClick={handleShowMore}
          >
            Show More
          </button>
        )}

        {visibleCount >= artists.length && artists.length > 5 && (
          <div className="flex justify-center mt-8">
            <a
              href="/artists"
              className="inline-block font-semibold px-6 py-3 text-white bg-red-500 rounded-lg shadow-md transition-all duration-300 hover:bg-red-700 hover:shadow-lg active:scale-95"
            >
              Explore All
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularArtists;

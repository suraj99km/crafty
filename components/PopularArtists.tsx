"use client"

import { useState, useEffect } from 'react';
import { fetchPopularArtists } from '@/lib/supabase/utils'; // Create this function in your utils
import { Artist } from '@/Types'; // Assuming you have an Artist type

const PopularArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [showAll, setShowAll] = useState(false);

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

  const handleShowAll = () => {
    setShowAll((prev) => !prev); // Toggle the value of showAll
  };

  const artistsToShow = showAll ? artists : artists.slice(0, 4);

  return (
    <div>
      <h2 className="text-4xl font-bold">Popular Artists</h2>
      {artistsToShow.length === 0 ? (
        <p>No artists found</p>
      ) : (
        <div className="mt-8 grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-2 gap-6">
          {artistsToShow.map((artist) => (
            <div
              key={artist.id}
              className="flex flex-col w-full max-w-xs mx-auto bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                src={artist.profile_picture} // Make sure you have an image URL for artists
                alt={artist.name}
                className="w-full h-[280px] object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
              />
              <h2 className="font-bold my-4 text-center text-xl font-palanquin text-gray-800">
                {artist.name}
              </h2>
            </div>
          ))}
        </div>
      )}

      {/* Show All / Show Less Button for Artists */}
      <div className="text-center mt-6">
        <button
          className="py-2 px-4 text-black-500 underline font-semibold"
          onClick={handleShowAll}
        >
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      </div>
    </div>
  );
};

export default PopularArtists;

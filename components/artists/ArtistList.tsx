'use client';

import React, { useState, useEffect } from "react";
import { fetchPopularArtists } from "@/lib/supabase/utils"; // Import the function to fetch artists
import Link from "next/link";
import { Artist } from "@/Types"; // Assuming you have an Artist type

const ArtistList = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  useEffect(() => {
    const getArtists = async () => {
      setLoading(true);
      try {
        const data = await fetchPopularArtists(); // Fetch all artists
        if (data && Array.isArray(data)) {
          // Remove duplicates by using a Set to track IDs
          const uniqueArtists = Array.from(
            new Map(data.map((artist) => [artist.id, artist])).values()
          );
          setArtists(uniqueArtists); // Update state with unique artists
        } else {
          console.error("Fetched data is not an array:", data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching artists:", error);
        setLoading(false);
      }
    };

    getArtists();
  }, []); // Empty dependency array means this will run once when the component mounts

  // Filter artists based on search input
  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-300 rounded-full animate-spin border-t-red-500"></div>
    </div>
  ); // Show loading state with spinner

  return (
    <section className="container mx-auto p-2 mt-14 min-h-screen">
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search for an artist..."
          className="border p-2 rounded-lg flex-grow shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update the search query state on input change
        />
      </div>

      {/* Artist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredArtists.map((artist) => (
          <Link key={artist.id} href={`/artists/${artist.id}`}>  {/* This is the dynamic route */}
            <div className="border rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg flex flex-col h-full">
              <img
                src={artist.profile_picture}
                alt={artist.name}
                className="w-full h-40 object-cover rounded-t-md"
              />
              <h3 className="my-2 font-semibold text-center text-md truncate">{artist.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ArtistList;

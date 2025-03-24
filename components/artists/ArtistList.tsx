'use client';

import React, { useState, useEffect } from "react";
import { fetchPopularArtists } from "@/lib/supabase-db/utils";
import Link from "next/link";
import { Artist } from "@/Types";
import { Search } from "lucide-react";

const ArtistList = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getArtists = async () => {
      setLoading(true);
      try {
        const data = await fetchPopularArtists();
        if (data && Array.isArray(data)) {
          const uniqueArtists = Array.from(
            new Map(data.map((artist) => [artist.id, artist])).values()
          );
          setArtists(uniqueArtists);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setLoading(false);
      }
    };
    getArtists();
  }, []);

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="container mx-auto px-4 mt-16 min-h-screen pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Popular Artists</h1>
        <p className="text-gray-600 text-sm">Discover and explore talented artists</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for an artist..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-500 text-sm">Loading artists...</p>
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-700">No artists found</h3>
          <p className="text-gray-500 mt-1 text-sm">Try adjusting your search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredArtists.map((artist) => (
            <Link key={artist.id} href={`/artists/${artist.id}`}>
              <div className="group bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow transition-all duration-300 flex flex-col h-full">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={artist.profile_picture}
                    alt={artist.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-center truncate text-sm">{artist.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default ArtistList;
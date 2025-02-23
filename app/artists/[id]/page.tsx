"use client";

import { use, useEffect, useState } from "react";
import ArtistDetails from "@/components/artists/ArtistDetails";
import { Artist, Product } from "@/Types";
import { fetchArtistDetails, fetchRelatedProducts } from "@/lib/supabase-db/utils"; // Importing utilities

const ArtistPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params); // Unwrapping params Promise
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when data fetching begins
      try {
        const artistData = await fetchArtistDetails(id);
        if (!artistData) throw new Error("Artist not found");

        const productsData = await fetchRelatedProducts(id);
        
        setArtist(artistData);
        setRelatedProducts(productsData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after data fetching completes (success or failure)
      }
    };

    fetchData();
  }, [id]); // Only run the effect when the artist ID changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-300 rounded-full animate-spin border-t-red-500"></div>
      </div>
    );
  }

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return <ArtistDetails artist={artist} relatedProducts={relatedProducts} />;
};

export default ArtistPage;

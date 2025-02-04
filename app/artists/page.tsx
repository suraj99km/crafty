// app/artists/page.tsx (Artists Listing Page)
import React from "react";
import ArtistList from "@/components/artists/ArtistList"; // Updated path

const ArtistsGrid = () => {
  return (
    <div className="container mx-auto p-4">
      <ArtistList />
    </div>
  );
};

export default ArtistsGrid; // Updated export name

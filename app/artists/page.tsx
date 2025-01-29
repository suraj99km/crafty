// app/artists/page.tsx (Artists Listing Page)
import React from "react";
import ArtistList from "@/components/artists/ArtistList"; // Updated path

const ArtistsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <ArtistList />
    </div>
  );
};

export default ArtistsPage; // Updated export name

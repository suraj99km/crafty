"use client";

import { use, useEffect, useState } from "react";
import { fetchProductDetails, fetchArtistDetails } from "@/lib/supabase-db/utils"; // Import utils
import ProductDetails from "@/components/products/ProductDetails";
import { Product, Artist } from "@/Types";

const ProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params); // Unwrapping params promise
  const [product, setProduct] = useState<Product | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productData = await fetchProductDetails(id);
        if (!productData) throw new Error("Product not found");

        setProduct(productData);

        console.log(productData);

        // Fetch the artist details related to the product
        const artistData = await fetchArtistDetails(productData.artist_id);
        setArtist(artistData);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Show a loading spinner until data is fetched
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-300 rounded-full animate-spin border-t-red-500"></div>
    </div>
  );

  if (!product) return <div className="text-center mt-10">Product not found.</div>;

  return <ProductDetails product={product} artist={artist} />;
};

export default ProductPage;

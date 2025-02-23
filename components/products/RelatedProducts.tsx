import React, { useState, useEffect } from "react";
import { Product } from "@/Types";
import ProductCard from "@/components/products/ProductCard";

const RelatedProducts = ({ cartItems }: { cartItems: Product[] }) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (cartItems.length === 0) return; // No request if no items
  
    const categories = Array.from(
      new Set(cartItems.map((item) => item.category).filter((cat): cat is string => Boolean(cat)))
    );
  
    if (categories.length > 0) {
      const encodedCategories = categories.map((cat) => encodeURIComponent(cat)).join(",");
      fetch(`/api/related-products?categories=${encodedCategories}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch related products");
          return res.json();
        })
        .then((data) => setRelatedProducts(data))
        .catch((err) => console.error("Error fetching related products:", err));
    }
  }, [cartItems]);
  

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">You May Also Like</h2>
      <div className="flex overflow-x-auto gap-3 scrollbar-hide">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

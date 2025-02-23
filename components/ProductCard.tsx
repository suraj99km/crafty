import React from "react";
import Link from "next/link";
import { Product } from "@/Types";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link key={product.id} href={`/products/${product.id}`} passHref>
      <div className="border p-2 rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-lg flex flex-col h-full">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-40 object-cover rounded-md"
        />
        <h3 className="mt-2 font-semibold flex-grow">{product.title}</h3>
        <div className="mt-2">
          <p className="font-bold text-left">₹ {product.price}</p>
          <p className="text-xs text-gray-500 text-left">Artist: {product.artist_name}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
